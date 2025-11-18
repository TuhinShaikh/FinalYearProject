package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import uk.ac.rhul.CS3821.dto.PaymentRequest;
import uk.ac.rhul.CS3821.dto.PaymentResponse;

@Service
public class PaymentService {

    public PaymentResponse processPayment(PaymentRequest request) {
        // TODO: Integrate with Square API sandbox
        // For now, simulate a successful transaction
        return new PaymentResponse("txn_12345", "SUCCESS", "Payment processed successfully");
    }

    public PaymentResponse getPaymentStatus(String id) {
        // TODO: Query Square API or transaction log
        // For now, simulate a lookup
        return new PaymentResponse(id, "SUCCESS", "Payment status retrieved");
    }
}