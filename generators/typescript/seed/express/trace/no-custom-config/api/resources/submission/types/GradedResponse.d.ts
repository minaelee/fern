/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as SeedTrace from "../../..";
export interface GradedResponse {
    submissionId: SeedTrace.SubmissionId;
    testCases: Record<string, SeedTrace.TestCaseResultWithStdout>;
}
