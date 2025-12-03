package uk.ac.rhul.CS3821.service;

import com.squareup.square.SquareClient;
import com.squareup.square.models.CreatePaymentRequest;
import com.squareup.square.models.Money;
import com.squareup.square.models.CreatePaymentResponse;
import com.squareup.square.models.RefundPaymentRequest;
import com.squareup.square.models.RefundPaymentResponse;
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
