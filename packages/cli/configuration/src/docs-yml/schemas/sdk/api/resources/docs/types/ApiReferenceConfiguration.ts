/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as FernDocsConfig from "../../..";

export interface ApiReferenceConfiguration {
    api: string;
    /** Name of API that we are referencing */
    apiName?: string;
    audiences?: string[];
    /** Defaults to false */
    displayErrors?: boolean;
    snippets?: FernDocsConfig.SnippetsConfiguration;
    /** Relative path to the markdown file */
    summary?: string;
    /** Advanced usage: when specified, this object will be used to customize the order that your API endpoints are displayed in the docs site, including subpackages, and additional markdown pages (to be rendered in between API endpoints). If not specified, the order will be inferred from the OpenAPI Spec or Fern Definition. */
    layout?: FernDocsConfig.ApiReferenceLayoutItem[];
    icon?: string;
    slug?: string;
    hidden?: boolean;
    skipSlug?: boolean;
    /** If `alphabetized` is set to true, packages and endpoints will be sorted alphabetically, unless explicitly ordered in the `layout` object. */
    alphabetized?: boolean;
    /**
     * If `flattened` is set to true, the title specified in `api` will be hidden, and its endpoints and subpackages won't be grouped under it.
     *
     * This setting is useful if the API reference is short and you want to display all endpoints at the top level.
     */
    flattened?: boolean;
    /** If true, the API reference will be paginated rather than displayed in a single page (long-scrolling). */
    paginated?: boolean;
}