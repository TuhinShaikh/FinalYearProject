package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.CS3821.model.Booking;
import uk.ac.rhul.CS3821.repository.BookingRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public Optional<Booking> getBookingById(UUID bookingId) {
        return bookingRepository.findById(bookingId);
    }

    public List<Booking> getBookingsByUser(UUID userId) {
        return bookingRepository.findByUser_UserId(userId);
    }

    public List<Booking> getBookingsBySpot(UUID spotId) {
        return bookingRepository.findBySpot_SpotId(spotId);
    }