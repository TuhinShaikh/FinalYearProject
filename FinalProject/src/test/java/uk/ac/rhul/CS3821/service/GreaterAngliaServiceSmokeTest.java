package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.web.client.RestTemplateBuilder;

import static org.assertj.core.api.Assertions.assertThat;

class GreaterAngliaServiceSmokeTest {

    @Test
    void serviceCanBeConstructed() {
        GreaterAngliaService service = new GreaterAngliaService(new RestTemplateBuilder());
        assertThat(service).isNotNull();
    }
}
