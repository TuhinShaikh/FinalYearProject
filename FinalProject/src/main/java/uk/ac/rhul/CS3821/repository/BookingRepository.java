package uk.ac.rhul.CS3821.repository;

import uk.ac.rhul.CS3821.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for booking persistence and booking-centric query operations.
 */
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    /**
     * Finds all bookings belonging to a user.
     *
     * @param userId user identifier
     * @return bookings created by that user
     */
    List<Booking> findByUser_UserId(UUID userId);

    /**
     * Finds all bookings for a specific parking spot.
     *
     * @param spotId parking spot identifier
     * @return bookings associated with the spot
     */
    List<Booking> findBySpot_SpotId(UUID spotId);

    /**
     * Finds bookings by status.
     *
     * @param status booking lifecycle status
     * @return bookings in the requested status
     */
    List<Booking> findByStatus(String status);

    /**
     * Finds a booking by confirmation code.
     *
     * @param confirmationCode customer-facing booking confirmation code
     * @return booking with the matching code, if present
     */
    Optional<Booking> findByConfirmationCode(String confirmationCode);
}