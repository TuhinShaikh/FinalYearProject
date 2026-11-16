package uk.ac.rhul.CS3821;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;

class FinalProjectApplicationMainTest {

    @Test
    void mainDelegatesToSpringApplicationRun() {
        ConfigurableApplicationContext context = mock(ConfigurableApplicationContext.class);

        try (MockedStatic<SpringApplication> springApplication = mockStatic(SpringApplication.class)) {
            springApplication.when(() -> SpringApplication.run(eq(FinalProjectApplication.class), any(String[].class)))
                    .thenReturn(context);

            String[] args = {"--test=true"};
            FinalProjectApplication.main(args);

            springApplication.verify(() -> SpringApplication.run(FinalProjectApplication.class, args));
        }
    }
}
