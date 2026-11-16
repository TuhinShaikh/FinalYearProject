package uk.ac.rhul.CS3821.model;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
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

    @Test
    void canSetPhoneAndReadAuditTimestamps() {
        User user = new User();
        Instant createdAt = Instant.parse("2026-03-16T10:00:00Z");
        Instant updatedAt = Instant.parse("2026-03-16T11:00:00Z");

        user.setPhoneNumber("07999");
        ReflectionTestUtils.setField(user, "createdAt", createdAt);
        ReflectionTestUtils.setField(user, "updatedAt", updatedAt);

        assertThat(user.getPhoneNumber()).isEqualTo("07999");
        assertThat(user.getCreatedAt()).isEqualTo(createdAt);
        assertThat(user.getUpdatedAt()).isEqualTo(updatedAt);
    }
}
