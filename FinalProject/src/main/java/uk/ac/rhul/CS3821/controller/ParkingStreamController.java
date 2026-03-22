package uk.ac.rhul.CS3821.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import uk.ac.rhul.CS3821.service.ParkingAvailabilityPublisher;

/**
 * REST controller exposing Server-Sent Events stream for parking availability.
 */
@RestController
public class ParkingStreamController {

    private final ParkingAvailabilityPublisher publisher;

    public ParkingStreamController(ParkingAvailabilityPublisher publisher) {
        this.publisher = publisher;
    }

    /**
     * Subscribes a client to real-time parking updates.
     *
     * @return SSE emitter for spot updates
     */
    @GetMapping("/spots/stream")
    public SseEmitter streamSpots() {
        return publisher.subscribe();
    }
}