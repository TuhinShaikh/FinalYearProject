package uk.ac.rhul.CS3821.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import uk.ac.rhul.CS3821.dto.PaymentRequest;
import uk.ac.rhul.CS3821.dto.SquareConfigResponse;
import uk.ac.rhul.CS3821.service.PaymentService;

/**
 * REST controller exposing payment and refund endpoints.
 */
@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Returns Square config information needed by frontend checkout.
     *
     * @return Square configuration payload
     */
    @GetMapping("/config")
    public ResponseEntity<SquareConfigResponse> getConfig() {
        try {
            return ResponseEntity.ok(
                new SquareConfigResponse(paymentService.getLocationId()));
        } catch (Exception e) {
            return ResponseEntity.ok(new SquareConfigResponse(null));
        }
    }

    /**
     * Creates a payment using a tokenized card source.
     *
     * @param request payment request payload
     * @return provider payment response or validation error
     */
    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest request) {
        try {
            return ResponseEntity.ok(paymentService.createPayment(
                request.getAmountCents(), request.getSourceId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Refunds a payment by id and amount.
     *
     * @param id payment identifier
     * @param amountCents refund amount in minor units
     * @return provider refund response or validation error
     */
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