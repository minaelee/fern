/**
 * This file was auto-generated by Fern from our API Definition.
 */

package com.fern.sdk.resources.types.object.errors;

import com.fern.sdk.core.SeedExhaustiveApiError;
import com.fern.sdk.resources.types.object.types.NestedObjectWithRequiredField;

public final class SeedExhaustiveNestedObjectWithRequiredFieldError extends SeedExhaustiveApiError {
  /**
   * The body of the response that triggered the exception.
   */
  private final NestedObjectWithRequiredField body;

  public SeedExhaustiveNestedObjectWithRequiredFieldError(NestedObjectWithRequiredField body) {
    super("NestedObjectWithRequiredFieldError", 400, body);
    this.body = body;
  }

  /**
   * @return the body
   */
  @java.lang.Override
  public NestedObjectWithRequiredField body() {
    return this.body;
  }
}