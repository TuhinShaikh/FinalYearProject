package uk.ac.rhul.CS3821.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void createUserDelegatesToRepository() {
        User user = new User();
        when(userRepository.save(user)).thenReturn(user);

        User actual = userService.createUser(user);

        assertThat(actual).isSameAs(user);
        verify(userRepository).save(user);
    }

    @Test
    void getUserByIdReturnsRepositoryResult() {
        UUID id = UUID.randomUUID();
        User user = new User();
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        Optional<User> actual = userService.getUserById(id);

        assertThat(actual).contains(user);
    }

    @Test
    void getAllUsersReturnsRepositoryResult() {
        List<User> users = List.of(new User(), new User());
        when(userRepository.findAll()).thenReturn(users);

        List<User> actual = userService.getAllUsers();

        assertThat(actual).isEqualTo(users);
    }

    @Test
    void updateUserDelegatesToRepository() {
        User user = new User();
        when(userRepository.save(user)).thenReturn(user);

        User actual = userService.updateUser(user);

        assertThat(actual).isSameAs(user);
        verify(userRepository).save(user);
    }

    @Test
    void deleteUserDelegatesToRepository() {
        UUID id = UUID.randomUUID();

        userService.deleteUser(id);

        verify(userRepository).deleteById(id);
    }
}
