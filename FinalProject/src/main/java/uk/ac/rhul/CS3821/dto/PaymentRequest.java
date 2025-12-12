package uk.ac.rhul.CS3821.dto;

// Payload that the frontend posts when charging a card (token + amount)
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