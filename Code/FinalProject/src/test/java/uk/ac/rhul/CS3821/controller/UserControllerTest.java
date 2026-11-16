package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uk.ac.rhul.CS3821.model.User;
import uk.ac.rhul.CS3821.service.UserService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController controller;

    @Test
    void getUserByIdReturnsNotFoundWhenAbsent() {
        UUID id = UUID.randomUUID();
        when(userService.getUserById(id)).thenReturn(Optional.empty());

        ResponseEntity<User> response = controller.getUserById(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getAllUsersReturnsData() {
        List<User> users = List.of(new User(), new User());
        when(userService.getAllUsers()).thenReturn(users);

        ResponseEntity<List<User>> response = controller.getAllUsers();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(users);
    }

    @Test
    void updateUserAppliesPathIdAndDelegates() {
        UUID id = UUID.randomUUID();
        User user = new User();
        when(userService.updateUser(user)).thenReturn(user);

        ResponseEntity<User> response = controller.updateUser(id, user);

        assertThat(user.getUserId()).isEqualTo(id);
        assertThat(response.getBody()).isSameAs(user);
        verify(userService).updateUser(user);
    }

    @Test
    void deleteUserReturnsNoContent() {
        UUID id = UUID.randomUUID();

        ResponseEntity<Void> response = controller.deleteUser(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(userService).deleteUser(id);
    }
}
