/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SeedTrace from "../../../../api";
import * as core from "../../../../core";
import { Migration } from "../types/Migration";

export const Response: core.serialization.Schema<
    serializers.migration.getAttemptedMigrations.Response.Raw,
    SeedTrace.Migration[]
> = core.serialization.list(Migration);

export declare namespace Response {
    type Raw = Migration.Raw[];
}
