package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uk.ac.rhul.CS3821.dto.PaymentRequest;
import uk.ac.rhul.CS3821.dto.SquareConfigResponse;
import uk.ac.rhul.CS3821.service.PaymentService;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController controller;

    @Test
    void getConfigReturnsLocationIdWhenAvailable() throws Exception {
        when(paymentService.getLocationId()).thenReturn("LOC-123");

        ResponseEntity<SquareConfigResponse> response = controller.getConfig();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getLocationId()).isEqualTo("LOC-123");
    }

    @Test
    void getConfigReturnsNullLocationWhenServiceThrows() throws Exception {
        when(paymentService.getLocationId()).thenThrow(new RuntimeException("boom"));

        ResponseEntity<SquareConfigResponse> response = controller.getConfig();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getLocationId()).isNull();
    }

    @Test
    void createPaymentReturnsBadRequestOnFailure() throws Exception {
        PaymentRequest request = new PaymentRequest(1200, "cnon:card-nonce");
        when(paymentService.createPayment(1200, "cnon:card-nonce"))
                .thenThrow(new RuntimeException("payment failed"));

        ResponseEntity<?> response = controller.createPayment(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo("payment failed");
    }

    @Test
    void createPaymentReturnsOkOnSuccess() throws Exception {
        PaymentRequest request = new PaymentRequest(1200, "cnon:card-nonce");
        Map<String, Object> payload = Map.of("id", "pay_1");
        when(paymentService.createPayment(1200, "cnon:card-nonce")).thenReturn(payload);

        ResponseEntity<?> response = controller.createPayment(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(payload);
    }

    @Test
    void refundPaymentReturnsBadRequestOnFailure() throws Exception {
        when(paymentService.refundPayment("pay-1", 500)).thenThrow(new RuntimeException("refund failed"));

        ResponseEntity<?> response = controller.refundPayment("pay-1", 500);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo("refund failed");
    }

    @Test
    void refundPaymentReturnsOkOnSuccess() throws Exception {
        Map<String, Object> payload = Map.of("id", "refund_1");
        when(paymentService.refundPayment("pay-1", 500)).thenReturn(payload);

        ResponseEntity<?> response = controller.refundPayment("pay-1", 500);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(payload);
    }
}
