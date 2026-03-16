package uk.ac.rhul.CS3821.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import uk.ac.rhul.CS3821.service.ParkingAvailabilityPublisher;

// I expose this stream so the UI can react to parking changes in real time.
@RestController
public class ParkingStreamController {

    private final ParkingAvailabilityPublisher publisher;

    public ParkingStreamController(ParkingAvailabilityPublisher publisher) {
        this.publisher = publisher;
    }

    // I return an SSE emitter so the browser stays subscribed to spot updates.
    @GetMapping("/spots/stream")
    public SseEmitter streamSpots() {
        return publisher.subscribe();
    }
}