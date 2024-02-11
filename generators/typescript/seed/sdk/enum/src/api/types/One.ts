/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Represents a variety of casing conventions that
 * could collide without special care.
 *
 *
 * @example
 *     SeedEnum.One.One
 */
export type One = "one" | "One" | "ONe" | "ONE";

export const One = {
    One: "one",
    One: "One",
    ONe: "ONe",
    One: "ONE",
} as const;
