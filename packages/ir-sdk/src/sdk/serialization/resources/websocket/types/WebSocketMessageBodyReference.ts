/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as FernIr from "../../../../api";
import * as core from "../../../../core";

export const WebSocketMessageBodyReference: core.serialization.ObjectSchema<
    serializers.WebSocketMessageBodyReference.Raw,
    FernIr.WebSocketMessageBodyReference
> = core.serialization
    .objectWithoutOptionalProperties({
        bodyType: core.serialization.lazy(async () => (await import("../../..")).TypeReference),
    })
    .extend(core.serialization.lazyObject(async () => (await import("../../..")).WithDocs));

export declare namespace WebSocketMessageBodyReference {
    interface Raw extends serializers.WithDocs.Raw {
        bodyType: serializers.TypeReference.Raw;
    }
}