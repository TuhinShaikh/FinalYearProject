package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import uk.ac.rhul.CS3821.dto.PaymentRequest;
import uk.ac.rhul.CS3821.dto.PaymentResponse;

@Service
public class PaymentService {

    public PaymentResponse processPayment(PaymentRequest request) {
        // TODO: integrate Square API sandbox
        return new PaymentResponse("txn123", "SUCCESS", "Payment processed");
    }

    public PaymentResponse getPaymentStatus(String transactionId) {
        // TODO: query Square API or logs
        return new PaymentResponse(transactionId, "SUCCESS", "Status retrieved");
    }
}