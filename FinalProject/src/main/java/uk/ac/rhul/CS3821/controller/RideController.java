package uk.ac.rhul.CS3821.controller;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import uk.ac.rhul.CS3821.service.RideHailingService;

/**
 * Exposes live nearby ride operator data for the frontend ride options page.
 */
@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RideController {

    private final RideHailingService rideHailingService;

    public RideController(RideHailingService rideHailingService) {
        this.rideHailingService = rideHailingService;
    }

    /**
     * Returns live nearby operators around the provided coordinate.
     */
    @GetMapping("/live")
    public Map<String, Object> getLiveRides(
            @RequestParam(defaultValue = "51.6048") double lat,
            @RequestParam(defaultValue = "-0.0660") double lon,
            @RequestParam(defaultValue = "3000") int radiusMeters
    ) {
        List<Map<String, Object>> rides = rideHailingService.getNearbyOperators(lat, lon, radiusMeters);
        return Map.of(
                "source", "TfL Cabwise",
                "updatedAt", Instant.now().toString(),
                "count", rides.size(),
                "rides", rides
        );
    }
}
