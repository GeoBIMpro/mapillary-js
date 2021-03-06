/// <reference path="../../typings/index.d.ts" />

import {Subject} from "rxjs/Subject";

import {MockCreator} from "./MockCreator.spec";
import {MockCreatorBase} from "./MockCreatorBase.spec";

import {
    ILatLonAlt,
    Transform,
} from "../../src/Geo";
import {Node} from "../../src/Graph";
import {IFrame, StateService} from "../../src/State";

export class StateServiceMockCreator extends MockCreatorBase<StateService> {
    public create(): StateService {
        const mock: StateService = new MockCreator().create(StateService, "StateService");

        this._mockProperty(mock, "currentNode$", new Subject<Node>());
        this._mockProperty(mock, "currentNodeExternal$", new Subject<Node>());
        this._mockProperty(mock, "currentState$", new Subject<IFrame>());
        this._mockProperty(mock, "currentTransform$", new Subject<Transform>());
        this._mockProperty(mock, "inMotion$", new Subject<boolean>());
        this._mockProperty(mock, "reference$", new Subject<ILatLonAlt>());

        return mock;
    }
}

export default StateServiceMockCreator;
