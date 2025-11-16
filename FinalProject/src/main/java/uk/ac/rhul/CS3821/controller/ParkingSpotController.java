package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.CS3821.model.ParkingSpot;
import uk.ac.rhul.CS3821.service.ParkingSpotService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequestMapping("/spots")
public class ParkingSpotController {

    private final ParkingSpotService parkingSpotService;

    public ParkingSpotController(ParkingSpotService parkingSpotService) {
        this.parkingSpotService = parkingSpotService;
    }

    @PostMapping
    public ResponseEntity<ParkingSpot> createSpot(@RequestBody ParkingSpot spot) {
        return ResponseEntity.ok(parkingSpotService.createSpot(spot));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingSpot> getSpotById(@PathVariable UUID id) {
        Optional<ParkingSpot> spot = parkingSpotService.getSpotById(id);
        return spot.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public ResponseEntity<List<ParkingSpot>> getAllSpots() {
        return ResponseEntity.ok(parkingSpotService.getAllSpots());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingSpot> updateSpot(@PathVariable UUID id, @RequestBody ParkingSpot updatedSpot) {
        updatedSpot.setSpotId(id);
        return ResponseEntity.ok(parkingSpotService.updateSpot(updatedSpot));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpot(@PathVariable UUID id) {
        parkingSpotService.deleteSpot(id);
        return ResponseEntity.noContent().build();
    }
}

