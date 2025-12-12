package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import uk.ac.rhul.CS3821.FinalProjectApplication;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = FinalProjectApplication.class)
@AutoConfigureMockMvc(addFilters = false)
public class TrainControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void greaterAngliaEndpointReturnsTrainServices() throws Exception {
        mockMvc.perform(get("/api/trains/greater-anglia").param("station", "LST"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trainServices").isArray())
                .andExpect(jsonPath("$.trainServices[0].operator").value("Greater Anglia"))
                .andExpect(jsonPath("$.trainServices[1].etd").value("Delayed"));
    }
}
