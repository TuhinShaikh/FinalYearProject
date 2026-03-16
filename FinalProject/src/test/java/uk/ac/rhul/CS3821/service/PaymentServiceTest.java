package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class PaymentServiceTest {

    @Test
    void getLocationIdReturnsCachedLocationWhenPresent() throws Exception {
        PaymentService service = new PaymentService("token", "sandbox");
        ReflectionTestUtils.setField(service, "cachedLocationId", "LOC-123");

        String locationId = service.getLocationId();

        assertThat(locationId).isEqualTo("LOC-123");
    }
}
