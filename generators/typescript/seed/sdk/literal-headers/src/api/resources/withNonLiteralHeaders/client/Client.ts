/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as core from "../../../../core";
import * as SeedLiteralHeaders from "../../..";
import urlJoin from "url-join";
import * as errors from "../../../../errors";

export declare namespace WithNonLiteralHeaders {
    interface Options {
        environment: core.Supplier<string>;
    }

    interface RequestOptions {
        timeoutInSeconds?: number;
        maxRetries?: number;
    }
}

export class WithNonLiteralHeaders {
    constructor(protected readonly _options: WithNonLiteralHeaders.Options) {}

    public async get(
        request: SeedLiteralHeaders.WithNonLiteralHeadersRequest,
        requestOptions?: WithNonLiteralHeaders.RequestOptions
    ): Promise<void> {
        const { integer, maybeInteger, nonLiteralEndpointHeader } = request;
        const _response = await core.fetcher({
            url: urlJoin(await core.Supplier.get(this._options.environment), "/with-non-literal-headers"),
            method: "POST",
            headers: {
                "X-API-Header": "api header value",
                "X-API-Test": "false",
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "",
                "X-Fern-SDK-Version": "0.0.1",
                integer: integer.toString(),
                maybeInteger: maybeInteger != null ? maybeInteger.toString() : undefined,
                literalServiceHeader: "service header",
                trueServiceHeader: "true",
                nonLiteralEndpointHeader: nonLiteralEndpointHeader,
                literalEndpointHeader: "endpoint header",
                trueEndpointHeader: "true",
            },
            contentType: "application/json",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return;
        }

        if (_response.error.reason === "status-code") {
            throw new errors.SeedLiteralHeadersError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
            });
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.SeedLiteralHeadersError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.SeedLiteralHeadersTimeoutError();
            case "unknown":
                throw new errors.SeedLiteralHeadersError({
                    message: _response.error.errorMessage,
                });
        }
    }
}
