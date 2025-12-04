package uk.ac.rhul.CS3821.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.nio.charset.StandardCharsets;

@Component
public class JwtUtil {

    private final Key key;
    private final long accessTokenValidityMs;
    private final long refreshTokenValidityMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.accessTokenValidityMs:900000}") long accessTokenValidityMs,   // default 15 min
            @Value("${jwt.refreshTokenValidityMs:604800000}") long refreshTokenValidityMs // default 7 days
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenValidityMs = accessTokenValidityMs;
        this.refreshTokenValidityMs = refreshTokenValidityMs;
    }

    /** Generate an access token for a given subject (username or userId). */
    public String generateAccessToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenValidityMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /** Generate a refresh token for a given subject. */
    public String generateRefreshToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenValidityMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /** Extract claims from a token. */
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /** Validate token against subject and expiry. */
    public boolean validateToken(String token, String subject) {
        Claims claims = extractClaims(token);
        return claims.getSubject().equals(subject) && claims.getExpiration().after(new Date());
    }

    public String generateToken(String subject) {
        return generateAccessToken(subject);
    }
}