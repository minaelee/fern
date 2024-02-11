/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as errors from "../../../../errors";

export class UnauthorizedError extends errors.SeedTraceError {
    constructor() {
        super({
            message: "UnauthorizedError",
            statusCode: 401,
        });
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
