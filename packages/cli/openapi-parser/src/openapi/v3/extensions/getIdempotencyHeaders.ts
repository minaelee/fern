import { IdempotencyHeader } from "@fern-api/openapi-ir-sdk";
import { OpenAPIV3 } from "openapi-types";
import { getExtension } from "../../../getExtension";
import { FernOpenAPIExtension } from "./fernExtensions";
import { getSchemaFromFernType } from "./getFernTypeExtension";

interface IdempotencyHeaderExtension {
    header: string;
    name: string | undefined;
    env: string | undefined;
    type: string | undefined;
}

export function getIdempotencyHeaders(document: OpenAPIV3.Document): IdempotencyHeader[] {
    const idempotencyHeaders = getExtension<IdempotencyHeaderExtension[]>(
        document,
        FernOpenAPIExtension.FERN_IDEMPOTENCY_HEADERS
    );
    const result: IdempotencyHeader[] = [];
    for (const header of idempotencyHeaders ?? []) {
        result.push({
            ...header,
            schema:
                header.type != null
                    ? getSchemaFromFernType({
                          fernType: header.type,
                          description: undefined,
                          generatedName: header.name ?? header.header,
                          groupName: undefined,
                          nameOverride: undefined
                      })
                    : undefined
        });
    }
    return result;
}