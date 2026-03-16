package uk.ac.rhul.CS3821.repository;

import uk.ac.rhul.CS3821.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

// I keep booking query methods here so service logic stays focused on business rules.
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    // I use this when showing a user's booking history.
    List<Booking> findByUser_UserId(UUID userId);

    // I use this to inspect all bookings for a specific spot.
    List<Booking> findBySpot_SpotId(UUID spotId);

    // I use this for dashboard-style status filtering.
    List<Booking> findByStatus(String status);

    // I use this for guest lookup flows with confirmation code.
    Optional<Booking> findByConfirmationCode(String confirmationCode);
}