package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.CS3821.model.Booking;
import uk.ac.rhul.CS3821.model.ParkingSpot;
import uk.ac.rhul.CS3821.repository.BookingRepository;
import uk.ac.rhul.CS3821.repository.ParkingSpotRepository;
import uk.ac.rhul.CS3821.repository.UserRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Provides admin reporting and parking inventory controls.
 */
@Service
@Transactional
public class AdminDashboardService {

    private final BookingRepository bookingRepository;
    private final ParkingSpotRepository parkingSpotRepository;
    private final UserRepository userRepository;

    public AdminDashboardService(
            BookingRepository bookingRepository,
            ParkingSpotRepository parkingSpotRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.parkingSpotRepository = parkingSpotRepository;
        this.userRepository = userRepository;
    }

    /**
     * Builds a compact dashboard payload with booking and inventory metrics.
     *
     * @return summary metrics plus recent transactions
     */
    public Map<String, Object> getDashboardSnapshot() {
        List<Booking> bookings = bookingRepository.findAll();
        List<ParkingSpot> spots = parkingSpotRepository.findAll();

        Map<String, Long> bookingsByStatus = new HashMap<>();
        BigDecimal revenue = BigDecimal.ZERO;

        for (Booking booking : bookings) {
            String status = booking.getStatus() == null ? "UNKNOWN" : booking.getStatus().toUpperCase(Locale.ROOT);
            bookingsByStatus.merge(status, 1L, Long::sum);

            if (booking.getTotalAmount() != null) {
                revenue = revenue.add(booking.getTotalAmount());
            }
        }

        Map<String, Long> sectionTotals = new HashMap<>();
        Map<String, Long> sectionReserved = new HashMap<>();
        for (ParkingSpot spot : spots) {
            String section = detectSection(spot.getSpotName());
            sectionTotals.merge(section, 1L, Long::sum);
            if (spot.isReserved()) {
                sectionReserved.merge(section, 1L, Long::sum);
            }
        }

        List<Map<String, Object>> recentTransactions = bookings.stream()
                .sorted(Comparator.comparing(Booking::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(10)
                .map(b -> Map.<String, Object>of(
                        "bookingId", String.valueOf(b.getBookingId()),
                        "confirmationCode", b.getConfirmationCode() == null ? "" : b.getConfirmationCode(),
                        "status", b.getStatus() == null ? "UNKNOWN" : b.getStatus(),
                        "amount", b.getTotalAmount() == null ? BigDecimal.ZERO : b.getTotalAmount(),
                        "spotName", b.getSpot() == null ? "" : b.getSpot().getSpotName(),
                        "createdAt", String.valueOf(b.getCreatedAt())
                ))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("totalUsers", userRepository.count());
        response.put("adminUsers", userRepository.findByRole("ADMIN").size());
        response.put("totalBookings", bookings.size());
        response.put("bookingsByStatus", bookingsByStatus);
        response.put("totalRevenue", revenue);
        response.put("totalParkingSpots", spots.size());
        response.put("reservedParkingSpots", spots.stream().filter(ParkingSpot::isReserved).count());
        response.put("sectionTotals", sectionTotals);
        response.put("sectionReserved", sectionReserved);
        response.put("recentTransactions", recentTransactions);
        return response;
    }

    /**
     * Sets reservation state for every spot in a section.
     *
     * @param section section prefix (for example A, B, C)
     * @param reserved desired reservation state
     * @return operation summary
     */
    public Map<String, Object> setSectionReserved(String section, boolean reserved) {
        String normalized = (section == null ? "" : section.trim()).toUpperCase(Locale.ROOT);
        if (normalized.isBlank()) {
            throw new IllegalArgumentException("Section is required");
        }

        List<ParkingSpot> allSpots = parkingSpotRepository.findAll();
        List<ParkingSpot> changed = new ArrayList<>();

        for (ParkingSpot spot : allSpots) {
            if (normalized.equals(detectSection(spot.getSpotName()))) {
                spot.setReserved(reserved);
                changed.add(spot);
            }
        }

        if (!changed.isEmpty()) {
            parkingSpotRepository.saveAll(changed);
        }

        return Map.of(
                "section", normalized,
                "reserved", reserved,
                "updatedSpots", changed.size()
        );
    }

    /**
     * Promotes a user to ADMIN role.
     *
     * @param email target user email
     * @return role-change summary
     */
    public Map<String, Object> promoteToAdmin(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        var user = userRepository.findByEmail(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setRole("ADMIN");
        userRepository.save(user);

        return Map.of(
                "email", user.getEmail(),
                "role", user.getRole()
        );
    }

    private String detectSection(String spotName) {
        if (spotName == null || spotName.isBlank()) {
            return "UNASSIGNED";
        }

        String trimmed = spotName.trim().toUpperCase(Locale.ROOT);
        char first = trimmed.charAt(0);
        if (Character.isLetter(first)) {
            return String.valueOf(first);
        }

        return "UNASSIGNED";
    }
}