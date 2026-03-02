package uk.ac.rhul.CS3821.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import uk.ac.rhul.CS3821.FinalProjectApplication;
import uk.ac.rhul.CS3821.service.GreaterAngliaService;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = FinalProjectApplication.class)
@AutoConfigureMockMvc(addFilters = false)
public class TrainControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GreaterAngliaService greaterAngliaService;

    @Test
    void greaterAngliaEndpointReturnsTrainServices() throws Exception {
        Map<String, Object> train1 = Map.of(
                "destination", List.of(Map.of("locationName", "Seven Sisters")),
                "std", "12:30",
                "etd", "On time",
                "operator", "Greater Anglia"
        );

        Map<String, Object> train2 = Map.of(
                "destination", List.of(Map.of("locationName", "Ipswich")),
                "std", "12:45",
                "etd", "Delayed",
                "operator", "Greater Anglia"
        );

        when(greaterAngliaService.fetchLiveDepartures("LST")).thenReturn(List.of(train1, train2));

        mockMvc.perform(get("/api/trains/greater-anglia").param("station", "LST"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trainServices").isArray())
                .andExpect(jsonPath("$.trainServices[0].operator").value("Greater Anglia"))
                .andExpect(jsonPath("$.trainServices[1].etd").value("Delayed"));
    }
}
