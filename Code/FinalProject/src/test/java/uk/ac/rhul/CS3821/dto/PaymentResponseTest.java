package uk.ac.rhul.CS3821.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PaymentResponseTest {

    @Test
    void constructorAndSettersWork() {
        PaymentResponse response = new PaymentResponse("tx-1", "OK", "done");

        assertThat(response.getTransactionId()).isEqualTo("tx-1");
        assertThat(response.getStatus()).isEqualTo("OK");
        assertThat(response.getMessage()).isEqualTo("done");

        response.setTransactionId("tx-2");
        response.setStatus("FAILED");
        response.setMessage("error");

        assertThat(response.getTransactionId()).isEqualTo("tx-2");
        assertThat(response.getStatus()).isEqualTo("FAILED");
        assertThat(response.getMessage()).isEqualTo("error");
    }
}
