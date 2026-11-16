package uk.ac.rhul.CS3821;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class ApplicationSmokeTest {

    @Test
    void applicationClassIsLoadable() {
        assertNotNull(FinalProjectApplication.class);
    }
}
