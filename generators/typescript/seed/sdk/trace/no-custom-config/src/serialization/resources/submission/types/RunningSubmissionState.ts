/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SeedTrace from "../../../../api";
import * as core from "../../../../core";

export const RunningSubmissionState: core.serialization.Schema<
    serializers.RunningSubmissionState.Raw,
    SeedTrace.RunningSubmissionState
> = core.serialization.enum_([
    "QUEUEING_SUBMISSION",
    "KILLING_HISTORICAL_SUBMISSIONS",
    "WRITING_SUBMISSION_TO_FILE",
    "COMPILING_SUBMISSION",
    "RUNNING_SUBMISSION",
]);

export declare namespace RunningSubmissionState {
    type Raw =
        | "QUEUEING_SUBMISSION"
        | "KILLING_HISTORICAL_SUBMISSIONS"
        | "WRITING_SUBMISSION_TO_FILE"
        | "COMPILING_SUBMISSION"
        | "RUNNING_SUBMISSION";
}
