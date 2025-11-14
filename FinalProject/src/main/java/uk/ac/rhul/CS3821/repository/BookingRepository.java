package uk.ac.rhul.CS3821.repository;

import uk.ac.rhul.CS3821.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByUser_UserId(UUID userId);

    List<Booking> findBySpot_SpotId(UUID spotId);

    List<Booking> findByStatus(String status);

    Optional<Booking> findByConfirmationCode(String confirmationCode);
}