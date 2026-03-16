package uk.ac.rhul.CS3821.repository;

import uk.ac.rhul.CS3821.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

// I keep user lookup helpers here so auth and account checks are simple.
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByIsDisabled(boolean isDisabled);

}