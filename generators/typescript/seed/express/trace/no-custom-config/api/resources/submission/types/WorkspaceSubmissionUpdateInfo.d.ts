/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as SeedTrace from "../../..";
export declare type WorkspaceSubmissionUpdateInfo = SeedTrace.WorkspaceSubmissionUpdateInfo.Running | SeedTrace.WorkspaceSubmissionUpdateInfo.Ran | SeedTrace.WorkspaceSubmissionUpdateInfo.Stopped | SeedTrace.WorkspaceSubmissionUpdateInfo.Traced | SeedTrace.WorkspaceSubmissionUpdateInfo.TracedV2 | SeedTrace.WorkspaceSubmissionUpdateInfo.Errored | SeedTrace.WorkspaceSubmissionUpdateInfo.Finished;
export declare namespace WorkspaceSubmissionUpdateInfo {
    interface Running {
        type: "running";
        value: SeedTrace.RunningSubmissionState;
    }
    interface Ran extends SeedTrace.WorkspaceRunDetails {
        type: "ran";
    }
    interface Stopped {
        type: "stopped";
    }
    interface Traced {
        type: "traced";
    }
    interface TracedV2 extends SeedTrace.WorkspaceTracedUpdate {
        type: "tracedV2";
    }
    interface Errored {
        type: "errored";
        value: SeedTrace.ErrorInfo;
    }
    interface Finished {
        type: "finished";
    }
}
