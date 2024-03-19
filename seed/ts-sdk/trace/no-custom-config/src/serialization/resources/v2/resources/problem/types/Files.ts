/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../..";
import * as SeedTrace from "../../../../../../api";
import * as core from "../../../../../../core";
import { FileInfoV2 } from "./FileInfoV2";

export const Files: core.serialization.ObjectSchema<serializers.v2.Files.Raw, SeedTrace.v2.Files> =
    core.serialization.object({
        files: core.serialization.list(FileInfoV2),
    });

export declare namespace Files {
    interface Raw {
        files: FileInfoV2.Raw[];
    }
}
