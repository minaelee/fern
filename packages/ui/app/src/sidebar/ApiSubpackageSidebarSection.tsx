import { FernRegistry } from "@fern-fern/registry-browser";
import * as FernRegistryApiRead from "@fern-fern/registry-browser/api/resources/api/resources/v1/resources/read";
import { startCase } from "lodash-es";
import { useMemo } from "react";
import { useApiDefinitionContext } from "../api-context/useApiDefinitionContext";
import { ApiSubpackageSidebarSectionContents } from "./ApiSubpackageSidebarSectionContents";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarItemLayout } from "./SidebarItemLayout";

export declare namespace ApiSubpackageSidebarSection {
    export interface Props {
        apiId: FernRegistry.ApiDefinitionId;
        subpackage: FernRegistryApiRead.ApiDefinitionSubpackage;
        slug: string;
    }
}

export const ApiSubpackageSidebarSection: React.FC<ApiSubpackageSidebarSection.Props> = ({
    apiId,
    subpackage,
    slug,
}) => {
    const { resolveSubpackageById } = useApiDefinitionContext();

    const hasEndpoints = useMemo(
        () => hasEndpointsRecursive(subpackage.subpackageId, resolveSubpackageById),
        [resolveSubpackageById, subpackage.subpackageId]
    );

    if (!hasEndpoints) {
        return null;
    }

    return (
        <SidebarGroup
            title={<SidebarItemLayout title={<div className="font-bold">{startCase(subpackage.name)}</div>} />}
        >
            <ApiSubpackageSidebarSectionContents apiId={apiId} subpackage={subpackage} slug={slug} />
        </SidebarGroup>
    );
};

function hasEndpointsRecursive(
    subpackageId: FernRegistryApiRead.SubpackageId,
    resolveSubpackage: (subpackageId: FernRegistryApiRead.SubpackageId) => FernRegistryApiRead.ApiDefinitionSubpackage
): boolean {
    const subpackage = resolveSubpackage(subpackageId);
    if (subpackage.endpoints.length > 0) {
        return true;
    }
    return subpackage.subpackages.some((s) => hasEndpointsRecursive(s, resolveSubpackage));
}