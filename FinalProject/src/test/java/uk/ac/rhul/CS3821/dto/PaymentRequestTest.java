package uk.ac.rhul.CS3821.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PaymentRequestTest {

    @Test
    void getterAndSetterWork() {
        PaymentRequest request = new PaymentRequest(1200, "src-1");
        assertThat(request.getAmountCents()).isEqualTo(1200);
        assertThat(request.getSourceId()).isEqualTo("src-1");

        request.setAmountCents(2000);
        request.setSourceId("src-2");
        assertThat(request.getAmountCents()).isEqualTo(2000);
        assertThat(request.getSourceId()).isEqualTo("src-2");
    }
}
