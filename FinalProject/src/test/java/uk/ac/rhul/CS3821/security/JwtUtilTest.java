package uk.ac.rhul.CS3821.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTest {

    @Test
    void generateAndValidateAccessToken() {
        String secret = "01234567890123456789012345678901";
        JwtUtil jwtUtil = new JwtUtil(secret, 60000L, 120000L);

        String token = jwtUtil.generateAccessToken("user-1");
        Claims claims = jwtUtil.extractClaims(token);

        assertThat(claims.getSubject()).isEqualTo("user-1");
        assertThat(jwtUtil.validateToken(token, "user-1")).isTrue();
    }

    @Test
    void generateTokenDelegatesToAccessToken() {
        String secret = "01234567890123456789012345678901";
        JwtUtil jwtUtil = new JwtUtil(secret, 60000L, 120000L);

        String token = jwtUtil.generateToken("user-2");

        assertThat(jwtUtil.extractClaims(token).getSubject()).isEqualTo("user-2");
    }
}
