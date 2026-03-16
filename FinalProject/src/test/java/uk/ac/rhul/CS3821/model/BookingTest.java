package uk.ac.rhul.CS3821.model;

import org.junit.jupiter.api.Test;

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
}
