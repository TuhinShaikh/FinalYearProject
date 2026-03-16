package uk.ac.rhul.CS3821.model;

import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class UserTest {

    @Test
    void constructorAndSettersPopulateFields() {
        User user = new User("u@example.com", "pw", "Jane", "Doe", "07123");
        UUID id = UUID.randomUUID();
        user.setUserId(id);
        user.setDisabled(true);

        assertThat(user.getUserId()).isEqualTo(id);
        assertThat(user.getEmail()).isEqualTo("u@example.com");
        assertThat(user.getPassword()).isEqualTo("pw");
        assertThat(user.getFirstName()).isEqualTo("Jane");
        assertThat(user.getLastName()).isEqualTo("Doe");
        assertThat(user.getPhoneNumber()).isEqualTo("07123");
        assertThat(user.isDisabled()).isTrue();
    }
}
