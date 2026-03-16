package uk.ac.rhul.CS3821.dto;

// I use this DTO for payment token + amount when the frontend requests a charge.
public class PaymentRequest {
    private int amountCents;
    private String sourceId;

    public PaymentRequest() {}

    public PaymentRequest(int amountCents, String sourceId) {
        this.amountCents = amountCents;
        this.sourceId = sourceId;
    }

    public int getAmountCents() {
        return amountCents;
    }

    public void setAmountCents(int amountCents) {
        this.amountCents = amountCents;
    }

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }
}