import { RelativeFilePath } from "@fern-api/fs-utils";
import { ts } from "ts-morph";
import { DependencyManager } from "../../dependency-manager/DependencyManager";
import { CoreUtility } from "../CoreUtility";
import { Auth } from "./Auth";

export class AuthImpl extends CoreUtility implements Auth {
    public readonly MANIFEST = {
        name: "auth",
        repoInfoForTesting: {
            path: RelativeFilePath.of("packages/core-utilities/auth/src"),
            ignoreGlob: "**/__test__",
        },
        originalPathOnDocker: "/assets/auth" as const,
        pathInCoreUtilities: [{ nameOnDisk: "auth", exportDeclaration: { exportAll: true } }],
        addDependencies: (dependencyManager: DependencyManager): void => {
            dependencyManager.addDependency("js-base64", "3.7.2");
        },
    };

    public readonly BearerToken = {
        _getReferenceToType: this.withExportedName("BearerToken", (BearerToken) => () => BearerToken.getTypeNode()),
        toAuthorizationHeader: this.withExportedName(
            "BearerToken",
            (BearerToken) =>
                (token: ts.Expression): ts.Expression => {
                    return ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            BearerToken.getExpression(),
                            ts.factory.createIdentifier("toAuthorizationHeader")
                        ),
                        undefined,
                        [token]
                    );
                }
        ),
        fromAuthorizationHeader: this.withExportedName(
            "BearerToken",
            (BearerToken) =>
                (header: ts.Expression): ts.Expression => {
                    return ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            BearerToken.getExpression(),
                            ts.factory.createIdentifier("fromAuthorizationHeader")
                        ),
                        undefined,
                        [header]
                    );
                }
        ),
    };

    public readonly BasicAuth = {
        _getReferenceToType: this.withExportedName("BasicAuth", (BasicAuth) => () => BasicAuth.getTypeNode()),
        toAuthorizationHeader: this.withExportedName(
            "BasicAuth",
            (BasicAuth) =>
                (username: ts.Expression, password: ts.Expression): ts.Expression => {
                    return ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            BasicAuth.getExpression(),
                            ts.factory.createIdentifier("toAuthorizationHeader")
                        ),
                        undefined,
                        [
                            ts.factory.createObjectLiteralExpression(
                                [
                                    ts.factory.createPropertyAssignment(
                                        ts.factory.createIdentifier("username"),
                                        username
                                    ),
                                    ts.factory.createPropertyAssignment(
                                        ts.factory.createIdentifier("password"),
                                        password
                                    ),
                                ],
                                true
                            ),
                        ]
                    );
                }
        ),
        fromAuthorizationHeader: this.withExportedName(
            "BasicAuth",
            (BasicAuth) =>
                (header: ts.Expression): ts.Expression => {
                    return ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            BasicAuth.getExpression(),
                            ts.factory.createIdentifier("fromAuthorizationHeader")
                        ),
                        undefined,
                        [header]
                    );
                }
        ),
    };
}
