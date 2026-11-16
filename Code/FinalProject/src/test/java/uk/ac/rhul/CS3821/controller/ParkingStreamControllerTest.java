package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import uk.ac.rhul.CS3821.service.ParkingAvailabilityPublisher;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ParkingStreamControllerTest {

    @Mock
    private ParkingAvailabilityPublisher publisher;

    @InjectMocks
    private ParkingStreamController controller;

    @Test
    void streamSpotsReturnsPublisherEmitter() {
        SseEmitter emitter = new SseEmitter();
        when(publisher.subscribe()).thenReturn(emitter);

        SseEmitter actual = controller.streamSpots();

        assertThat(actual).isSameAs(emitter);
        verify(publisher).subscribe();
    }
}
