package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.CS3821.service.TrainService;

import java.util.List;
import java.util.Map;

/**
 * REST controller exposing train-service data for travel planning screens.
 */
@RestController
@RequestMapping("/api/trains")
public class TrainController {

        private final TrainService trainService;

        public TrainController(TrainService trainService) {
                this.trainService = trainService;
        }

        /**
         * Returns live train services for a station.
         *
         * @param station station name used in response shaping
         * @return train services payload
         */
        @GetMapping("/live")
        public ResponseEntity<?> getLiveTrains(@RequestParam String station) {
                List<Map<String, Object>> services = trainService.getLiveTrains(station);
                return ResponseEntity.ok(Map.of("trainServices", services));
        }
}