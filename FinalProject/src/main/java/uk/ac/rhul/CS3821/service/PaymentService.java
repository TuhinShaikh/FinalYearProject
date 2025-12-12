package uk.ac.rhul.CS3821.service;

import com.squareup.square.SquareClient;
import com.squareup.square.Environment;
import com.squareup.square.exceptions.ApiException;
import com.squareup.square.models.CreatePaymentRequest;
import com.squareup.square.models.CreatePaymentResponse;
import com.squareup.square.models.Money;
import com.squareup.square.models.RefundPaymentRequest;
import com.squareup.square.models.RefundPaymentResponse;

import com.squareup.square.api.PaymentsApi;
import com.squareup.square.api.RefundsApi;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;

@Service
public class PaymentService {

    private final SquareClient squareClient;

    public PaymentService(
            @Value("${square.accessToken}") String accessToken,
            @Value("${square.environment}") String environment) {

        this.squareClient = new SquareClient.Builder()
                .environment("sandbox".equalsIgnoreCase(environment)
                        ? Environment.SANDBOX
                        : Environment.PRODUCTION)
                .accessToken(accessToken)
                .build();
    }

    public CreatePaymentResponse createPayment(int amountCents, String sourceId)
            throws ApiException, IOException {

        Money money = new Money.Builder()
                .amount((long) amountCents)
                .currency("GBP")
                .build();

        CreatePaymentRequest request = new CreatePaymentRequest.Builder(
                sourceId,
                UUID.randomUUID().toString())
                .amountMoney(money)
                .build();

        PaymentsApi paymentsApi = squareClient.getPaymentsApi();
        return paymentsApi.createPayment(request);
    }

    public RefundPaymentResponse refundPayment(String paymentId, int amountCents)
            throws ApiException, IOException {

        Money money = new Money.Builder()
                .amount((long) amountCents)
                .currency("GBP")
                .build();

        RefundPaymentRequest request = new RefundPaymentRequest.Builder(
                UUID.randomUUID().toString(),
                money)
                .paymentId(paymentId)
                .build();

        RefundsApi refundsApi = squareClient.getRefundsApi();
        return refundsApi.refundPayment(request);
    }
}