package uk.ac.rhul.CS3821.service;

import com.squareup.square.SquareClient;
import com.squareup.square.Environment;
import com.squareup.square.api.LocationsApi;
import com.squareup.square.api.PaymentsApi;
import com.squareup.square.api.RefundsApi;
import com.squareup.square.exceptions.ApiException;
import com.squareup.square.models.CreatePaymentRequest;
import com.squareup.square.models.CreatePaymentResponse;
import com.squareup.square.models.ListLocationsResponse;
import com.squareup.square.models.Location;
import com.squareup.square.models.Money;
import com.squareup.square.models.RefundPaymentRequest;
import com.squareup.square.models.RefundPaymentResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * I wrapped Square SDK calls here so payment and refund behavior stays consistent across controllers.
 */
@Service
public class PaymentService {

    private final SquareClient squareClient;
    private String cachedLocationId;

        /**
         * I build the client from config so I can switch sandbox/production without touching business logic.
         */
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

        /**
         * I create the payment request from source token + amount because Square expects cents and currency.
         */
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

        /**
         * I keep refund amounts in cents so refund requests match Square's schema exactly.
         */
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

    public synchronized String getLocationId() throws ApiException, IOException {
        if (cachedLocationId != null) {
            return cachedLocationId;
        }

        LocationsApi locationsApi = squareClient.getLocationsApi();
        ListLocationsResponse response = locationsApi.listLocations();

        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new IOException("Square location lookup failed: " + response.getErrors());
        }

        List<Location> locations = response.getLocations();
        if (locations == null) {
            locations = Collections.emptyList();
        }

        cachedLocationId = locations.stream()
                .filter(location -> "ACTIVE".equals(location.getStatus()))
                .map(Location::getId)
                .findFirst()
                .orElse(locations.stream().findFirst().map(Location::getId).orElse(null));

        return cachedLocationId;
    }
}