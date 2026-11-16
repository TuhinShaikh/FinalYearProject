package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uk.ac.rhul.CS3821.model.ParkingSpot;
import uk.ac.rhul.CS3821.service.ParkingSpotService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ParkingSpotControllerTest {

    @Mock
    private ParkingSpotService parkingSpotService;

    @InjectMocks
    private ParkingSpotController controller;

    @Test
    void getSpotByIdReturnsNotFoundWhenMissing() {
        UUID id = UUID.randomUUID();
        when(parkingSpotService.getSpotById(id)).thenReturn(Optional.empty());

        ResponseEntity<ParkingSpot> response = controller.getSpotById(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getAllSpotsReturnsData() {
        List<ParkingSpot> spots = List.of(new ParkingSpot(), new ParkingSpot());
        when(parkingSpotService.getAllSpots()).thenReturn(spots);

        ResponseEntity<List<ParkingSpot>> response = controller.getAllSpots();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(spots);
    }

    @Test
    void updateSpotSetsIdAndDelegates() {
        UUID id = UUID.randomUUID();
        ParkingSpot spot = new ParkingSpot();
        when(parkingSpotService.updateSpot(spot)).thenReturn(spot);

        ResponseEntity<ParkingSpot> response = controller.updateSpot(id, spot);

        assertThat(spot.getSpotId()).isEqualTo(id);
        assertThat(response.getBody()).isSameAs(spot);
        verify(parkingSpotService).updateSpot(spot);
    }

    @Test
    void deleteSpotReturnsNoContent() {
        UUID id = UUID.randomUUID();

        ResponseEntity<Void> response = controller.deleteSpot(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(parkingSpotService).deleteSpot(id);
    }
}
