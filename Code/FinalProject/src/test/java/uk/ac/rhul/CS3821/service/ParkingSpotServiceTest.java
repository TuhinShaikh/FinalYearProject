package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.ac.rhul.CS3821.model.ParkingSpot;
import uk.ac.rhul.CS3821.repository.ParkingSpotRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ParkingSpotServiceTest {

    @Mock
    private ParkingSpotRepository parkingSpotRepository;

    @InjectMocks
    private ParkingSpotService parkingSpotService;

    @Test
    void createSpotDelegatesToRepository() {
        ParkingSpot spot = new ParkingSpot();
        when(parkingSpotRepository.save(spot)).thenReturn(spot);

        ParkingSpot actual = parkingSpotService.createSpot(spot);

        assertThat(actual).isSameAs(spot);
        verify(parkingSpotRepository).save(spot);
    }

    @Test
    void getSpotByIdReturnsRepositoryResult() {
        UUID id = UUID.randomUUID();
        ParkingSpot spot = new ParkingSpot();
        when(parkingSpotRepository.findById(id)).thenReturn(Optional.of(spot));

        Optional<ParkingSpot> actual = parkingSpotService.getSpotById(id);

        assertThat(actual).contains(spot);
    }

    @Test
    void getAllSpotsReturnsRepositoryResult() {
        List<ParkingSpot> spots = List.of(new ParkingSpot(), new ParkingSpot());
        when(parkingSpotRepository.findAll()).thenReturn(spots);

        List<ParkingSpot> actual = parkingSpotService.getAllSpots();

        assertThat(actual).isEqualTo(spots);
    }

    @Test
    void updateSpotDelegatesToRepository() {
        ParkingSpot spot = new ParkingSpot();
        when(parkingSpotRepository.save(spot)).thenReturn(spot);

        ParkingSpot actual = parkingSpotService.updateSpot(spot);

        assertThat(actual).isSameAs(spot);
        verify(parkingSpotRepository).save(spot);
    }

    @Test
    void deleteSpotDelegatesToRepository() {
        UUID id = UUID.randomUUID();

        parkingSpotService.deleteSpot(id);

        verify(parkingSpotRepository).deleteById(id);
    }
}
