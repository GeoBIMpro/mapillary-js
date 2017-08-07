import {ICurrentState, IRotation, State} from "../../State";
import {Node} from "../../Graph";

export interface IStateContext extends ICurrentState {
    state: State;

    fly(): void;
    traverse(): void;
    wait(): void;

    update(fps: number): void;
    append(nodes: Node[]): void;
    prepend(nodes: Node[]): void;
    remove(n: number): void;
    clear(): void;
    clearPrior(): void;
    cut(): void;
    set(nodes: Node[]): void;

    rotate(delta: IRotation): void;
    rotateBasic(basicRotation: number[]): void;
    rotateBasicUnbounded(basicRotation: number[]): void;
    rotateToBasic(basic: number[]): void;
    move(delta: number): void;
    moveTo(position: number): void;
    zoomIn(delta: number, reference: number[]): void;
    translate(delta: number[]): void;
    orbitAround(delta: IRotation): void;

    getCenter(): number[];
    setCenter(center: number[]): void;
    setZoom(zoom: number): void;
}
