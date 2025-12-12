package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import uk.ac.rhul.CS3821.model.ParkingSpot;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
/**
 * Streams live parking spot updates via Server-Sent Events to any connected UI clients.
 */
public class ParkingAvailabilityPublisher {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    /**
     * Registers a new emitter and removes it when the client disconnects or times out.
     */
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        return emitter;
    }

    /**
     * Pushes a parking spot payload to every currently subscribed emitter.
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