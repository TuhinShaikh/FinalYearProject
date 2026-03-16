package uk.ac.rhul.CS3821;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import static org.assertj.core.api.Assertions.assertThat;

class FinalProjectApplicationAnnotationTest {

    @Test
    void classHasSpringBootApplicationAnnotation() {
        assertThat(FinalProjectApplication.class.isAnnotationPresent(SpringBootApplication.class))
                .isTrue();
    }
}
