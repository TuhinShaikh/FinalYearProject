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
 * Wraps the Square SDK so our backend can create payments and refunds with consistent config.
 */
@Service
public class PaymentService {

    private final SquareClient squareClient;
    private String cachedLocationId;

    /**
     * Configures the Square client from application properties and locks in the chosen environment.
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
     * Builds a payment request for the supplied amount and source token.
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
     * Issues a refund for a completed payment, keeping amounts in cents to match Square's schema.
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