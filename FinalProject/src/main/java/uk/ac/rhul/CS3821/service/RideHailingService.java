package uk.ac.rhul.CS3821.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * I pull nearby operators from TfL Cabwise and normalize the payload for the UI.
 */
@Service
public class RideHailingService {

    private static final String TFL_CABWISE_URL = "https://api.tfl.gov.uk/Cabwise/search";

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * I query by coordinate + radius because the ride page is location-driven.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getNearbyOperators(double lat, double lon, int radiusMeters) {
        String url = UriComponentsBuilder.fromHttpUrl(TFL_CABWISE_URL)
                .queryParam("lat", lat)
                .queryParam("lon", lon)
                .queryParam("radius", radiusMeters)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");

        Map<String, Object> payload;
        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            payload = response.getBody();
        } catch (RestClientException ignored) {
            // I return an empty list here because upstream outages should not crash the page.
            return List.of();
        }

        if (payload == null) {
            return List.of();
        }

        Object operatorsObj = payload.get("Operators");
        if (!(operatorsObj instanceof Map<?, ?> operatorsMap)) {
            return List.of();
        }

        Object operatorListObj = operatorsMap.get("OperatorList");
        if (!(operatorListObj instanceof List<?> operatorList)) {
            return List.of();
        }

        List<Map<String, Object>> normalized = new ArrayList<>();
        for (Object entry : operatorList) {
            if (!(entry instanceof Map<?, ?> op)) {
                continue;
            }

            String provider = asString(op.get("TradingName"));
            if (provider.isBlank()) {
                provider = asString(op.get("OrganisationName"));
            }
            if (provider.isBlank()) {
                continue;
            }

            double distanceMiles = asDouble(op.get("Distance"));
            int etaMinutes = Math.max(2, (int) Math.round(distanceMiles * 6));

            normalized.add(Map.of(
                    "provider", provider,
                    "etaMinutes", etaMinutes,
                    "distanceMiles", distanceMiles,
                    "bookingPhone", asString(op.get("BookingsPhoneNumber")),
                    "zone", asString(op.get("AddressLine2")),
                    "cardAccepted", asBoolean(op.get("CreditDebitCard")),
                    "wheelchairAccessible", asBoolean(op.get("WheelchairAccessible")),
                    "publicAccess", asBoolean(op.get("PublicAccess"))
            ));
        }

        normalized.sort(Comparator.comparingDouble(item -> asDouble(item.get("distanceMiles"))));
        return normalized.stream().limit(10).toList();
    }

    private String asString(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private boolean asBoolean(Object value) {
        if (value instanceof Boolean b) {
            return b;
        }
        if (value == null) {
            return false;
        }
        return Boolean.parseBoolean(String.valueOf(value));
    }

    private double asDouble(Object value) {
        if (value instanceof Number n) {
            return n.doubleValue();
        }
        if (value == null) {
            return 0;
        }
        try {
            return Double.parseDouble(String.valueOf(value));
        } catch (NumberFormatException ignored) {
            return 0;
        }
    }
}