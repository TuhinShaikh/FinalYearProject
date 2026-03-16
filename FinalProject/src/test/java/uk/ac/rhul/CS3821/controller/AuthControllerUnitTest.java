package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import uk.ac.rhul.CS3821.dto.AccessTokenResponse;
import uk.ac.rhul.CS3821.dto.LoginRequest;
import uk.ac.rhul.CS3821.dto.RegisterRequest;
import uk.ac.rhul.CS3821.service.AuthService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerUnitTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController controller;

    @Test
    void registerDelegatesToService() {
        RegisterRequest request = new RegisterRequest("Jane", "jane@example.com", "pw");
        AccessTokenResponse token = new AccessTokenResponse("tkn");
        when(authService.register(request)).thenReturn(token);

        ResponseEntity<AccessTokenResponse> response = controller.register(request);

        assertThat(response.getBody()).isSameAs(token);
    }

    @Test
    void loginDelegatesToService() {
        LoginRequest request = new LoginRequest("jane@example.com", "pw");
        AccessTokenResponse token = new AccessTokenResponse("tkn");
        when(authService.login(request)).thenReturn(token);

        ResponseEntity<AccessTokenResponse> response = controller.login(request);

        assertThat(response.getBody()).isSameAs(token);
    }
}
