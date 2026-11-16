package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.CS3821.model.Booking;
import uk.ac.rhul.CS3821.service.BookingService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * REST controller exposing CRUD and lookup endpoints for bookings.
 */
@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Creates a booking.
     *
     * @param booking booking payload
     * @return saved booking
     */
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    /**
     * Retrieves a booking by id.
     *
     * @param id booking identifier
     * @return booking if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable UUID id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrieves bookings for a user.
     *
     * @param userId user identifier
     * @return user bookings
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    /**
     * Retrieves bookings for a parking spot.
     *
     * @param spotId spot identifier
     * @return spot bookings
     */
    @GetMapping("/spot/{spotId}")
    public ResponseEntity<List<Booking>> getBookingsBySpot(@PathVariable UUID spotId) {
        return ResponseEntity.ok(bookingService.getBookingsBySpot(spotId));
    }

    /**
     * Updates a booking by id.
     *
     * @param id booking identifier
     * @param updatedBooking updated payload
     * @return saved booking
     */
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable UUID id, @RequestBody Booking updatedBooking) {
        updatedBooking.setBookingId(id);
        return ResponseEntity.ok(bookingService.updateBooking(updatedBooking));
    }

    /**
     * Cancels (deletes) a booking by id.
     *
     * @param id booking identifier
     * @return empty response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable UUID id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}