package uk.ac.rhul.CS3821.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class GreaterAngliaService {

    private static final Logger logger = LoggerFactory.getLogger(GreaterAngliaService.class);

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${greateranglia.departures-url:https://api.greateranglia.co.uk/v1/departures}")
    private String departuresUrl;

    @Value("${greateranglia.token-url:}")
    private String tokenUrl;

    @Value("${greateranglia.client-id:}")
    private String clientId;

    @Value("${greateranglia.client-secret:}")
    private String clientSecret;

    private volatile String bearerToken;
    private volatile Instant tokenExpiresAt;

    public List<Map<String, Object>> fetchLiveDepartures(String station) {
        try {
            HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
            URI uri = UriComponentsBuilder.fromHttpUrl(departuresUrl)
                    .queryParam("station", station)
                    .build()
                    .toUri();
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(uri, HttpMethod.GET, entity, Map.class);
            Map<String, Object> payload = response.getBody();
            List<Map<String, Object>> normalized = normalizePayload(payload);
            if (!normalized.isEmpty()) {
                return normalized;
            }
        } catch (RestClientException ex) {
            logger.warn("Failed to load Greater Anglia departures for {}: {}", station, ex.getMessage());
        }
        return Collections.singletonList(createFallbackService(station));
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        String token = fetchToken();
        if (token != null) {
            headers.setBearerAuth(token);
        }
        return headers;
    }

    private synchronized String fetchToken() {
        if (isBlank(tokenUrl) || isBlank(clientId) || isBlank(clientSecret)) {
            return bearerToken;
        }
        if (bearerToken != null && tokenExpiresAt != null && Instant.now().isBefore(tokenExpiresAt)) {
            return bearerToken;
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("grant_type", "client_credentials");
            form.add("client_id", clientId);
            form.add("client_secret", clientSecret);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);
            ResponseEntity<Map<String, Object>> tokenResponse = restTemplate.postForEntity(tokenUrl, request, Map.class);
            Map<String, Object> body = tokenResponse.getBody();
            if (body != null) {
                bearerToken = (String) body.get("access_token");
                Number expires = (Number) body.get("expires_in");
                if (expires != null) {
                    tokenExpiresAt = Instant.now().plusSeconds(expires.longValue() - 30);
                } else {
                    tokenExpiresAt = Instant.now().plusSeconds(300);
                }
                return bearerToken;
            }
        } catch (RestClientException ex) {
            logger.warn("Unable to refresh Greater Anglia token: {}", ex.getMessage());
        }
        bearerToken = null;
        tokenExpiresAt = null;
        return null;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> normalizePayload(Map<String, Object> payload) {
        if (payload == null) {
            return Collections.emptyList();
        }
        Object candidate = payload.get("trainServices");
        if (candidate == null) {
            candidate = payload.get("services");
        }
        if (candidate == null) {
            candidate = payload.get("departures");
        }
        if (candidate == null) {
            candidate = payload.get("departureBoard");
        }
        return toServiceList(candidate);
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> toServiceList(Object candidate) {
        if (candidate instanceof List<?> list) {
            return list.stream()
                    .filter(item -> item instanceof Map)
                    .map(item -> normalizeService((Map<String, Object>) item))
                    .collect(Collectors.toList());
        }
        if (candidate instanceof Map<?, ?> map) {
            return Collections.singletonList(normalizeService((Map<String, Object>) map));
        }
        return Collections.emptyList();
    }

    private Map<String, Object> normalizeService(Map<String, Object> raw) {
        Map<String, Object> normalized = new HashMap<>();
        normalized.put("destination", buildDestination(raw));
        normalized.put("std", pickNonEmpty(raw, "std", "scheduledDeparture", "departureTime", "plannedDeparture"));
        normalized.put("etd", pickNonEmpty(raw, "etd", "expectedDeparture", "estimatedDeparture", "departureTimeReal"));
        normalized.put("platform", pickNonEmpty(raw, "platform", "platformName"));
        normalized.put("operator", pickNonEmpty(raw, "operator", "operatorName", "trainOperator"));
        normalized.put("status", pickNonEmpty(raw, "status", "serviceStatus", "latestDeparture"));
        normalized.put("raw", raw);
        return normalized;
    }

    private List<Map<String, String>> buildDestination(Map<String, Object> raw) {
        Object destination = raw.get("destination");
        if (destination instanceof List<?> list) {
            List<Map<String, String>> mapped = list.stream()
                    .map(this::destinationFromObject)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            if (!mapped.isEmpty()) {
                return mapped;
            }
        } else {
            Map<String, String> single = destinationFromObject(destination);
            if (single != null) {
                return Collections.singletonList(single);
            }
            Map<String, String> fallback = destinationFromObject(raw.get("locationName"));
            if (fallback != null) {
                return Collections.singletonList(fallback);
            }
        }
        return Collections.singletonList(Map.of("locationName", "Unknown destination"));
    }

    @SuppressWarnings("unchecked")
    private Map<String, String> destinationFromObject(Object value) {
        if (value instanceof Map<?, ?> map) {
            String location = pickNonEmpty((Map<String, Object>) map, "locationName", "name", "destination");
            if (location != null) {
                return Map.of("locationName", location);
            }
        }
        if (value instanceof String str && !str.isBlank()) {
            return Map.of("locationName", str);
        }
        return null;
    }

    private String pickNonEmpty(Map<String, Object> source, String... keys) {
        if (source == null) {
            return null;
        }
        for (String key : keys) {
            Object value = source.get(key);
            if (value instanceof String string && !string.isBlank()) {
                return string;
            }
        }
        return null;
    }

    private Map<String, Object> createFallbackService(String station) {
        String display = (station == null || station.isBlank()) ? "Liverpool Street" : station;
        return Map.of(
                "destination", Collections.singletonList(Map.of("locationName", "Live data currently unavailable")),
                "std", "n/a",
                "etd", "n/a",
                "operator", "Greater Anglia",
                "status", "Unable to retrieve live data for " + display
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

/**
 * Wraps placeholder calls into the Greater Anglia API for journey and disruption info.
 */
@Service
public class GreaterAngliaService {

    private static final String BASE_URL = "https://api.greateranglia.co.uk"; // placeholder

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Hits the mocked journey endpoint for inter-city travel information.
     */
    public String getJourneyPlan(String from, String to) {
        String url = BASE_URL + "/journey/" + from + "/to/" + to;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }

    /**
     * Retrieves the current disruptions feed from the placeholder API surface.
     */
    public String getDisruptions() {
        String url = BASE_URL + "/disruptions";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}