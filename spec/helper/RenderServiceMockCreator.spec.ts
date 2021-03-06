/// <reference path="../../typings/index.d.ts" />

import {Subject} from "rxjs/Subject";

import {MockCreator} from "./MockCreator.spec";
import {MockCreatorBase} from "./MockCreatorBase.spec";
import {
    RenderService,
    RenderCamera,
} from "../../src/Render";

export class RenderServiceMockCreator extends MockCreatorBase<RenderService> {
    public create(): RenderService {
        const mock: RenderService = new MockCreator().create(RenderService, "RenderService");

        this._mockProperty(mock, "bearing$", new Subject<RenderCamera>());
        this._mockProperty(mock, "renderCamera$", new Subject<RenderCamera>());
        this._mockProperty(mock, "size$", new Subject<RenderCamera>());

        return mock;
    }
}

export default RenderServiceMockCreator;
