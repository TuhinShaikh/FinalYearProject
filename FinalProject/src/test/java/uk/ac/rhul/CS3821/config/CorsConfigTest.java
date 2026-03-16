package uk.ac.rhul.CS3821.config;

import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.assertj.core.api.Assertions.assertThat;

class CorsConfigTest {

    @Test
    void corsConfigurerBeanIsCreated() {
        CorsConfig config = new CorsConfig();
        WebMvcConfigurer bean = config.corsConfigurer();

        assertThat(bean).isNotNull();
    }
}
