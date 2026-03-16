package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

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
}
