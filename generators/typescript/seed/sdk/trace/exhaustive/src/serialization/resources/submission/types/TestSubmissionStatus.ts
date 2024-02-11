/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SeedTrace from "../../../../api";
import * as core from "../../../../core";

export const TestSubmissionStatus: core.serialization.Schema<
    serializers.TestSubmissionStatus.Raw,
    SeedTrace.TestSubmissionStatus
> = core.serialization
    .union("type", {
        stopped: core.serialization.object({}),
        errored: core.serialization.object({
            value: core.serialization.lazy(async () => (await import("../../..")).ErrorInfo),
        }),
        running: core.serialization.object({
            value: core.serialization.lazy(async () => (await import("../../..")).RunningSubmissionState),
        }),
        testCaseIdToState: core.serialization.object({
            value: core.serialization.record(
                core.serialization.string(),
                core.serialization.lazy(async () => (await import("../../..")).SubmissionStatusForTestCase)
            ),
        }),
    })
    .transform<SeedTrace.TestSubmissionStatus>({
        transform: (value) => {
            switch (value.type) {
                case "stopped":
                    return SeedTrace.TestSubmissionStatus.stopped();
                case "errored":
                    return SeedTrace.TestSubmissionStatus.errored(value.value);
                case "running":
                    return SeedTrace.TestSubmissionStatus.running(value.value);
                case "testCaseIdToState":
                    return SeedTrace.TestSubmissionStatus.testCaseIdToState(value.value);
                default:
                    return SeedTrace.TestSubmissionStatus._unknown(value);
            }
        },
        untransform: ({ _visit, ...value }) => value as any,
    });

export declare namespace TestSubmissionStatus {
    type Raw =
        | TestSubmissionStatus.Stopped
        | TestSubmissionStatus.Errored
        | TestSubmissionStatus.Running
        | TestSubmissionStatus.TestCaseIdToState;

    interface Stopped {
        type: "stopped";
    }

    interface Errored {
        type: "errored";
        value: serializers.ErrorInfo.Raw;
    }

    interface Running {
        type: "running";
        value: serializers.RunningSubmissionState.Raw;
    }

    interface TestCaseIdToState {
        type: "testCaseIdToState";
        value: Record<string, serializers.SubmissionStatusForTestCase.Raw>;
    }
}
