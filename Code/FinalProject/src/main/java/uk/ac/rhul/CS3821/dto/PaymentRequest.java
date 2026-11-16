package uk.ac.rhul.CS3821.dto;

/**
 * Payload used to request a payment against a tokenized card source.
 */
public class PaymentRequest {
    private int amountCents;
    private String sourceId;

    /**
     * Default constructor for JSON deserialization.
     */
    public PaymentRequest() {}

    /**
     * Creates a payment payload.
     *
     * @param amountCents amount in minor units (pence)
     * @param sourceId Square tokenized source identifier
     */
    public PaymentRequest(int amountCents, String sourceId) {
        this.amountCents = amountCents;
        this.sourceId = sourceId;
    }

    /**
     * @return amount in minor units (pence)
     */
    public int getAmountCents() {
        return amountCents;
    }

    /**
     * @param amountCents amount in minor units (pence)
     */
    public void setAmountCents(int amountCents) {
        this.amountCents = amountCents;
    }

    /**
     * @return tokenized payment source identifier
     */
    public String getSourceId() {
        return sourceId;
    }

    /**
     * @param sourceId tokenized payment source identifier
     */
    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }
}