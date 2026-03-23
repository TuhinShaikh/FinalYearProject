package uk.ac.rhul.CS3821.dto;

/**
 * Response payload representing payment processing outcome.
 */
public class PaymentResponse {
    private String transactionId;
    private String status;
    private String message;

    /**
     * @return external transaction identifier
     */
    public String getTransactionId() {
        return transactionId;
    }

    /**
     * @param transactionId external transaction identifier
     */
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    /**
     * Creates a payment response payload.
     *
     * @param transactionId external transaction identifier
     * @param status processing status
     * @param message human-readable result message
     */
    public PaymentResponse(String transactionId, String status, String message) {
        this.transactionId = transactionId;
        this.status = status;
        this.message = message;
    }

    /**
     * @return payment status
     */
    public String getStatus() {
        return status;
    }

    /**
     * @param status payment status
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * @return human-readable payment message
     */
    public String getMessage() {
        return message;
    }

    /**
     * @param message human-readable payment message
     */
    public void setMessage(String message) {
        this.message = message;
    }
}