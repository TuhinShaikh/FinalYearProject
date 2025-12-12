package uk.ac.rhul.CS3821.repository;

import uk.ac.rhul.CS3821.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

// Repository for Booking aggregates so services can query by user, spot, or status
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    // Fetch bookings that belong to the provided user UUID
    List<Booking> findByUser_UserId(UUID userId);

    // Retrieve bookings attached to a parking spot
    List<Booking> findBySpot_SpotId(UUID spotId);

    // Allow filtering by status for dashboards
    List<Booking> findByStatus(String status);

    // Support lookups via a confirmation code delivered to guests
    Optional<Booking> findByConfirmationCode(String confirmationCode);
}