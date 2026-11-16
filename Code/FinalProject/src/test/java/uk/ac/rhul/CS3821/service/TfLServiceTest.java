package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class TfLServiceTest {

    @Test
    void getJourneyPlanUsesRestTemplateResponseBody() {
        TfLService service = new TfLService();
        RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
        ReflectionTestUtils.setField(service, "restTemplate", restTemplate);

        String url = "https://api.tfl.gov.uk/Journey/JourneyResults/A/to/B";
        when(restTemplate.getForEntity(url, String.class)).thenReturn(ResponseEntity.ok("journey-json"));

        String actual = service.getJourneyPlan("A", "B");

        assertThat(actual).isEqualTo("journey-json");
    }

    @Test
    void getDisruptionsUsesRestTemplateResponseBody() {
        TfLService service = new TfLService();
        RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
        ReflectionTestUtils.setField(service, "restTemplate", restTemplate);

        String url = "https://api.tfl.gov.uk/Line/Mode/tube/Status";
        when(restTemplate.getForEntity(url, String.class)).thenReturn(ResponseEntity.ok("status-json"));

        String actual = service.getDisruptions("tube");

        assertThat(actual).isEqualTo("status-json");
    }
}
