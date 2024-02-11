/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as SeedTrace from "../../../../..";
import * as core from "../../../../../../core";

export type Error = SeedTrace.v2.problem.getLightweightProblems.Error._Unknown;

export declare namespace Error {
    interface _Unknown extends _Utils {
        errorName: void;
        content: core.Fetcher.Error;
    }

    interface _Utils {
        _visit: <_Result>(visitor: SeedTrace.v2.problem.getLightweightProblems.Error._Visitor<_Result>) => _Result;
    }

    interface _Visitor<_Result> {
        _other: (value: core.Fetcher.Error) => _Result;
    }
}

export const Error = {
    _unknown: (fetcherError: core.Fetcher.Error): SeedTrace.v2.problem.getLightweightProblems.Error._Unknown => {
        return {
            errorName: undefined,
            content: fetcherError,
            _visit: function <_Result>(
                this: SeedTrace.v2.problem.getLightweightProblems.Error._Unknown,
                visitor: SeedTrace.v2.problem.getLightweightProblems.Error._Visitor<_Result>
            ) {
                return SeedTrace.v2.problem.getLightweightProblems.Error._visit(this, visitor);
            },
        };
    },

    _visit: <_Result>(
        value: SeedTrace.v2.problem.getLightweightProblems.Error,
        visitor: SeedTrace.v2.problem.getLightweightProblems.Error._Visitor<_Result>
    ): _Result => {
        switch (value.errorName) {
            default:
                return visitor._other(value as any);
        }
    },
} as const;
