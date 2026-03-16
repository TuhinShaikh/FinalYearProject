package uk.ac.rhul.CS3821.repository;

import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import uk.ac.rhul.CS3821.model.User;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class UserRepositoryContractTest {

    @Test
    void repositoryExtendsJpaRepositoryWithExpectedTypes() {
        Type jpaType = Arrays.stream(UserRepository.class.getGenericInterfaces())
                .filter(type -> type instanceof ParameterizedType p && p.getRawType().equals(JpaRepository.class))
                .findFirst()
                .orElseThrow();

        ParameterizedType parameterizedType = (ParameterizedType) jpaType;
        assertThat(parameterizedType.getActualTypeArguments()[0]).isEqualTo(User.class);
        assertThat(parameterizedType.getActualTypeArguments()[1]).isEqualTo(UUID.class);
    }
}
