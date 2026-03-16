package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class RideHailingServiceTest {

    @Test
    @SuppressWarnings("unchecked")
    void getNearbyOperatorsNormalizesAndSortsPayload() {
        RideHailingService service = new RideHailingService();
        RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
        ReflectionTestUtils.setField(service, "restTemplate", restTemplate);

        Map<String, Object> first = Map.of(
                "TradingName", "Beta Cars",
                "Distance", 2.0,
                "BookingsPhoneNumber", "111"
        );
        Map<String, Object> second = Map.of(
                "TradingName", "Alpha Cars",
                "Distance", 1.0,
                "BookingsPhoneNumber", "222"
        );

        Map<String, Object> payload = Map.of(
                "Operators", Map.of("OperatorList", List.of(first, second))
        );

        when(restTemplate.exchange(
                ArgumentMatchers.contains("https://api.tfl.gov.uk/Cabwise/search"),
                ArgumentMatchers.eq(HttpMethod.GET),
                ArgumentMatchers.any(HttpEntity.class),
                ArgumentMatchers.<ParameterizedTypeReference<Map<String, Object>>>any()
        )).thenReturn(ResponseEntity.ok(payload));

        List<Map<String, Object>> result = service.getNearbyOperators(51.6, -0.06, 3000);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).get("provider")).isEqualTo("Alpha Cars");
        assertThat(result.get(1).get("provider")).isEqualTo("Beta Cars");
    }

        @Test
        @SuppressWarnings("unchecked")
        void getNearbyOperatorsReturnsEmptyWhenApiThrows() {
                RideHailingService service = new RideHailingService();
                RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
                ReflectionTestUtils.setField(service, "restTemplate", restTemplate);

                when(restTemplate.exchange(
                                ArgumentMatchers.anyString(),
                                ArgumentMatchers.eq(HttpMethod.GET),
                                ArgumentMatchers.any(HttpEntity.class),
                                ArgumentMatchers.<ParameterizedTypeReference<Map<String, Object>>>any()
                )).thenThrow(new RestClientException("down"));

                List<Map<String, Object>> result = service.getNearbyOperators(51.6, -0.06, 3000);

                assertThat(result).isEmpty();
        }

        @Test
        @SuppressWarnings("unchecked")
        void getNearbyOperatorsReturnsEmptyForInvalidPayloadShapes() {
                RideHailingService service = new RideHailingService();
                RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
                ReflectionTestUtils.setField(service, "restTemplate", restTemplate);

                when(restTemplate.exchange(
                                ArgumentMatchers.anyString(),
                                ArgumentMatchers.eq(HttpMethod.GET),
                                ArgumentMatchers.any(HttpEntity.class),
                                ArgumentMatchers.<ParameterizedTypeReference<Map<String, Object>>>any()
                )).thenReturn(ResponseEntity.ok(Map.of("Operators", "wrong")));

                assertThat(service.getNearbyOperators(51.6, -0.06, 3000)).isEmpty();

                when(restTemplate.exchange(
                                ArgumentMatchers.anyString(),
                                ArgumentMatchers.eq(HttpMethod.GET),
                                ArgumentMatchers.any(HttpEntity.class),
                                ArgumentMatchers.<ParameterizedTypeReference<Map<String, Object>>>any()
                )).thenReturn(ResponseEntity.ok(Map.of("Operators", Map.of("OperatorList", "wrong"))));

                assertThat(service.getNearbyOperators(51.6, -0.06, 3000)).isEmpty();
        }

        @Test
        void privateHelpersCoverBooleanAndNumberEdgeCases() throws Exception {
                RideHailingService service = new RideHailingService();

                Method asBoolean = RideHailingService.class.getDeclaredMethod("asBoolean", Object.class);
                Method asDouble = RideHailingService.class.getDeclaredMethod("asDouble", Object.class);
                asBoolean.setAccessible(true);
                asDouble.setAccessible(true);

                assertThat((Boolean) asBoolean.invoke(service, Boolean.TRUE)).isTrue();
                assertThat((Boolean) asBoolean.invoke(service, new Object[]{null})).isFalse();
                assertThat((Boolean) asBoolean.invoke(service, "true")).isTrue();

                assertThat((Double) asDouble.invoke(service, 1.5)).isEqualTo(1.5);
                assertThat((Double) asDouble.invoke(service, new Object[]{null})).isEqualTo(0.0);
                assertThat((Double) asDouble.invoke(service, "not-a-number")).isEqualTo(0.0);
        }
}
