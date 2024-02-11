/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../..";
import * as SeedTrace from "../../../../../api";
import * as core from "../../../../../core";

export const StoreTracedTestCaseRequest: core.serialization.Schema<
    serializers.StoreTracedTestCaseRequest.Raw,
    SeedTrace.StoreTracedTestCaseRequest
> = core.serialization.object({
    result: core.serialization.lazyObject(async () => (await import("../../../..")).TestCaseResultWithStdout),
    traceResponses: core.serialization.list(
        core.serialization.lazyObject(async () => (await import("../../../..")).TraceResponse)
    ),
});

export declare namespace StoreTracedTestCaseRequest {
    interface Raw {
        result: serializers.TestCaseResultWithStdout.Raw;
        traceResponses: serializers.TraceResponse.Raw[];
    }
}
