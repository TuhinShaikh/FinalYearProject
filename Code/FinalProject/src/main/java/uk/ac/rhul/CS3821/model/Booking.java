package uk.ac.rhul.CS3821.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

// I import ParkingSpot directly because this entity links each booking to one slot.
import uk.ac.rhul.CS3821.model.ParkingSpot;

@Entity
@Table(name = "bookings")
/**
 * Persistent booking entity representing a reserved parking session.
 */
public class Booking {

    // I model one parking session per record so timing, payment, and ownership stay together.

    @Id
    @GeneratedValue
    @Column(name = "booking_id", updatable = false, nullable = false)
    private UUID bookingId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    // I keep the user relation mandatory so every booking has a clear owner.
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "spot_id", nullable = false)
    // I keep the spot relation mandatory so I can prevent double-booking the same slot.
    private ParkingSpot spot;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "status", nullable = false, length = 20)
    // I store status to track the booking lifecycle from pending to confirmed/cancelled.
    private String status;

    @Version
    @Column(name = "version_number", nullable = false)
    // I use optimistic locking so concurrent updates do not overwrite each other.
    private int versionNumber;

    @Column(name = "confirmation_code", unique = true, length = 20)
    // I keep a guest-friendly confirmation code for quick lookups and support queries.
    private String confirmationCode;

    @Column(name = "special_requirements")
    private String specialRequirements;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    /**
     * Default constructor required by JPA.
     */
    public Booking() {}

    /**
     * Creates a booking with core reservation details.
     *
     * @param user booking owner
     * @param spot reserved parking spot
     * @param bookingDate date of reservation
     * @param startTime reservation start timestamp
     * @param endTime reservation end timestamp
     * @param totalAmount total charge amount
     * @param status lifecycle status of the booking
     */
    public Booking(User user, ParkingSpot spot, LocalDate bookingDate,
                   Instant startTime, Instant endTime,
                   BigDecimal totalAmount, String status) {
        this.user = user;
        this.spot = spot;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalAmount = totalAmount;
        this.status = status;
    }

    // I use standard accessors so controllers/services can read and update fields safely.
    public UUID getBookingId() { return bookingId; }
    public void setBookingId(UUID bookingId) { this.bookingId = bookingId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ParkingSpot getSpot() { return spot; }
    public void setSpot(ParkingSpot spot) { this.spot = spot; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }

    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getVersionNumber() { return versionNumber; }
    public void setVersionNumber(int versionNumber) { this.versionNumber = versionNumber; }

    public String getConfirmationCode() { return confirmationCode; }
    public void setConfirmationCode(String confirmationCode) { this.confirmationCode = confirmationCode; }

    public String getSpecialRequirements() { return specialRequirements; }
    public void setSpecialRequirements(String specialRequirements) { this.specialRequirements = specialRequirements; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}