package uk.ac.rhul.CS3821.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LoginRequestTest {

    @Test
    void getterAndSetterWork() {
        LoginRequest request = new LoginRequest("a@example.com", "pw");
        assertThat(request.getEmail()).isEqualTo("a@example.com");
        assertThat(request.getPassword()).isEqualTo("pw");

        request.setEmail("b@example.com");
        request.setPassword("pw2");
        assertThat(request.getEmail()).isEqualTo("b@example.com");
        assertThat(request.getPassword()).isEqualTo("pw2");
    }
}
