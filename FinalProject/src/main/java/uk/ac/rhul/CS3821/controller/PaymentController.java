package uk.ac.rhul.CS3821.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import uk.ac.rhul.CS3821.dto.PaymentRequest;
import uk.ac.rhul.CS3821.service.PaymentService;

// Proxy for the Square payment service so the UI can charge cards and issue refunds
@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Charge the provided source token for a parking slot
    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest request) {
        try {
            return ResponseEntity.ok(paymentService.createPayment(
                request.getAmountCents(), request.getSourceId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Trigger a refund on an existing charge if the UI asks for it
    @PostMapping("/{id}/refund")
    public ResponseEntity<?> refundPayment(@PathVariable String id,
                                           @RequestParam int amountCents) {
        try {
            return ResponseEntity.ok(paymentService.refundPayment(id, amountCents));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}