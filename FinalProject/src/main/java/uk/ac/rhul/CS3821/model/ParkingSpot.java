package uk.ac.rhul.CS3821.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "parking_spots")
public class ParkingSpot {

    @Id
    @GeneratedValue
    @Column(name = "spot_id", updatable = false, nullable = false)
    private UUID spotId;

    @Column(name = "spot_name", nullable = false, length = 100)
    private String spotName;

    @Column(name = "spot_description")
    private String spotDescription;

    @Column(name = "is_reserved", nullable = false)
    private boolean isReserved;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    // Constructors
    public ParkingSpot() {}

    public ParkingSpot(String spotName, String spotDescription, boolean isReserved) {
        this.spotName = spotName;
        this.spotDescription = spotDescription;
        this.isReserved = isReserved;
    }