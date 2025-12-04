package uk.ac.rhul.CS3821.service;

import com.squareup.square.Environment;
import com.squareup.square.SquareClient;
import com.squareup.square.exceptions.ApiException;
import com.squareup.square.models.CreatePaymentRequest;
import com.squareup.square.models.CreatePaymentResponse;
import com.squareup.square.models.GetPaymentResponse;
import com.squareup.square.models.Money;
import com.squareup.square.models.RefundPaymentRequest;
import com.squareup.square.models.RefundPaymentResponse;

import uk.ac.rhul.CS3821.dto.PaymentRequest;
import uk.ac.rhul.CS3821.dto.PaymentResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;

@Service
public class PaymentService {

    private final SquareClient squareClient;

    public PaymentService(@Value("${square.accessToken}") String accessToken,
                          @Value("${square.environment}") String environment) {
        Environment targetEnv = environment.equalsIgnoreCase("sandbox") ? Environment.SANDBOX : Environment.PRODUCTION;
        this.squareClient = new SquareClient.Builder()
                .environment(targetEnv)
                .accessToken(accessToken)
                .build();
    }

        public CreatePaymentResponse createPayment(int amountCents, String sourceId) throws ApiException, IOException {
                Money money = new Money.Builder()
                                .amount((long) amountCents)
                                .currency("GBP")
                                .build();

        CreatePaymentRequest request = new CreatePaymentRequest.Builder(sourceId, UUID.randomUUID().toString(), money)
                .build();

        return squareClient.getPaymentsApi().createPayment(request);
    }

        public RefundPaymentResponse refundPayment(String paymentId, int amountCents) throws ApiException, IOException {
                Money money = new Money.Builder()
                                .amount((long) amountCents)
                                .currency("GBP")
                                .build();

        RefundPaymentRequest request = new RefundPaymentRequest.Builder(UUID.randomUUID().toString(), paymentId, money)
                .build();

        return squareClient.getRefundsApi().refundPayment(request);
    }

        public PaymentResponse processPayment(PaymentRequest request) {
                try {
                        CreatePaymentResponse response = createPayment(request.getAmount(), request.getCardNumber());
                        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
                                return new PaymentResponse(null, "FAILED", response.getErrors().get(0).getDetail());
                        }
                        if (response.getPayment() == null) {
                                return new PaymentResponse(null, "FAILED", "Payment gateway returned no payment data.");
                        }
                        return new PaymentResponse(response.getPayment().getId(),
                                        response.getPayment().getStatus(),
                                        "Payment processed successfully.");
                } catch (ApiException | IOException ex) {
                        return new PaymentResponse(null, "FAILED", ex.getMessage());
                }
        }

        public PaymentResponse getPaymentStatus(String id) {
                try {
                        GetPaymentResponse response = squareClient.getPaymentsApi().getPayment(id);
                        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
                                return new PaymentResponse(id, "FAILED", response.getErrors().get(0).getDetail());
                        }
                        if (response.getPayment() == null) {
                                return new PaymentResponse(id, "UNKNOWN", "Payment record was not found.");
                        }
                        return new PaymentResponse(response.getPayment().getId(),
                                        response.getPayment().getStatus(),
                                        "Payment status retrieved.");
                } catch (ApiException | IOException ex) {
                        return new PaymentResponse(id, "FAILED", ex.getMessage());
                }
        }
}