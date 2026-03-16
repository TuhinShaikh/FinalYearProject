package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trains")
public class TrainController {

        @GetMapping("/live")
        public ResponseEntity<?> getLiveTrains(@RequestParam String station) {
                List<Map<String, Object>> services = List.of(
                        Map.of(
                                "destination", List.of(Map.of("locationName", "Seven Sisters")),
                                "std", "12:30",
                                "etd", "On time",
                                "operator", "National Rail"
                        ),
                        Map.of(
                                "destination", List.of(Map.of("locationName", station)),
                                "std", "12:45",
                                "etd", "Delayed",
                                "operator", "National Rail"
                        )
                );
                return ResponseEntity.ok(Map.of("trainServices", services));
        }
}