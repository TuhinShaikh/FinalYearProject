package uk.ac.rhul.CS3821.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

@Service
public class GreaterAngliaService {

    private static final Logger logger =
            LoggerFactory.getLogger(GreaterAngliaService.class);

    private static final String BASE_URL =
            "https://api.greateranglia.co.uk";

    private final RestTemplate restTemplate;

    public GreaterAngliaService(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

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
    private final ReentrantLock tokenLock = new ReentrantLock();

    /* ============================================================
       PUBLIC API METHODS
       ============================================================ */

    public List<Map<String, Object>> fetchLiveDepartures(String station) {
        try {
            HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());

            URI uri = UriComponentsBuilder.fromHttpUrl(departuresUrl)
                    .queryParam("station", station)
                    .build()
                    .toUri();

            ResponseEntity<Map> response =
                    restTemplate.exchange(uri, HttpMethod.GET, entity, Map.class);

            Map<String, Object> payload = response.getBody();

            List<Map<String, Object>> normalized = normalizePayload(payload);

            if (!normalized.isEmpty()) {
                return normalized;
            }

        } catch (RestClientException ex) {
            logger.warn("Failed to load departures for {}: {}", station, ex.getMessage());
        }

        return Collections.singletonList(createFallbackService(station));
    }

    public String getJourneyPlan(String from, String to) {
        String url = BASE_URL + "/journey/" + from + "/to/" + to;
        return restTemplate.getForObject(url, String.class);
    }

    public String getDisruptions() {
        return restTemplate.getForObject(BASE_URL + "/disruptions", String.class);
    }

    /* ============================================================
       TOKEN HANDLING (THREAD SAFE)
       ============================================================ */

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        String token = fetchToken();
        if (token != null) {
            headers.setBearerAuth(token);
        }

        return headers;
    }

    private String fetchToken() {

        if (isBlank(tokenUrl) || isBlank(clientId) || isBlank(clientSecret)) {
            return bearerToken;
        }

        if (bearerToken != null &&
            tokenExpiresAt != null &&
            Instant.now().isBefore(tokenExpiresAt)) {
            return bearerToken;
        }

        tokenLock.lock();
        try {
            // Double-check after acquiring lock
            if (bearerToken != null &&
                tokenExpiresAt != null &&
                Instant.now().isBefore(tokenExpiresAt)) {
                return bearerToken;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("grant_type", "client_credentials");
            form.add("client_id", clientId);
            form.add("client_secret", clientSecret);

            HttpEntity<MultiValueMap<String, String>> request =
                    new HttpEntity<>(form, headers);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(tokenUrl, request, Map.class);

            Map<String, Object> body = response.getBody();

            if (body != null) {
                bearerToken = (String) body.get("access_token");

                Number expires = (Number) body.get("expires_in");
                long expiry = (expires != null) ? expires.longValue() : 300;

                tokenExpiresAt = Instant.now().plusSeconds(expiry - 30);

                return bearerToken;
            }

        } catch (RestClientException ex) {
            logger.warn("Token refresh failed: {}", ex.getMessage());
        } finally {
            tokenLock.unlock();
        }

        bearerToken = null;
        tokenExpiresAt = null;
        return null;
    }

    /* ============================================================
       NORMALISATION LOGIC
       ============================================================ */

    private List<Map<String, Object>> normalizePayload(Map<String, Object> payload) {

        if (payload == null) return Collections.emptyList();

        Object candidate = payload.get("trainServices");
        if (candidate == null) candidate = payload.get("services");
        if (candidate == null) candidate = payload.get("departures");
        if (candidate == null) candidate = payload.get("departureBoard");

        return toServiceList(candidate);
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> toServiceList(Object candidate) {

        if (candidate instanceof List<?> list) {
            return list.stream()
                    .filter(Map.class::isInstance)
                    .map(item -> normalizeService((Map<String, Object>) item))
                    .collect(Collectors.toList());
        }

        if (candidate instanceof Map<?, ?> map) {
            return Collections.singletonList(
                    normalizeService((Map<String, Object>) map));
        }

        return Collections.emptyList();
    }

    private Map<String, Object> normalizeService(Map<String, Object> raw) {

        Map<String, Object> normalized = new HashMap<>();

        normalized.put("destination", buildDestination(raw));
        normalized.put("std", pick(raw, "std", "scheduledDeparture", "plannedDeparture"));
        normalized.put("etd", pick(raw, "etd", "expectedDeparture", "estimatedDeparture"));
        normalized.put("platform", pick(raw, "platform", "platformName"));
        normalized.put("operator", pick(raw, "operator", "operatorName"));
        normalized.put("status", pick(raw, "status", "serviceStatus"));

        return normalized;
    }

    private List<Map<String, String>> buildDestination(Map<String, Object> raw) {

        Object destination = raw.get("destination");

        if (destination instanceof String str && !str.isBlank()) {
            return List.of(Map.of("locationName", str));
        }

        if (destination instanceof Map<?, ?> map) {
            String name = (String) map.get("locationName");
            if (name != null && !name.isBlank()) {
                return List.of(Map.of("locationName", name));
            }
        }

        return List.of(Map.of("locationName", "Unknown destination"));
    }

    private String pick(Map<String, Object> source, String... keys) {

        for (String key : keys) {
            Object value = source.get(key);
            if (value instanceof String str && !str.isBlank()) {
                return str;
            }
        }

        return null;
    }

    private Map<String, Object> createFallbackService(String station) {

        String display = (station == null || station.isBlank())
                ? "Liverpool Street"
                : station;

        return Map.of(
                "destination", List.of(Map.of("locationName", "Live data unavailable")),
                "std", "n/a",
                "etd", "n/a",
                "operator", "Greater Anglia",
                "status", "Unable to retrieve live data for " + display
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}