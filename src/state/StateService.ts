/// <reference path="../../typings/browser.d.ts" />

import * as rx from "rx";

import {Node} from "../Graph";
import {ILatLonAlt} from "../Geo";
import {
    FrameGenerator,
    IStateContext,
    IFrame,
    IRotation,
    StateContext,
    State,
} from "../State";

interface IContextOperation {
    (context: IStateContext): IStateContext;
}

interface IContextAction {
    (context: IStateContext): void;
}

export class StateService {
    private _frame$: rx.Subject<number>;

    private _contextOperation$: rx.BehaviorSubject<IContextOperation>;
    private _context$: rx.Observable<IStateContext>;
    private _fps$: rx.Observable<number>;
    private _state$: rx.Observable<State>;

    private _currentState$: rx.Observable<IFrame>;
    private _currentNode$: rx.Observable<Node>;
    private _reference$: rx.Observable<ILatLonAlt>;

    private _appendNode$: rx.Subject<Node> = new rx.Subject<Node>();

    private _frameGenerator: FrameGenerator;
    private _frameId: number;

    private _fpsSampleRate: number;

    constructor () {
        this._frame$ = new rx.Subject<number>();
        this._fpsSampleRate = 30;

        this._contextOperation$ = new rx.BehaviorSubject<IContextOperation>(
            (context: IStateContext): IStateContext => {
                return context;
            });

        this._context$ = this._contextOperation$
            .scan<IStateContext>(
                (context: IStateContext, operation: IContextOperation): IStateContext => {
                    return operation(context);
                },
                new StateContext())
             .shareReplay(1);

        this._state$ = this._context$
            .map<State>(
                (context: IStateContext): State => {
                    return context.state;
                })
            .distinctUntilChanged()
            .shareReplay(1);

        this._fps$ = this._frame$
            .filter(
                (frameId: number): boolean => {
                    return (frameId % this._fpsSampleRate) === 0;
                })
            .scan<[number, number]>(
                (fps: [number, number], frameId: number): [number, number] => {
                    let now: number = new Date().getTime();
                    return [now, (this._fpsSampleRate / (now - fps[0])) * 1000];
                },
                [new Date().getTime(), 60])
            .map<number>(
                (fps: [number, number]): number => {
                    return Math.max(30, fps[1]);
                })
            .startWith(60);

        this._currentState$ = this._frame$
            .withLatestFrom(
                this._fps$,
                this._context$,
                (frameId: number, fps: number, context: IStateContext): [number, number, IStateContext] => {
                    return [frameId, fps, context];
                })
            .do(
                (fc: [number, number, IStateContext]): void => {
                    fc[2].update(fc[1]);
                })
            .map<IFrame>(
                (fc: [number, number, IStateContext]): IFrame => {
                    return { fps: fc[1], id: fc[0], state: fc[2] };
                })
            .shareReplay(1);

        let nodeChanged$: rx.Observable<IFrame> = this._currentState$
            .filter(
                (f: IFrame): boolean => {
                    return f.state.currentNode != null;
                })
            .distinctUntilChanged(
                (f: IFrame): string => {
                    return f.state.currentNode.key;
                })
            .shareReplay(1);

        this._currentNode$ = nodeChanged$
            .map<Node>(
                (f: IFrame): Node => {
                    return f.state.currentNode;
                })
            .shareReplay(1);

        this._reference$ = nodeChanged$
            .map<ILatLonAlt>(
                (f: IFrame): ILatLonAlt => {
                    return f.state.reference;
                })
            .distinctUntilChanged(
                (reference: ILatLonAlt): number => {
                    return reference.lat * reference.lon;
                })
            .shareReplay(1);

        this._appendNode$
            .map<IContextOperation>(
                (node: Node) => {
                    return (context: IStateContext): IStateContext => {
                        context.append([node]);

                        return context;
                    };
                })
            .subscribe(this._contextOperation$);

        this._state$.subscribe();
        this._currentNode$.subscribe();
        this._reference$.subscribe();

        this._frameId = null;
        this._frameGenerator = new FrameGenerator();
    }

    public get currentState$(): rx.Observable<IFrame> {
        return this._currentState$;
    }

    public get currentNode$(): rx.Observable<Node> {
        return this._currentNode$;
    }

    public get state$(): rx.Observable<State> {
        return this._state$;
    }

    public get reference$(): rx.Observable<ILatLonAlt> {
        return this._reference$;
    }

    public get appendNode$(): rx.Subject<Node> {
        return this._appendNode$;
    }

    public traverse(): void {
        this._invokeContextOperation((context: IStateContext) => { context.traverse(); });
    }

    public wait(): void {
        this._invokeContextOperation((context: IStateContext) => { context.wait(); });
    }

    public appendNodes(nodes: Node[]): void {
        this._invokeContextOperation((context: IStateContext) => { context.append(nodes); });
    }

    public prependNodes(nodes: Node[]): void {
        this._invokeContextOperation((context: IStateContext) => { context.prepend(nodes); });
    }

    public removeNodes(n: number): void {
        this._invokeContextOperation((context: IStateContext) => { context.remove(n); });
    }

    public cutNodes(): void {
        this._invokeContextOperation((context: IStateContext) => { context.cut(); });
    }

    public setNodes(nodes: Node[]): void {
        this._invokeContextOperation((context: IStateContext) => { context.set(nodes); });
    }

    public rotate(delta: IRotation): void {
        this._invokeContextOperation((context: IStateContext) => { context.rotate(delta); });
    }

    public move(delta: number): void {
        this._invokeContextOperation((context: IStateContext) => { context.move(delta); });
    }

    public moveTo(position: number): void {
        this._invokeContextOperation((context: IStateContext) => { context.moveTo(position); });
    }

    public start(): void {
        if (this._frameId == null) {
            this._frameId = this._frameGenerator.requestAnimationFrame(this._frame.bind(this));
        }
    }

    public stop(): void {
        if (this._frameId != null) {
            this._frameGenerator.cancelAnimationFrame(this._frameId);
            this._frameId = null;
        }
    }

    private _invokeContextOperation(action: (context: IStateContext) => void): void {
        this._contextOperation$
            .onNext(
                (context: IStateContext): IStateContext => {
                    action(context);

                    return context;
                });
    }

    private _frame(time: number): void {
        this._frameId = this._frameGenerator.requestAnimationFrame(this._frame.bind(this));
        this._frame$.onNext(this._frameId);
    }
}
