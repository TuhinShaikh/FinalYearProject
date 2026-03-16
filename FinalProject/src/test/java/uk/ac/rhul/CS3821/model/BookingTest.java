package uk.ac.rhul.CS3821.model;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class BookingTest {

    @Test
    void constructorAndSettersWork() {
        User user = new User();
        ParkingSpot spot = new ParkingSpot();
        Booking booking = new Booking(
                user,
                spot,
                LocalDate.of(2026, 3, 16),
                Instant.parse("2026-03-16T10:00:00Z"),
                Instant.parse("2026-03-16T12:00:00Z"),
                new BigDecimal("20.00"),
                "CONFIRMED"
        );

        UUID bookingId = UUID.randomUUID();
        booking.setBookingId(bookingId);
        booking.setConfirmationCode("ABC123");
        booking.setSpecialRequirements("Near exit");

        assertThat(booking.getBookingId()).isEqualTo(bookingId);
        assertThat(booking.getUser()).isSameAs(user);
        assertThat(booking.getSpot()).isSameAs(spot);
        assertThat(booking.getTotalAmount()).isEqualByComparingTo("20.00");
        assertThat(booking.getStatus()).isEqualTo("CONFIRMED");
        assertThat(booking.getConfirmationCode()).isEqualTo("ABC123");
        assertThat(booking.getSpecialRequirements()).isEqualTo("Near exit");
    }

    @Test
    void remainingSettersAndAuditGettersWork() {
        Booking booking = new Booking();
        User user = new User();
        ParkingSpot spot = new ParkingSpot();
        LocalDate date = LocalDate.of(2026, 3, 20);
        Instant start = Instant.parse("2026-03-20T09:00:00Z");
        Instant end = Instant.parse("2026-03-20T10:00:00Z");
        Instant createdAt = Instant.parse("2026-03-20T08:00:00Z");
        Instant updatedAt = Instant.parse("2026-03-20T08:30:00Z");

        booking.setUser(user);
        booking.setSpot(spot);
        booking.setBookingDate(date);
        booking.setStartTime(start);
        booking.setEndTime(end);
        booking.setTotalAmount(new BigDecimal("12.50"));
        booking.setStatus("PENDING");
        booking.setVersionNumber(2);
        ReflectionTestUtils.setField(booking, "createdAt", createdAt);
        ReflectionTestUtils.setField(booking, "updatedAt", updatedAt);

        assertThat(booking.getUser()).isSameAs(user);
        assertThat(booking.getSpot()).isSameAs(spot);
        assertThat(booking.getBookingDate()).isEqualTo(date);
        assertThat(booking.getStartTime()).isEqualTo(start);
        assertThat(booking.getEndTime()).isEqualTo(end);
        assertThat(booking.getTotalAmount()).isEqualByComparingTo("12.50");
        assertThat(booking.getStatus()).isEqualTo("PENDING");
        assertThat(booking.getVersionNumber()).isEqualTo(2);
        assertThat(booking.getCreatedAt()).isEqualTo(createdAt);
        assertThat(booking.getUpdatedAt()).isEqualTo(updatedAt);
    }
}
