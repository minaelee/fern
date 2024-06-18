/**
 * This file was auto-generated by Fern from our API Definition.
 */
package com.seed.variables.core;

/**
 * This class serves as the base exception for all errors in the SDK.
 */
public class SeedVariablesError extends RuntimeException {
    public SeedVariablesError(String message) {
        super(message);
    }

    public SeedVariablesError(String message, Exception e) {
        super(message, e);
    }
}