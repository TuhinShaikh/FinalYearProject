package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uk.ac.rhul.CS3821.service.AdminAuthorizationService;
import uk.ac.rhul.CS3821.service.AdminDashboardService;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for admin controller endpoint delegation and response mapping.
 */
@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private AdminDashboardService adminDashboardService;

    @Mock
    private AdminAuthorizationService adminAuthorizationService;

    @InjectMocks
    private AdminController controller;

    @Test
    void dashboardReturnsSnapshotWhenAdminIsAuthorized() {
        Map<String, Object> snapshot = Map.of("totalUsers", 5L, "totalBookings", 9);
        when(adminDashboardService.getDashboardSnapshot()).thenReturn(snapshot);

        ResponseEntity<Map<String, Object>> response = controller.dashboard("admin@example.com");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isSameAs(snapshot);
        verify(adminAuthorizationService).assertAdmin("admin@example.com");
        verify(adminDashboardService).getDashboardSnapshot();
    }

    @Test
    void closeSectionCallsServiceWithReservedTrue() {
        Map<String, Object> result = Map.of("section", "A", "reserved", true, "updatedSpots", 3);
        when(adminDashboardService.setSectionReserved("A", true)).thenReturn(result);

        ResponseEntity<Map<String, Object>> response = controller.closeSection("admin@example.com", "A");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isSameAs(result);
        verify(adminAuthorizationService).assertAdmin("admin@example.com");
        verify(adminDashboardService).setSectionReserved("A", true);
    }

    @Test
    void openSectionCallsServiceWithReservedFalse() {
        Map<String, Object> result = Map.of("section", "A", "reserved", false, "updatedSpots", 3);
        when(adminDashboardService.setSectionReserved("A", false)).thenReturn(result);

        ResponseEntity<Map<String, Object>> response = controller.openSection("admin@example.com", "A");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isSameAs(result);
        verify(adminAuthorizationService).assertAdmin("admin@example.com");
        verify(adminDashboardService).setSectionReserved("A", false);
    }

    @Test
    void promoteUserExtractsEmailAndDelegates() {
        Map<String, String> payload = new HashMap<>();
        payload.put("email", "new-admin@example.com");

        Map<String, Object> result = Map.of("email", "new-admin@example.com", "role", "ADMIN");
        when(adminDashboardService.promoteToAdmin("new-admin@example.com")).thenReturn(result);

        ResponseEntity<Map<String, Object>> response = controller.promoteUser("admin@example.com", payload);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isSameAs(result);
        verify(adminAuthorizationService).assertAdmin("admin@example.com");
        verify(adminDashboardService).promoteToAdmin("new-admin@example.com");
    }
}
