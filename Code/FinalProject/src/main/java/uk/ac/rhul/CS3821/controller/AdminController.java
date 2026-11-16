package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.CS3821.service.AdminAuthorizationService;
import uk.ac.rhul.CS3821.service.AdminDashboardService;

import java.util.Map;

/**
 * Admin endpoints for transaction reporting and parking inventory controls.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminDashboardService adminDashboardService;
    private final AdminAuthorizationService adminAuthorizationService;

    public AdminController(AdminDashboardService adminDashboardService,
                           AdminAuthorizationService adminAuthorizationService) {
        this.adminDashboardService = adminDashboardService;
        this.adminAuthorizationService = adminAuthorizationService;
    }

    /**
     * Returns aggregated transaction and inventory metrics.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard(
            @RequestHeader("X-Admin-Email") String adminEmail
    ) {
        adminAuthorizationService.assertAdmin(adminEmail);
        return ResponseEntity.ok(adminDashboardService.getDashboardSnapshot());
    }

    /**
     * Marks all spots in a section as reserved (section shutdown).
     */
    @PostMapping("/sections/{section}/close")
    public ResponseEntity<Map<String, Object>> closeSection(
            @RequestHeader("X-Admin-Email") String adminEmail,
            @PathVariable String section
    ) {
        adminAuthorizationService.assertAdmin(adminEmail);
        return ResponseEntity.ok(adminDashboardService.setSectionReserved(section, true));
    }

    /**
     * Reopens all spots in a section by clearing reserved state.
     */
    @PostMapping("/sections/{section}/open")
    public ResponseEntity<Map<String, Object>> openSection(
            @RequestHeader("X-Admin-Email") String adminEmail,
            @PathVariable String section
    ) {
        adminAuthorizationService.assertAdmin(adminEmail);
        return ResponseEntity.ok(adminDashboardService.setSectionReserved(section, false));
    }

    /**
     * Promotes an existing user to ADMIN role.
     */
    @PostMapping("/users/promote")
    public ResponseEntity<Map<String, Object>> promoteUser(
            @RequestHeader("X-Admin-Email") String adminEmail,
            @RequestBody Map<String, String> payload
    ) {
        adminAuthorizationService.assertAdmin(adminEmail);
        String email = payload.get("email");
        return ResponseEntity.ok(adminDashboardService.promoteToAdmin(email));
    }
}