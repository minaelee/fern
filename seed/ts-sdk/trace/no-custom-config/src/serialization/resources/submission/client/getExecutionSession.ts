/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SeedTrace from "../../../../api";
import * as core from "../../../../core";
import { ExecutionSessionResponse } from "../types/ExecutionSessionResponse";

export const Response: core.serialization.Schema<
    serializers.submission.getExecutionSession.Response.Raw,
    SeedTrace.ExecutionSessionResponse | undefined
> = ExecutionSessionResponse.optional();

export declare namespace Response {
    type Raw = ExecutionSessionResponse.Raw | null | undefined;
}
