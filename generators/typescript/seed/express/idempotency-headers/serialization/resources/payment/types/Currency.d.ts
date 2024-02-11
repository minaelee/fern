/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../..";
import * as SeedIdempotencyHeaders from "../../../../api";
import * as core from "../../../../core";
export declare const Currency: core.serialization.Schema<serializers.Currency.Raw, SeedIdempotencyHeaders.Currency>;
export declare namespace Currency {
    type Raw = "USD" | "YEN";
}
