package uk.ac.rhul.CS3821.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.nio.charset.StandardCharsets;

/**
 * Utility component for issuing and validating JWT tokens.
 */
@Component
public class JwtUtil {

    private final Key key;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    /**
     * Creates the JWT utility with signing key and token lifetimes.
     *
     * @param secret HMAC secret key material
     * @param accessTokenExpiration access-token lifetime in milliseconds
     * @param refreshTokenExpiration refresh-token lifetime in milliseconds
     */
    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.accessToken.expiration}") long accessTokenExpiration,
            @Value("${jwt.refreshToken.expiration}") long refreshTokenExpiration
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    /**
     * Generates an access token for a subject.
     *
     * @param subject token subject (typically user id)
     * @return signed access token
     */
    public String generateAccessToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Generates a refresh token for a subject.
     *
     * @param subject token subject (typically user id)
     * @return signed refresh token
     */
    public String generateRefreshToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extracts claims from a signed token.
     *
     * @param token signed JWT
     * @return parsed claims payload
     */
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Validates token signature, expiry, and subject.
     *
     * @param token signed JWT
     * @param subject expected subject value
     * @return true if token is valid for the subject
     */
    public boolean validateToken(String token, String subject) {
        try {
            Claims claims = extractClaims(token);
            return claims.getSubject().equals(subject)
                    && claims.getExpiration().after(new Date());
        } catch (ExpiredJwtException ex) {
            return false;
        }
    }

    /**
     * Backward-compatible alias for access-token generation.
     *
     * @param subject token subject
     * @return signed access token
     */
    public String generateToken(String subject) {
        return generateAccessToken(subject);
    }
}