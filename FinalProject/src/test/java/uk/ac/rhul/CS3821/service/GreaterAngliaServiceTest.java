package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class GreaterAngliaServiceTest {

    @Test
    @SuppressWarnings("unchecked")
    void fetchLiveDeparturesNormalizesPayload() {
        GreaterAngliaService service = new GreaterAngliaService(new RestTemplateBuilder());
        RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
        ReflectionTestUtils.setField(service, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(service, "departuresUrl", "https://api.greateranglia.co.uk/v1/departures");

        Map<String, Object> rawService = Map.of(
                "destination", "Milton Keynes",
                "scheduledDeparture", "13:15",
                "expectedDeparture", "On time",
                "platformName", "7",
                "operatorName", "Greater Anglia",
                "serviceStatus", "On time"
        );
        Map<String, Object> payload = Map.of("trainServices", List.of(rawService));

        when(restTemplate.exchange(
                ArgumentMatchers.any(),
                ArgumentMatchers.eq(HttpMethod.GET),
                ArgumentMatchers.any(HttpEntity.class),
                ArgumentMatchers.eq(Map.class)
        )).thenReturn(ResponseEntity.ok(payload));

        List<Map<String, Object>> result = service.fetchLiveDepartures("LST");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).get("std")).isEqualTo("13:15");
        assertThat(result.get(0).get("etd")).isEqualTo("On time");
        assertThat(result.get(0).get("platform")).isEqualTo("7");
        assertThat(result.get(0).get("operator")).isEqualTo("Greater Anglia");
        assertThat(result.get(0).get("status")).isEqualTo("On time");
        assertThat(result.get(0).get("destination")).isEqualTo(List.of(Map.of("locationName", "Milton Keynes")));
    }

    @Test
    @SuppressWarnings("unchecked")
    void fetchLiveDeparturesReturnsFallbackOnRestClientError() {
        GreaterAngliaService service = new GreaterAngliaService(new RestTemplateBuilder());
        RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
        ReflectionTestUtils.setField(service, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(service, "departuresUrl", "https://api.greateranglia.co.uk/v1/departures");

        when(restTemplate.exchange(
                ArgumentMatchers.any(),
                ArgumentMatchers.eq(HttpMethod.GET),
                ArgumentMatchers.any(HttpEntity.class),
                ArgumentMatchers.eq(Map.class)
        )).thenThrow(new RestClientException("down"));

        List<Map<String, Object>> result = service.fetchLiveDepartures("LST");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).get("operator")).isEqualTo("Greater Anglia");
        assertThat(String.valueOf(result.get(0).get("status"))).contains("Unable to retrieve live data");
    }

    @Test
    void journeyAndDisruptionsDelegateToRestTemplate() {
        GreaterAngliaService service = new GreaterAngliaService(new RestTemplateBuilder());
        RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
        ReflectionTestUtils.setField(service, "restTemplate", restTemplate);

        when(restTemplate.getForObject("https://api.greateranglia.co.uk/journey/A/to/B", String.class))
                .thenReturn("journey-json");
        when(restTemplate.getForObject("https://api.greateranglia.co.uk/disruptions", String.class))
                .thenReturn("disruptions-json");

        assertThat(service.getJourneyPlan("A", "B")).isEqualTo("journey-json");
        assertThat(service.getDisruptions()).isEqualTo("disruptions-json");
    }

        @Test
        @SuppressWarnings("unchecked")
        void fetchTokenReturnsExistingTokenWhenAuthConfigMissing() {
                GreaterAngliaService service = new GreaterAngliaService(new RestTemplateBuilder());
                ReflectionTestUtils.setField(service, "tokenUrl", "");
                ReflectionTestUtils.setField(service, "clientId", "");
                ReflectionTestUtils.setField(service, "clientSecret", "");
                ReflectionTestUtils.setField(service, "bearerToken", "cached-token");

                String token = (String) ReflectionTestUtils.invokeMethod(service, "fetchToken");

                assertThat(token).isEqualTo("cached-token");
        }

        @Test
        @SuppressWarnings("unchecked")
        void fetchTokenReturnsCachedTokenWhenNotExpired() {
                GreaterAngliaService service = new GreaterAngliaService(new RestTemplateBuilder());
                ReflectionTestUtils.setField(service, "tokenUrl", "https://auth.example/token");
                ReflectionTestUtils.setField(service, "clientId", "id");
                ReflectionTestUtils.setField(service, "clientSecret", "secret");
                ReflectionTestUtils.setField(service, "bearerToken", "still-valid");
                ReflectionTestUtils.setField(service, "tokenExpiresAt", Instant.now().plusSeconds(120));

                String token = (String) ReflectionTestUtils.invokeMethod(service, "fetchToken");

                assertThat(token).isEqualTo("still-valid");
        }

        @Test
        @SuppressWarnings("unchecked")
        void fetchTokenRefreshesUsingTokenEndpoint() {
                GreaterAngliaService service = new GreaterAngliaService(new RestTemplateBuilder());
                RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
                ReflectionTestUtils.setField(service, "restTemplate", restTemplate);
                ReflectionTestUtils.setField(service, "tokenUrl", "https://auth.example/token");
                ReflectionTestUtils.setField(service, "clientId", "id");
                ReflectionTestUtils.setField(service, "clientSecret", "secret");

                Map<String, Object> tokenBody = Map.of("access_token", "fresh", "expires_in", 120);
                when(restTemplate.postForEntity(
                                ArgumentMatchers.eq("https://auth.example/token"),
                                ArgumentMatchers.any(HttpEntity.class),
                                ArgumentMatchers.eq(Map.class)
                )).thenReturn(ResponseEntity.ok(tokenBody));

                String token = (String) ReflectionTestUtils.invokeMethod(service, "fetchToken");

                assertThat(token).isEqualTo("fresh");
                assertThat(ReflectionTestUtils.getField(service, "tokenExpiresAt")).isNotNull();
        }

        @Test
        @SuppressWarnings("unchecked")
        void fetchTokenReturnsNullWhenRefreshFails() {
                GreaterAngliaService service = new GreaterAngliaService(new RestTemplateBuilder());
                RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
                ReflectionTestUtils.setField(service, "restTemplate", restTemplate);
                ReflectionTestUtils.setField(service, "tokenUrl", "https://auth.example/token");
                ReflectionTestUtils.setField(service, "clientId", "id");
                ReflectionTestUtils.setField(service, "clientSecret", "secret");

                when(restTemplate.postForEntity(
                                ArgumentMatchers.eq("https://auth.example/token"),
                                ArgumentMatchers.any(HttpEntity.class),
                                ArgumentMatchers.eq(Map.class)
                )).thenThrow(new RestClientException("auth-down"));

                String token = (String) ReflectionTestUtils.invokeMethod(service, "fetchToken");

                assertThat(token).isNull();
                assertThat(ReflectionTestUtils.getField(service, "bearerToken")).isNull();
                assertThat(ReflectionTestUtils.getField(service, "tokenExpiresAt")).isNull();
        }

        @Test
        @SuppressWarnings("unchecked")
        void normalizePayloadCoversAlternateKeysAndFallbackDestination() {
                GreaterAngliaService service = new GreaterAngliaService(new RestTemplateBuilder());

                Map<String, Object> payload = Map.of(
                                "services", List.of(Map.of("destination", Map.of(), "std", "10:00", "etd", "Delayed"))
                );

                List<Map<String, Object>> normalized =
                                (List<Map<String, Object>>) ReflectionTestUtils.invokeMethod(service, "normalizePayload", payload);

                assertThat(normalized).hasSize(1);
                assertThat(normalized.get(0).get("destination")).isEqualTo(List.of(Map.of("locationName", "Unknown destination")));
                assertThat(normalized.get(0).get("std")).isEqualTo("10:00");
                assertThat(normalized.get(0).get("etd")).isEqualTo("Delayed");
        }
}
