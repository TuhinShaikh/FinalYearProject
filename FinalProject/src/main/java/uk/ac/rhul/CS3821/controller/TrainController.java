package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.CS3821.service.GreaterAngliaService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trains")
public class TrainController {

        private final GreaterAngliaService greaterAngliaService;

        public TrainController(GreaterAngliaService greaterAngliaService) {
                this.greaterAngliaService = greaterAngliaService;
        }

        @GetMapping("/greater-anglia")
        public ResponseEntity<?> getGreaterAnglia(@RequestParam String station) {
                List<Map<String, Object>> services = greaterAngliaService.fetchLiveDepartures(station);
                return ResponseEntity.ok(Map.of("trainServices", services));
        }
}