package uk.ac.rhul.CS3821.service;

import com.squareup.square.SquareClient;
import com.squareup.square.api.LocationsApi;
import com.squareup.square.api.PaymentsApi;
import com.squareup.square.api.RefundsApi;
import com.squareup.square.models.CreatePaymentRequest;
import com.squareup.square.models.CreatePaymentResponse;
import com.squareup.square.models.ListLocationsResponse;
import com.squareup.square.models.Location;
import com.squareup.square.models.RefundPaymentRequest;
import com.squareup.square.models.RefundPaymentResponse;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PaymentServiceTest {

    @Test
    void constructorSupportsProductionEnvironmentBranch() {
        PaymentService service = new PaymentService("token", "production");

        assertThat(service).isNotNull();
        assertThat(ReflectionTestUtils.getField(service, "squareClient")).isNotNull();
    }

    @Test
    void getLocationIdReturnsCachedLocationWhenPresent() throws Exception {
        PaymentService service = new PaymentService("token", "sandbox");
        ReflectionTestUtils.setField(service, "cachedLocationId", "LOC-123");

        String locationId = service.getLocationId();

        assertThat(locationId).isEqualTo("LOC-123");
    }

    @Test
    void createPaymentBuildsRequestAndDelegatesToSquareApi() throws Exception {
        PaymentService service = new PaymentService("token", "sandbox");
        SquareClient squareClient = mock(SquareClient.class);
        PaymentsApi paymentsApi = mock(PaymentsApi.class);
        CreatePaymentResponse response = mock(CreatePaymentResponse.class);

        when(squareClient.getPaymentsApi()).thenReturn(paymentsApi);
        when(paymentsApi.createPayment(org.mockito.ArgumentMatchers.any(CreatePaymentRequest.class)))
                .thenReturn(response);

        ReflectionTestUtils.setField(service, "squareClient", squareClient);

        CreatePaymentResponse actual = service.createPayment(1500, "src-token");

        assertThat(actual).isSameAs(response);
        ArgumentCaptor<CreatePaymentRequest> captor = ArgumentCaptor.forClass(CreatePaymentRequest.class);
        verify(paymentsApi).createPayment(captor.capture());
        assertThat(captor.getValue().getSourceId()).isEqualTo("src-token");
        assertThat(captor.getValue().getAmountMoney()).isNotNull();
        assertThat(captor.getValue().getAmountMoney().getAmount()).isEqualTo(1500L);
        assertThat(captor.getValue().getAmountMoney().getCurrency()).isEqualTo("GBP");
    }

    @Test
    void refundPaymentBuildsRequestAndDelegatesToSquareApi() throws Exception {
        PaymentService service = new PaymentService("token", "sandbox");
        SquareClient squareClient = mock(SquareClient.class);
        RefundsApi refundsApi = mock(RefundsApi.class);
        RefundPaymentResponse response = mock(RefundPaymentResponse.class);

        when(squareClient.getRefundsApi()).thenReturn(refundsApi);
        when(refundsApi.refundPayment(org.mockito.ArgumentMatchers.any(RefundPaymentRequest.class)))
                .thenReturn(response);

        ReflectionTestUtils.setField(service, "squareClient", squareClient);

        RefundPaymentResponse actual = service.refundPayment("pay-123", 500);

        assertThat(actual).isSameAs(response);
        ArgumentCaptor<RefundPaymentRequest> captor = ArgumentCaptor.forClass(RefundPaymentRequest.class);
        verify(refundsApi).refundPayment(captor.capture());
        assertThat(captor.getValue().getPaymentId()).isEqualTo("pay-123");
        assertThat(captor.getValue().getAmountMoney()).isNotNull();
        assertThat(captor.getValue().getAmountMoney().getAmount()).isEqualTo(500L);
        assertThat(captor.getValue().getAmountMoney().getCurrency()).isEqualTo("GBP");
    }

    @Test
    void getLocationIdFetchesAndCachesActiveLocation() throws Exception {
        PaymentService service = new PaymentService("token", "sandbox");
        SquareClient squareClient = mock(SquareClient.class);
        LocationsApi locationsApi = mock(LocationsApi.class);
        ListLocationsResponse response = mock(ListLocationsResponse.class);
        Location inactive = mock(Location.class);
        Location active = mock(Location.class);

        when(squareClient.getLocationsApi()).thenReturn(locationsApi);
        when(locationsApi.listLocations()).thenReturn(response);
        when(response.getErrors()).thenReturn(null);
        when(response.getLocations()).thenReturn(List.of(inactive, active));
        when(inactive.getStatus()).thenReturn("INACTIVE");
        when(active.getStatus()).thenReturn("ACTIVE");
        when(inactive.getId()).thenReturn("LOC-OLD");
        when(active.getId()).thenReturn("LOC-NEW");

        ReflectionTestUtils.setField(service, "squareClient", squareClient);

        String first = service.getLocationId();
        String second = service.getLocationId();

        assertThat(first).isEqualTo("LOC-NEW");
        assertThat(second).isEqualTo("LOC-NEW");
        verify(locationsApi).listLocations();
    }

    @Test
    void getLocationIdThrowsWhenSquareReturnsErrors() throws Exception {
        PaymentService service = new PaymentService("token", "sandbox");
        SquareClient squareClient = mock(SquareClient.class);
        LocationsApi locationsApi = mock(LocationsApi.class);
        ListLocationsResponse response = mock(ListLocationsResponse.class);
        com.squareup.square.models.Error error = mock(com.squareup.square.models.Error.class);

        when(squareClient.getLocationsApi()).thenReturn(locationsApi);
        when(locationsApi.listLocations()).thenReturn(response);
        when(response.getErrors()).thenReturn(List.of(error));
        when(error.toString()).thenReturn("bad request");
        ReflectionTestUtils.setField(service, "squareClient", squareClient);

        assertThatThrownBy(service::getLocationId)
                .isInstanceOf(IOException.class)
                .hasMessageContaining("Square location lookup failed");
    }

    @Test
    void getLocationIdFallsBackToFirstLocationWhenNoActiveFound() throws Exception {
        PaymentService service = new PaymentService("token", "sandbox");
        SquareClient squareClient = mock(SquareClient.class);
        LocationsApi locationsApi = mock(LocationsApi.class);
        ListLocationsResponse response = mock(ListLocationsResponse.class);
        Location first = mock(Location.class);
        Location second = mock(Location.class);

        when(squareClient.getLocationsApi()).thenReturn(locationsApi);
        when(locationsApi.listLocations()).thenReturn(response);
        when(response.getErrors()).thenReturn(null);
        when(response.getLocations()).thenReturn(List.of(first, second));
        when(first.getStatus()).thenReturn("INACTIVE");
        when(second.getStatus()).thenReturn("INACTIVE");
        when(first.getId()).thenReturn("LOC-FIRST");
        ReflectionTestUtils.setField(service, "squareClient", squareClient);

        String locationId = service.getLocationId();

        assertThat(locationId).isEqualTo("LOC-FIRST");
    }

    @Test
    void getLocationIdReturnsNullWhenLocationsResponseIsNull() throws Exception {
        PaymentService service = new PaymentService("token", "sandbox");
        SquareClient squareClient = mock(SquareClient.class);
        LocationsApi locationsApi = mock(LocationsApi.class);
        ListLocationsResponse response = mock(ListLocationsResponse.class);

        when(squareClient.getLocationsApi()).thenReturn(locationsApi);
        when(locationsApi.listLocations()).thenReturn(response);
        when(response.getErrors()).thenReturn(null);
        when(response.getLocations()).thenReturn(null);
        ReflectionTestUtils.setField(service, "squareClient", squareClient);

        String locationId = service.getLocationId();

        assertThat(locationId).isNull();
    }
}
