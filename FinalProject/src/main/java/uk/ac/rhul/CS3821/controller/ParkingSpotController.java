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

// I keep spot management here so availability and admin tools share the same endpoints.
@RestController
@RequestMapping("/spots")
public class ParkingSpotController {

    private final ParkingSpotService parkingSpotService;

    public ParkingSpotController(ParkingSpotService parkingSpotService) {
        this.parkingSpotService = parkingSpotService;
    }

    // I return the created spot so the frontend can update its grid immediately.
    @PostMapping
    public ResponseEntity<ParkingSpot> createSpot(@RequestBody ParkingSpot spot) {
        return ResponseEntity.ok(parkingSpotService.createSpot(spot));
    }

    // I added single-spot lookup for details pages and edit dialogs.
    @GetMapping("/{id}")
    public ResponseEntity<ParkingSpot> getSpotById(@PathVariable UUID id) {
        Optional<ParkingSpot> spot = parkingSpotService.getSpotById(id);
        return spot.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // I expose full spot listing because the map/grid screens depend on all slots at once.
    @GetMapping
    public ResponseEntity<List<ParkingSpot>> getAllSpots() {
        return ResponseEntity.ok(parkingSpotService.getAllSpots());
    }

    // I overwrite payload id with path id to avoid accidental mismatch updates.
    @PutMapping("/{id}")
    public ResponseEntity<ParkingSpot> updateSpot(@PathVariable UUID id, @RequestBody ParkingSpot updatedSpot) {
        updatedSpot.setSpotId(id);
        return ResponseEntity.ok(parkingSpotService.updateSpot(updatedSpot));
    }

    // I return 204 for delete to keep the response lightweight.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpot(@PathVariable UUID id) {
        parkingSpotService.deleteSpot(id);
        return ResponseEntity.noContent().build();
    }
}