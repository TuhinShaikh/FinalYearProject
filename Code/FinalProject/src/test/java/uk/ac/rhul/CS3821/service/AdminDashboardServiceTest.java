package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import uk.ac.rhul.CS3821.model.Booking;
import uk.ac.rhul.CS3821.model.ParkingSpot;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.repository.BookingRepository;
import uk.ac.rhul.CS3821.repository.ParkingSpotRepository;
import uk.ac.rhul.CS3821.repository.UserRepository;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for admin dashboard metrics and inventory operations.
 */
@ExtendWith(MockitoExtension.class)
class AdminDashboardServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ParkingSpotRepository parkingSpotRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminDashboardService service;

    @Test
    void getDashboardSnapshotAggregatesMetricsAndTransactions() {
        ParkingSpot spotA1 = new ParkingSpot("A1", "A section", true);
        ParkingSpot spotB2 = new ParkingSpot("B2", "B section", false);
        ParkingSpot spotUnknown = new ParkingSpot("1C", "No letter prefix", true);
        when(parkingSpotRepository.findAll()).thenReturn(List.of(spotA1, spotB2, spotUnknown));

        Booking confirmed = new Booking(new User(), spotA1, LocalDate.now(), Instant.now(), Instant.now().plusSeconds(3600), new BigDecimal("15.50"), "confirmed");
        confirmed.setBookingId(UUID.fromString("00000000-0000-0000-0000-000000000001"));
        confirmed.setConfirmationCode("CONF-1");
        ReflectionTestUtils.setField(confirmed, "createdAt", Instant.parse("2026-01-02T10:00:00Z"));

        Booking unknown = new Booking(new User(), null, LocalDate.now(), Instant.now(), Instant.now().plusSeconds(1800), null, null);
        unknown.setBookingId(UUID.fromString("00000000-0000-0000-0000-000000000002"));
        ReflectionTestUtils.setField(unknown, "createdAt", Instant.parse("2026-01-01T10:00:00Z"));

        when(bookingRepository.findAll()).thenReturn(List.of(unknown, confirmed));
        when(userRepository.count()).thenReturn(7L);
        when(userRepository.findByRole("ADMIN")).thenReturn(List.of(new User(), new User()));

        Map<String, Object> snapshot = service.getDashboardSnapshot();

        assertThat(snapshot.get("totalUsers")).isEqualTo(7L);
        assertThat(snapshot.get("adminUsers")).isEqualTo(2);
        assertThat(snapshot.get("totalBookings")).isEqualTo(2);
        assertThat(snapshot.get("totalRevenue")).isEqualTo(new BigDecimal("15.50"));
        assertThat(snapshot.get("totalParkingSpots")).isEqualTo(3);
        assertThat(snapshot.get("reservedParkingSpots")).isEqualTo(2L);

        @SuppressWarnings("unchecked")
        Map<String, Long> bookingsByStatus = (Map<String, Long>) snapshot.get("bookingsByStatus");
        assertThat(bookingsByStatus).containsEntry("CONFIRMED", 1L).containsEntry("UNKNOWN", 1L);

        @SuppressWarnings("unchecked")
        Map<String, Long> sectionTotals = (Map<String, Long>) snapshot.get("sectionTotals");
        assertThat(sectionTotals).containsEntry("A", 1L).containsEntry("B", 1L).containsEntry("UNASSIGNED", 1L);

        @SuppressWarnings("unchecked")
        Map<String, Long> sectionReserved = (Map<String, Long>) snapshot.get("sectionReserved");
        assertThat(sectionReserved).containsEntry("A", 1L).containsEntry("UNASSIGNED", 1L);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> recentTransactions = (List<Map<String, Object>>) snapshot.get("recentTransactions");
        assertThat(recentTransactions).hasSize(2);
        assertThat(recentTransactions.get(0).get("bookingId")).isEqualTo("00000000-0000-0000-0000-000000000001");
        assertThat(recentTransactions.get(0).get("spotName")).isEqualTo("A1");
    }

    @Test
    void setSectionReservedThrowsWhenSectionIsBlank() {
        assertThatThrownBy(() -> service.setSectionReserved(" ", true))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Section is required");
    }

    @Test
    void setSectionReservedUpdatesOnlyMatchingSectionAndPersists() {
        ParkingSpot spotA1 = new ParkingSpot("A1", "A section", false);
        ParkingSpot spotB2 = new ParkingSpot("B2", "B section", false);
        when(parkingSpotRepository.findAll()).thenReturn(List.of(spotA1, spotB2));

        Map<String, Object> response = service.setSectionReserved("a", true);

        assertThat(spotA1.isReserved()).isTrue();
        assertThat(spotB2.isReserved()).isFalse();
        assertThat(response).containsEntry("section", "A")
                .containsEntry("reserved", true)
                .containsEntry("updatedSpots", 1);

        ArgumentCaptor<List<ParkingSpot>> captor = ArgumentCaptor.forClass(List.class);
        verify(parkingSpotRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).containsExactly(spotA1);
    }

    @Test
    void setSectionReservedSkipsSaveWhenNoSpotsMatched() {
        ParkingSpot spotB2 = new ParkingSpot("B2", "B section", false);
        when(parkingSpotRepository.findAll()).thenReturn(List.of(spotB2));

        Map<String, Object> response = service.setSectionReserved("A", true);

        assertThat(response).containsEntry("updatedSpots", 0);
        verify(parkingSpotRepository, never()).saveAll(org.mockito.ArgumentMatchers.anyList());
    }

    @Test
    void promoteToAdminThrowsWhenEmailIsBlank() {
        assertThatThrownBy(() -> service.promoteToAdmin(" "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email is required");
    }

    @Test
    void promoteToAdminThrowsWhenUserIsMissing() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.promoteToAdmin("missing@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    void promoteToAdminUpdatesRoleAndReturnsSummary() {
        User user = new User();
        user.setEmail("candidate@example.com");
        user.setRole("USER");
        when(userRepository.findByEmail("candidate@example.com")).thenReturn(Optional.of(user));

        Map<String, Object> response = service.promoteToAdmin("candidate@example.com");

        assertThat(user.getRole()).isEqualTo("ADMIN");
        verify(userRepository).save(user);
        assertThat(response).containsEntry("email", "candidate@example.com")
                .containsEntry("role", "ADMIN");
    }
}
