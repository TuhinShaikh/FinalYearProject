package uk.ac.rhul.CS3821.repository;

import uk.ac.rhul.CS3821.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

// Handles persistence for user accounts and exposes helpers used during auth flows
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByIsDisabled(boolean isDisabled);

}