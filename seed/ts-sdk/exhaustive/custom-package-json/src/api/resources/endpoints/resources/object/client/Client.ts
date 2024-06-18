/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as core from "../../../../../../core";
import * as Fiddle from "../../../../../index";
import * as serializers from "../../../../../../serialization/index";
import urlJoin from "url-join";

export declare namespace Object_ {
    interface Options {
        environment: core.Supplier<string>;
        token?: core.Supplier<core.BearerToken | undefined>;
    }

    interface RequestOptions {
        timeoutInSeconds?: number;
        maxRetries?: number;
        abortSignal?: AbortSignal;
    }
}

export class Object_ {
    constructor(protected readonly _options: Object_.Options) {}

    /**
     * @param {Fiddle.types.ObjectWithOptionalField} request
     * @param {Object_.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @example
     *     await client.endpoints.object.getAndReturnWithOptionalField({
     *         string: "string",
     *         integer: 1,
     *         long: 1000000,
     *         double: 1.1,
     *         bool: true,
     *         datetime: new Date("2024-01-15T09:30:00.000Z"),
     *         date: "2023-01-15",
     *         uuid: "d5e9c84f-c2b2-4bf4-b4b0-7ffd7a9ffc32",
     *         base64: "SGVsbG8gd29ybGQh",
     *         list: ["string"],
     *         set: new Set(["string"]),
     *         map: {
     *             1: "string"
     *         },
     *         bigint: "123456789123456789"
     *     })
     */
    public async getAndReturnWithOptionalField(
        request: Fiddle.types.ObjectWithOptionalField,
        requestOptions?: Object_.RequestOptions
    ): Promise<
        core.APIResponse<
            Fiddle.types.ObjectWithOptionalField,
            Fiddle.endpoints.object.getAndReturnWithOptionalField.Error
        >
    > {
        const _response = await core.fetcher({
            url: urlJoin(
                await core.Supplier.get(this._options.environment),
                "/object/get-and-return-with-optional-field"
            ),
            method: "POST",
            headers: {
                Authorization: await this._getAuthorizationHeader(),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "@fern/exhaustive",
                "X-Fern-SDK-Version": "0.0.1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "application/json",
            body: await serializers.types.ObjectWithOptionalField.jsonOrThrow(request, {
                unrecognizedObjectKeys: "strip",
            }),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return {
                ok: true,
                body: await serializers.types.ObjectWithOptionalField.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                }),
            };
        }

        return {
            ok: false,
            error: Fiddle.endpoints.object.getAndReturnWithOptionalField.Error._unknown(_response.error),
        };
    }

    /**
     * @param {Fiddle.types.ObjectWithRequiredField} request
     * @param {Object_.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @example
     *     await client.endpoints.object.getAndReturnWithRequiredField({
     *         string: "string"
     *     })
     */
    public async getAndReturnWithRequiredField(
        request: Fiddle.types.ObjectWithRequiredField,
        requestOptions?: Object_.RequestOptions
    ): Promise<
        core.APIResponse<
            Fiddle.types.ObjectWithRequiredField,
            Fiddle.endpoints.object.getAndReturnWithRequiredField.Error
        >
    > {
        const _response = await core.fetcher({
            url: urlJoin(
                await core.Supplier.get(this._options.environment),
                "/object/get-and-return-with-required-field"
            ),
            method: "POST",
            headers: {
                Authorization: await this._getAuthorizationHeader(),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "@fern/exhaustive",
                "X-Fern-SDK-Version": "0.0.1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "application/json",
            body: await serializers.types.ObjectWithRequiredField.jsonOrThrow(request, {
                unrecognizedObjectKeys: "strip",
            }),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return {
                ok: true,
                body: await serializers.types.ObjectWithRequiredField.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                }),
            };
        }

        return {
            ok: false,
            error: Fiddle.endpoints.object.getAndReturnWithRequiredField.Error._unknown(_response.error),
        };
    }

    /**
     * @param {Fiddle.types.ObjectWithMapOfMap} request
     * @param {Object_.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @example
     *     await client.endpoints.object.getAndReturnWithMapOfMap({
     *         map: {
     *             "string": {
     *                 "string": "string"
     *             }
     *         }
     *     })
     */
    public async getAndReturnWithMapOfMap(
        request: Fiddle.types.ObjectWithMapOfMap,
        requestOptions?: Object_.RequestOptions
    ): Promise<
        core.APIResponse<Fiddle.types.ObjectWithMapOfMap, Fiddle.endpoints.object.getAndReturnWithMapOfMap.Error>
    > {
        const _response = await core.fetcher({
            url: urlJoin(await core.Supplier.get(this._options.environment), "/object/get-and-return-with-map-of-map"),
            method: "POST",
            headers: {
                Authorization: await this._getAuthorizationHeader(),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "@fern/exhaustive",
                "X-Fern-SDK-Version": "0.0.1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "application/json",
            body: await serializers.types.ObjectWithMapOfMap.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" }),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return {
                ok: true,
                body: await serializers.types.ObjectWithMapOfMap.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                }),
            };
        }

        return {
            ok: false,
            error: Fiddle.endpoints.object.getAndReturnWithMapOfMap.Error._unknown(_response.error),
        };
    }

    /**
     * @param {Fiddle.types.NestedObjectWithOptionalField} request
     * @param {Object_.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @example
     *     await client.endpoints.object.getAndReturnNestedWithOptionalField({
     *         string: "string",
     *         nestedObject: {
     *             string: "string",
     *             integer: 1,
     *             long: 1000000,
     *             double: 1.1,
     *             bool: true,
     *             datetime: new Date("2024-01-15T09:30:00.000Z"),
     *             date: "2023-01-15",
     *             uuid: "d5e9c84f-c2b2-4bf4-b4b0-7ffd7a9ffc32",
     *             base64: "SGVsbG8gd29ybGQh",
     *             list: ["string"],
     *             set: new Set(["string"]),
     *             map: {
     *                 1: "string"
     *             },
     *             bigint: "123456789123456789"
     *         }
     *     })
     */
    public async getAndReturnNestedWithOptionalField(
        request: Fiddle.types.NestedObjectWithOptionalField,
        requestOptions?: Object_.RequestOptions
    ): Promise<
        core.APIResponse<
            Fiddle.types.NestedObjectWithOptionalField,
            Fiddle.endpoints.object.getAndReturnNestedWithOptionalField.Error
        >
    > {
        const _response = await core.fetcher({
            url: urlJoin(
                await core.Supplier.get(this._options.environment),
                "/object/get-and-return-nested-with-optional-field"
            ),
            method: "POST",
            headers: {
                Authorization: await this._getAuthorizationHeader(),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "@fern/exhaustive",
                "X-Fern-SDK-Version": "0.0.1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "application/json",
            body: await serializers.types.NestedObjectWithOptionalField.jsonOrThrow(request, {
                unrecognizedObjectKeys: "strip",
            }),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return {
                ok: true,
                body: await serializers.types.NestedObjectWithOptionalField.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                }),
            };
        }

        return {
            ok: false,
            error: Fiddle.endpoints.object.getAndReturnNestedWithOptionalField.Error._unknown(_response.error),
        };
    }

    /**
     * @param {string} string
     * @param {Fiddle.types.NestedObjectWithRequiredField} request
     * @param {Object_.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @example
     *     await client.endpoints.object.getAndReturnNestedWithRequiredField("string", {
     *         string: "string",
     *         nestedObject: {
     *             string: "string",
     *             integer: 1,
     *             long: 1000000,
     *             double: 1.1,
     *             bool: true,
     *             datetime: new Date("2024-01-15T09:30:00.000Z"),
     *             date: "2023-01-15",
     *             uuid: "d5e9c84f-c2b2-4bf4-b4b0-7ffd7a9ffc32",
     *             base64: "SGVsbG8gd29ybGQh",
     *             list: ["string"],
     *             set: new Set(["string"]),
     *             map: {
     *                 1: "string"
     *             },
     *             bigint: "123456789123456789"
     *         }
     *     })
     */
    public async getAndReturnNestedWithRequiredField(
        string: string,
        request: Fiddle.types.NestedObjectWithRequiredField,
        requestOptions?: Object_.RequestOptions
    ): Promise<
        core.APIResponse<
            Fiddle.types.NestedObjectWithRequiredField,
            Fiddle.endpoints.object.getAndReturnNestedWithRequiredField.Error
        >
    > {
        const _response = await core.fetcher({
            url: urlJoin(
                await core.Supplier.get(this._options.environment),
                `/object/get-and-return-nested-with-required-field/${encodeURIComponent(string)}`
            ),
            method: "POST",
            headers: {
                Authorization: await this._getAuthorizationHeader(),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "@fern/exhaustive",
                "X-Fern-SDK-Version": "0.0.1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "application/json",
            body: await serializers.types.NestedObjectWithRequiredField.jsonOrThrow(request, {
                unrecognizedObjectKeys: "strip",
            }),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return {
                ok: true,
                body: await serializers.types.NestedObjectWithRequiredField.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                }),
            };
        }

        return {
            ok: false,
            error: Fiddle.endpoints.object.getAndReturnNestedWithRequiredField.Error._unknown(_response.error),
        };
    }

    /**
     * @param {Fiddle.types.NestedObjectWithRequiredField[]} request
     * @param {Object_.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @example
     *     await client.endpoints.object.getAndReturnNestedWithRequiredFieldAsList([{
     *             string: "string",
     *             nestedObject: {
     *                 string: "string",
     *                 integer: 1,
     *                 long: 1000000,
     *                 double: 1.1,
     *                 bool: true,
     *                 datetime: new Date("2024-01-15T09:30:00.000Z"),
     *                 date: "2023-01-15",
     *                 uuid: "d5e9c84f-c2b2-4bf4-b4b0-7ffd7a9ffc32",
     *                 base64: "SGVsbG8gd29ybGQh",
     *                 list: ["string"],
     *                 set: new Set(["string"]),
     *                 map: {
     *                     1: "string"
     *                 },
     *                 bigint: "123456789123456789"
     *             }
     *         }])
     */
    public async getAndReturnNestedWithRequiredFieldAsList(
        request: Fiddle.types.NestedObjectWithRequiredField[],
        requestOptions?: Object_.RequestOptions
    ): Promise<
        core.APIResponse<
            Fiddle.types.NestedObjectWithRequiredField,
            Fiddle.endpoints.object.getAndReturnNestedWithRequiredFieldAsList.Error
        >
    > {
        const _response = await core.fetcher({
            url: urlJoin(
                await core.Supplier.get(this._options.environment),
                "/object/get-and-return-nested-with-required-field-list"
            ),
            method: "POST",
            headers: {
                Authorization: await this._getAuthorizationHeader(),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "@fern/exhaustive",
                "X-Fern-SDK-Version": "0.0.1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "application/json",
            body: await serializers.endpoints.object.getAndReturnNestedWithRequiredFieldAsList.Request.jsonOrThrow(
                request,
                { unrecognizedObjectKeys: "strip" }
            ),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return {
                ok: true,
                body: await serializers.types.NestedObjectWithRequiredField.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                }),
            };
        }

        return {
            ok: false,
            error: Fiddle.endpoints.object.getAndReturnNestedWithRequiredFieldAsList.Error._unknown(_response.error),
        };
    }

    protected async _getAuthorizationHeader(): Promise<string | undefined> {
        const bearer = await core.Supplier.get(this._options.token);
        if (bearer != null) {
            return `Bearer ${bearer}`;
        }

        return undefined;
    }
}