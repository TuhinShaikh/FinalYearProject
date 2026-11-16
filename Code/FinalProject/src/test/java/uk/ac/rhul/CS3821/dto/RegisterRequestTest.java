package uk.ac.rhul.CS3821.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class RegisterRequestTest {

    @Test
    void getterAndSetterWork() {
        RegisterRequest request = new RegisterRequest("Jane Doe", "a@example.com", "pw");
        assertThat(request.getName()).isEqualTo("Jane Doe");
        assertThat(request.getEmail()).isEqualTo("a@example.com");
        assertThat(request.getPassword()).isEqualTo("pw");

        request.setName("John Roe");
        request.setEmail("b@example.com");
        request.setPassword("pw2");
        assertThat(request.getName()).isEqualTo("John Roe");
        assertThat(request.getEmail()).isEqualTo("b@example.com");
        assertThat(request.getPassword()).isEqualTo("pw2");
    }
}
