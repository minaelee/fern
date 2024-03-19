/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../..";
import * as Fiddle from "../../../../../../api";
import * as core from "../../../../../../core";
import { ObjectWithRequiredField } from "../../../../types/resources/object/types/ObjectWithRequiredField";

export const Request: core.serialization.Schema<
    serializers.endpoints.container.getAndReturnMapOfPrimToObject.Request.Raw,
    Record<string, Fiddle.types.ObjectWithRequiredField>
> = core.serialization.record(core.serialization.string(), ObjectWithRequiredField);

export declare namespace Request {
    type Raw = Record<string, ObjectWithRequiredField.Raw>;
}

export const Response: core.serialization.Schema<
    serializers.endpoints.container.getAndReturnMapOfPrimToObject.Response.Raw,
    Record<string, Fiddle.types.ObjectWithRequiredField>
> = core.serialization.record(core.serialization.string(), ObjectWithRequiredField);

export declare namespace Response {
    type Raw = Record<string, ObjectWithRequiredField.Raw>;
}
