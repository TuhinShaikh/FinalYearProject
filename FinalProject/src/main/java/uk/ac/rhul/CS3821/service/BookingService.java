package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.CS3821.model.Booking;
import uk.ac.rhul.CS3821.repository.BookingRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service layer for booking lifecycle operations.
 */
@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    /**
     * Persists a new booking.
     *
     * @param booking booking payload
     * @return saved booking
     */
    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    /**
     * Retrieves a booking by id.
     *
     * @param bookingId booking identifier
     * @return booking if found
     */
    public Optional<Booking> getBookingById(UUID bookingId) {
        return bookingRepository.findById(bookingId);
    }

    /**
     * Retrieves bookings created by a user.
     *
     * @param userId user identifier
     * @return list of user bookings
     */
    public List<Booking> getBookingsByUser(UUID userId) {
        return bookingRepository.findByUser_UserId(userId);
    }

    /**
     * Retrieves bookings for a parking spot.
     *
     * @param spotId spot identifier
     * @return list of bookings for the spot
     */
    public List<Booking> getBookingsBySpot(UUID spotId) {
        return bookingRepository.findBySpot_SpotId(spotId);
    }

    /**
     * Updates an existing booking.
     *
     * @param booking updated booking payload
     * @return saved booking
     */
    public Booking updateBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    /**
     * Deletes a booking by id.
     *
     * @param bookingId booking identifier
     */
    public void cancelBooking(UUID bookingId) {
        bookingRepository.deleteById(bookingId);
    }
}