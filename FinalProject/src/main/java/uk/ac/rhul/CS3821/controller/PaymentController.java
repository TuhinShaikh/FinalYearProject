package uk.ac.rhul.CS3821.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import uk.ac.rhul.CS3821.dto.PaymentRequest;
import uk.ac.rhul.CS3821.dto.SquareConfigResponse;
import uk.ac.rhul.CS3821.service.PaymentService;

// I use this controller as a safe proxy so card tokens never need direct backend secrets in the browser.
@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/config")
    public ResponseEntity<SquareConfigResponse> getConfig() {
        try {
            return ResponseEntity.ok(
                new SquareConfigResponse(paymentService.getLocationId()));
        } catch (Exception e) {
            return ResponseEntity.ok(new SquareConfigResponse(null));
        }
    }

    // I process card token + amount here because payment creation should stay on the server side.
    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest request) {
        try {
            return ResponseEntity.ok(paymentService.createPayment(
                request.getAmountCents(), request.getSourceId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // I kept refund logic here so support/admin actions use the same endpoint flow.
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