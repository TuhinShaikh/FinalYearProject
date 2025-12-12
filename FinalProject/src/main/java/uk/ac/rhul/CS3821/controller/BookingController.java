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

// Manages parking booking data so the UI can create, read, update, and cancel reservations
@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Persist a new booking entry and return the saved object (including generated ID)
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    // Look up a booking by its UUID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable UUID id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Fetch all bookings that belong to a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    // Fetch bookings tied to a parking spot so the UI can show availability
    @GetMapping("/spot/{spotId}")
    public ResponseEntity<List<Booking>> getBookingsBySpot(@PathVariable UUID spotId) {
        return ResponseEntity.ok(bookingService.getBookingsBySpot(spotId));
    }

    // Update booking metadata while keeping the original ID intact
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable UUID id, @RequestBody Booking updatedBooking) {
        updatedBooking.setBookingId(id);
        return ResponseEntity.ok(bookingService.updateBooking(updatedBooking));
    }

    // Cancel by ID and return 204 when deletion succeeds
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable UUID id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}