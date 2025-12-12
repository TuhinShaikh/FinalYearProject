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
public class TravelControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void planRouteReturnsExpectedNodes() throws Exception {
        mockMvc.perform(get("/api/travel/route")
                .param("start", "STADIUM")
                .param("goal", "MILTON_KEYNES"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nodes[0]").value("STADIUM"))
            .andExpect(jsonPath("$.nodes[1]").value("SEVEN_SISTERS"))
            .andExpect(jsonPath("$.nodes.length()").value(3))
            .andExpect(jsonPath("$.totalCostMinutes").isNumber())
            .andExpect(jsonPath("$.algorithm").value("DIJKSTRA"));
    }
}
