package uk.ac.rhul.CS3821.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AccessTokenResponseTest {

    @Test
    void getterAndSetterWork() {
        AccessTokenResponse response = new AccessTokenResponse("t1");
        assertThat(response.getAccessToken()).isEqualTo("t1");

        response.setAccessToken("t2");
        assertThat(response.getAccessToken()).isEqualTo("t2");
    }
}
