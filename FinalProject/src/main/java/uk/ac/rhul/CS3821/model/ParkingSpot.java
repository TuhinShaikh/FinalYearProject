package uk.ac.rhul.CS3821.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "parking_spots")
// I keep each parking spot as an entity so the UI always reflects live availability.
public class ParkingSpot {

    @Id
    @GeneratedValue
    @Column(name = "spot_id", updatable = false, nullable = false)
    private UUID spotId;

    @Column(name = "spot_name", nullable = false, length = 100)
    // I store a friendly slot name so users can identify spaces quickly.
    private String spotName;

    @Column(name = "spot_description")
    private String spotDescription;

    @Column(name = "is_reserved", nullable = false)
    // I keep this flag so availability checks stay simple and fast.
    private boolean isReserved;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    // I keep both constructors for JPA and for explicit setup in service logic/tests.
    public ParkingSpot() {}

    public ParkingSpot(String spotName, String spotDescription, boolean isReserved) {
        this.spotName = spotName;
        this.spotDescription = spotDescription;
        this.isReserved = isReserved;
    }

    // I expose standard accessors because this entity is mapped across layers.
    public UUID getSpotId() { return spotId; }
    public void setSpotId(UUID spotId) { this.spotId = spotId; }

    public String getSpotName() { return spotName; }
    public void setSpotName(String spotName) { this.spotName = spotName; }

    public String getSpotDescription() { return spotDescription; }
    public void setSpotDescription(String spotDescription) { this.spotDescription = spotDescription; }

    public boolean isReserved() { return isReserved; }
    public void setReserved(boolean reserved) { isReserved = reserved; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}