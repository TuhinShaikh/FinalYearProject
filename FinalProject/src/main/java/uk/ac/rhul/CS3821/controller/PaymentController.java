package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.CS3821.dto.PaymentRequest;
import uk.ac.rhul.CS3821.dto.PaymentResponse;
import uk.ac.rhul.CS3821.service.PaymentService;

@RestController
@RequestMapping("/payments")
public class PaymentController {
	@RestController
	@RequestMapping("/payments")
	public class PaymentController {

	    private final PaymentService paymentService;

	    public PaymentController(PaymentService paymentService) {
	        this.paymentService = paymentService;
	    }

