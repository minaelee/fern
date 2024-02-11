/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../../../..";
import * as SeedTrace from "../../../../../../api";
import * as core from "../../../../../../core";
export declare const TestCaseV2: core.serialization.ObjectSchema<serializers.v2.TestCaseV2.Raw, SeedTrace.v2.TestCaseV2>;
export declare namespace TestCaseV2 {
    interface Raw {
        metadata: serializers.v2.TestCaseMetadata.Raw;
        implementation: serializers.v2.TestCaseImplementationReference.Raw;
        arguments: Record<serializers.v2.ParameterId.Raw, serializers.VariableValue.Raw>;
        expects?: serializers.v2.TestCaseExpects.Raw | null;
    }
}
