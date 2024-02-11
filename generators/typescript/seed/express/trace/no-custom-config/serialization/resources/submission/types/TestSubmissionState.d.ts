/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import * as SeedTrace from "../../../../api";
import * as core from "../../../../core";
export declare const TestSubmissionState: core.serialization.ObjectSchema<serializers.TestSubmissionState.Raw, SeedTrace.TestSubmissionState>;
export declare namespace TestSubmissionState {
    interface Raw {
        problemId: serializers.ProblemId.Raw;
        defaultTestCases: serializers.TestCase.Raw[];
        customTestCases: serializers.TestCase.Raw[];
        status: serializers.TestSubmissionStatus.Raw;
    }
}
