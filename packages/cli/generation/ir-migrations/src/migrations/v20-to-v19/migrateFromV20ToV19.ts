import { GeneratorName } from "@fern-api/generators-configuration";
import { mapValues } from "lodash-es";
import { IrVersions } from "../../ir-versions";
import { IrMigrationContext } from "../../IrMigrationContext";
import { AlwaysRunMigration, IrMigration } from "../../types/IrMigration";

export const V20_TO_V19_MIGRATION: IrMigration<
    IrVersions.V20.ir.IntermediateRepresentation,
    IrVersions.V19.ir.IntermediateRepresentation
> = {
    laterVersion: "v20",
    earlierVersion: "v19",
    minGeneratorVersionsToExclude: {
        [GeneratorName.TYPESCRIPT]: AlwaysRunMigration,
        [GeneratorName.TYPESCRIPT_SDK]: AlwaysRunMigration,
        [GeneratorName.TYPESCRIPT_EXPRESS]: AlwaysRunMigration,
        [GeneratorName.JAVA]: AlwaysRunMigration,
        [GeneratorName.JAVA_MODEL]: AlwaysRunMigration,
        [GeneratorName.JAVA_SDK]: AlwaysRunMigration,
        [GeneratorName.JAVA_SPRING]: AlwaysRunMigration,
        [GeneratorName.PYTHON_FASTAPI]: AlwaysRunMigration,
        [GeneratorName.PYTHON_PYDANTIC]: AlwaysRunMigration,
        [GeneratorName.OPENAPI_PYTHON_CLIENT]: AlwaysRunMigration,
        [GeneratorName.OPENAPI]: AlwaysRunMigration,
        [GeneratorName.STOPLIGHT]: AlwaysRunMigration,
        [GeneratorName.POSTMAN]: AlwaysRunMigration,
        [GeneratorName.PYTHON_SDK]: AlwaysRunMigration,
    },
    migrateBackwards: (v20, context): IrVersions.V19.ir.IntermediateRepresentation => {
        return {
            ...v20,
            services: mapValues(v20.services, (service) => {
                return convertService(service, context);
            }),
        };
    },
};

function convertService(
    service: IrVersions.V20.http.HttpService,
    context: IrMigrationContext
): IrVersions.V19.http.HttpService {
    return {
        ...service,
        endpoints: service.endpoints.map((endpoint) => convertEndpoint(endpoint, context)),
    };
}

function convertEndpoint(
    endpoint: IrVersions.V20.http.HttpEndpoint,
    context: IrMigrationContext
): IrVersions.V19.http.HttpEndpoint {
    return {
        ...endpoint,
        response: endpoint.response != null ? convertResponse(endpoint.response, context) : undefined,
        sdkResponse: endpoint.sdkResponse != null ? convertSdkResponse(endpoint.sdkResponse, context) : undefined,
    };
}

function convertResponse(
    response: IrVersions.V20.http.HttpResponse,
    context: IrMigrationContext
): IrVersions.V19.http.NonStreamingResponse {
    return IrVersions.V20.http.HttpResponse._visit<IrVersions.V19.http.NonStreamingResponse>(response, {
        fileDownload: () => {
            return throwFileDownloadNotSupported(context);
        },
        json: (jsonResponse) => jsonResponse,
        _unknown: () => {
            throw new Error("Unknown HttpResponse: " + response.type);
        },
    });
}

function convertSdkResponse(
    sdkResponse: IrVersions.V20.http.SdkResponse,
    context: IrMigrationContext
): IrVersions.V19.http.SdkResponse {
    return IrVersions.V20.http.SdkResponse._visit<IrVersions.V19.http.SdkResponse>(sdkResponse, {
        fileDownload: () => {
            return throwFileDownloadNotSupported(context);
        },
        streaming: IrVersions.V19.http.SdkResponse.streaming,
        maybeStreaming: (maybeStreamingResponse) =>
            IrVersions.V19.http.SdkResponse.maybeStreaming({
                condition: maybeStreamingResponse.condition,
                streaming: maybeStreamingResponse.streaming,
                nonStreaming: convertResponse(maybeStreamingResponse.nonStreaming, context),
            }),
        json: IrVersions.V19.http.SdkResponse.nonStreaming,
        _unknown: () => {
            throw new Error("Unknown SdkResponse: " + sdkResponse.type);
        },
    });
}

function throwFileDownloadNotSupported({ targetGenerator, taskContext }: IrMigrationContext): never {
    return taskContext.failAndThrow(
        targetGenerator != null
            ? `Generator ${targetGenerator.name}@${targetGenerator.version}` +
                  " does not support file download." +
                  ` If you'd like to use this feature, please upgrade ${targetGenerator.name}` +
                  " to a compatible version."
            : "Cannot backwards-migrate IR because this IR contains file download."
    );
}