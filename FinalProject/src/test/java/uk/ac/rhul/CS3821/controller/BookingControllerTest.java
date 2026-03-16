package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uk.ac.rhul.CS3821.model.Booking;
import uk.ac.rhul.CS3821.service.BookingService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingControllerTest {

    @Mock
    private BookingService bookingService;

    @InjectMocks
    private BookingController controller;

    @Test
    void getBookingByIdReturnsOkWhenFound() {
        UUID id = UUID.randomUUID();
        Booking booking = new Booking();
        when(bookingService.getBookingById(id)).thenReturn(Optional.of(booking));

        ResponseEntity<Booking> response = controller.getBookingById(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isSameAs(booking);
    }

    @Test
    void getBookingByIdReturnsNotFoundWhenMissing() {
        UUID id = UUID.randomUUID();
        when(bookingService.getBookingById(id)).thenReturn(Optional.empty());

        ResponseEntity<Booking> response = controller.getBookingById(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void updateBookingSetsPathIdBeforeSave() {
        UUID id = UUID.randomUUID();
        Booking booking = new Booking();
        when(bookingService.updateBooking(booking)).thenReturn(booking);

        ResponseEntity<Booking> response = controller.updateBooking(id, booking);

        assertThat(booking.getBookingId()).isEqualTo(id);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(bookingService).updateBooking(booking);
    }

    @Test
    void getBookingsByUserReturnsList() {
        UUID userId = UUID.randomUUID();
        List<Booking> bookings = List.of(new Booking());
        when(bookingService.getBookingsByUser(userId)).thenReturn(bookings);

        ResponseEntity<List<Booking>> response = controller.getBookingsByUser(userId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(bookings);
    }

    @Test
    void cancelBookingReturnsNoContent() {
        UUID id = UUID.randomUUID();

        ResponseEntity<Void> response = controller.cancelBooking(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(bookingService).cancelBooking(id);
    }
}
