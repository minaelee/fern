/**
 * This file was auto-generated by Fern from our API Definition.
 */
package com.seed.extraProperties;

import com.seed.extraProperties.core.ClientOptions;
import com.seed.extraProperties.core.Environment;

public final class SeedExtraPropertiesClientBuilder {
    private ClientOptions.Builder clientOptionsBuilder = ClientOptions.builder();

    private Environment environment;

    public SeedExtraPropertiesClientBuilder url(String url) {
        this.environment = Environment.custom(url);
        return this;
    }

    public SeedExtraPropertiesClient build() {
        clientOptionsBuilder.environment(this.environment);
        return new SeedExtraPropertiesClient(clientOptionsBuilder.build());
    }
}