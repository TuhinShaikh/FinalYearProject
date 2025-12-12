package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.ac.rhul.CS3821.model.Booking;
import uk.ac.rhul.CS3821.model.ParkingSpot;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.repository.BookingRepository;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void createBookingDelegatesToRepository() {
        Booking booking = new Booking(new User(), new ParkingSpot(), LocalDate.now(), Instant.now(), Instant.now(), new BigDecimal("12.00"), "PENDING");
        when(bookingRepository.save(booking)).thenReturn(booking);

        Booking result = bookingService.createBooking(booking);

        assertThat(result).isSameAs(booking);
        verify(bookingRepository).save(booking);
    }

    @Test
    void getBookingsByUserReturnsListFromRepository() {
        UUID userId = UUID.randomUUID();
        List<Booking> expected = List.of(createDummyBooking());
        when(bookingRepository.findByUser_UserId(userId)).thenReturn(expected);

        List<Booking> actual = bookingService.getBookingsByUser(userId);

        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void cancelBookingCallsDelete() {
        UUID bookingId = UUID.randomUUID();

        bookingService.cancelBooking(bookingId);

        verify(bookingRepository).deleteById(bookingId);
    }

    private Booking createDummyBooking() {
        return new Booking(new User(), new ParkingSpot(), LocalDate.now(), Instant.now(), Instant.now(), new BigDecimal("8.50"), "CONFIRMED");
    }
}
