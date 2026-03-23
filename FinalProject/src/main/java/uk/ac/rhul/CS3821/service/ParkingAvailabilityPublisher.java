package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import uk.ac.rhul.CS3821.model.ParkingSpot;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
/**
 * I stream slot updates through SSE so connected clients get changes without polling.
 */
public class ParkingAvailabilityPublisher {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    /**
        * I register each emitter and remove it on completion/timeout to avoid stale listeners.
     */
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        return emitter;
    }

    /**
        * I broadcast each slot update to all active subscribers and drop broken emitters.
     */
    public void publishUpdate(ParkingSpot spot) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(spot);
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }
}