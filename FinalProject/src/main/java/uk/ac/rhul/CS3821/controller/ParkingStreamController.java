package uk.ac.rhul.CS3821.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import uk.ac.rhul.CS3821.service.ParkingAvailabilityPublisher;

@RestController
public class ParkingStreamController {

    private final ParkingAvailabilityPublisher publisher;

    public ParkingStreamController(ParkingAvailabilityPublisher publisher) {
        this.publisher = publisher;
    }

    @GetMapping("/spots/stream")
    public SseEmitter streamSpots() {
        return publisher.subscribe();
    }
}