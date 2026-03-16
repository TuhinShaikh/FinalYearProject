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

// I kept booking endpoints together here because the UI needs one clear place for create/read/update/cancel flows.
@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // I return the saved object directly so the frontend immediately gets the generated booking id.
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    // I used UUID lookup here because bookings are referenced by id across several pages.
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable UUID id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // I added this so user history can be loaded without pulling unrelated bookings.
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    // I query by spot so availability screens can show exactly who reserved a slot and when.
    @GetMapping("/spot/{spotId}")
    public ResponseEntity<List<Booking>> getBookingsBySpot(@PathVariable UUID spotId) {
        return ResponseEntity.ok(bookingService.getBookingsBySpot(spotId));
    }

    // I force the path id onto the payload so clients cannot accidentally update the wrong booking.
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable UUID id, @RequestBody Booking updatedBooking) {
        updatedBooking.setBookingId(id);
        return ResponseEntity.ok(bookingService.updateBooking(updatedBooking));
    }

    // I return 204 here because the action is complete and there is no response body to send back.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable UUID id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}