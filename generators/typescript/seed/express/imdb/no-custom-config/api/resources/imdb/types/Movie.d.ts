/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as SeedApi from "../../..";
export interface Movie {
    id: SeedApi.MovieId;
    title: string;
    /** The rating scale is one to five stars */
    rating: number;
}
