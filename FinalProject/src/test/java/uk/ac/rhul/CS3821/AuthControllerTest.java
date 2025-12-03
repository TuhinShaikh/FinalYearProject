package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import uk.ac.rhul.CS3821.dto.AccessTokenResponse;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.service.AuthService;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    void testRegisterReturnsAccessToken() throws Exception {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");

        when(authService.register(user)).thenReturn(new AccessTokenResponse("mockToken"));

        mockMvc.perform(post("/auth/register")
                .contentType("application/json")
                .content("{\"username\":\"testuser\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mockToken"));
    }

    @Test
    void testLoginReturnsAccessToken() throws Exception {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");

        when(authService.login(user)).thenReturn(new AccessTokenResponse("mockToken"));

        mockMvc.perform(post("/auth/login")
                .contentType("application/json")
                .content("{\"username\":\"testuser\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mockToken"));
    }
}