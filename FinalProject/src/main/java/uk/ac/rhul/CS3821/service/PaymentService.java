package uk.ac.rhul.CS3821.service;

import com.squareup.square.SquareClient;
import com.squareup.square.models.CreatePaymentRequest;
import com.squareup.square.models.Money;
import com.squareup.square.models.CreatePaymentResponse;
import com.squareup.square.models.RefundPaymentRequest;
import com.squareup.square.models.RefundPaymentResponse;

import uk.ac.rhul.CS3821.dto.PaymentRequest;
import uk.ac.rhul.CS3821.dto.PaymentResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    private final SquareClient squareClient;

    public PaymentService(@Value("${square.accessToken}") String accessToken,
                          @Value("${square.environment}") String environment) {
        this.squareClient = new SquareClient.Builder()
                .environment(environment.equalsIgnoreCase("sandbox") ?
                        com.squareup.square.Environment.SANDBOX :
                        com.squareup.square.Environment.PRODUCTION)
                .accessToken(accessToken)
                .build();
    }

    public CreatePaymentResponse createPayment(int amountCents, String sourceId) throws Exception {
        Money money = new Money.Builder()
                .amount(amountCents)
                .currency("GBP")
                .build();

        CreatePaymentRequest request = new CreatePaymentRequest.Builder(sourceId, UUID.randomUUID().toString(), money)
                .build();

        return squareClient.getPaymentsApi().createPayment(request);
    }

    public RefundPaymentResponse refundPayment(String paymentId, int amountCents) throws Exception {
        Money money = new Money.Builder()
                .amount(amountCents)
                .currency("GBP")
                .build();

        RefundPaymentRequest request = new RefundPaymentRequest.Builder(UUID.randomUUID().toString(), paymentId, money)
                .build();

        return squareClient.getRefundsApi().refundPayment(request);
    }

	public PaymentResponse processPayment(PaymentRequest request) {
		// TODO Auto-generated method stub
		return null;
	}

	public PaymentResponse getPaymentStatus(String id) {
		// TODO Auto-generated method stub
		return null;
	}
}