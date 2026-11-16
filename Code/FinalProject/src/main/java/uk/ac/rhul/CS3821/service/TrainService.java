package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * Provides train departures for journey-planning endpoints.
 */
@Service
public class TrainService {

    private static final DateTimeFormatter HH_MM = DateTimeFormatter.ofPattern("HH:mm");

    /**
     * Returns synthetic but time-relative services for a station request.
     *
     * @param station station token or code
     * @return list of departures matching the current time window
     */
    public List<Map<String, Object>> getLiveTrains(String station) {
        String stationToken = station == null ? "" : station.trim();
        String key = stationToken.toUpperCase();
        LocalTime now = LocalTime.now().withSecond(0).withNano(0);

        String hubDestination = "SEVEN_SISTERS".equals(key) ? "Liverpool Street" : "Seven Sisters";
        String requestedDestination = stationToken.isBlank() ? "Tottenham Hale" : normalizeStationName(stationToken);

        return List.of(
                createService(hubDestination, now.plusMinutes(8), "On time"),
                createService(requestedDestination, now.plusMinutes(18), "Expected 5 min late")
        );
    }

    private Map<String, Object> createService(String destinationName, LocalTime std, String etd) {
        return Map.of(
                "destination", List.of(Map.of("locationName", destinationName)),
                "std", std.format(HH_MM),
                "etd", etd,
                "operator", "National Rail"
        );
    }

    private String normalizeStationName(String station) {
        String cleaned = station.replace("_", " ").trim();
        if (cleaned.isEmpty()) {
            return "Tottenham Hale";
        }
        return cleaned.substring(0, 1).toUpperCase() + cleaned.substring(1).toLowerCase();
    }
}
