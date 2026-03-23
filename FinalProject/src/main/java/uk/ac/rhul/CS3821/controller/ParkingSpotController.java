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

/**
 * REST controller exposing CRUD endpoints for parking spots.
 */
@RestController
@RequestMapping("/spots")
public class ParkingSpotController {

    private final ParkingSpotService parkingSpotService;

    public ParkingSpotController(ParkingSpotService parkingSpotService) {
        this.parkingSpotService = parkingSpotService;
    }

    /**
     * Creates a parking spot.
     *
     * @param spot spot payload
     * @return saved spot
     */
    @PostMapping
    public ResponseEntity<ParkingSpot> createSpot(@RequestBody ParkingSpot spot) {
        return ResponseEntity.ok(parkingSpotService.createSpot(spot));
    }

    /**
     * Retrieves a parking spot by id.
     *
     * @param id spot identifier
     * @return spot if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<ParkingSpot> getSpotById(@PathVariable UUID id) {
        Optional<ParkingSpot> spot = parkingSpotService.getSpotById(id);
        return spot.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrieves all parking spots.
     *
     * @return list of parking spots
     */
    @GetMapping
    public ResponseEntity<List<ParkingSpot>> getAllSpots() {
        return ResponseEntity.ok(parkingSpotService.getAllSpots());
    }

    /**
     * Updates an existing parking spot.
     *
     * @param id spot identifier
     * @param updatedSpot updated payload
     * @return saved spot
     */
    @PutMapping("/{id}")
    public ResponseEntity<ParkingSpot> updateSpot(@PathVariable UUID id, @RequestBody ParkingSpot updatedSpot) {
        updatedSpot.setSpotId(id);
        return ResponseEntity.ok(parkingSpotService.updateSpot(updatedSpot));
    }

    /**
     * Deletes a parking spot by id.
     *
     * @param id spot identifier
     * @return empty response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpot(@PathVariable UUID id) {
        parkingSpotService.deleteSpot(id);
        return ResponseEntity.noContent().build();
    }
}