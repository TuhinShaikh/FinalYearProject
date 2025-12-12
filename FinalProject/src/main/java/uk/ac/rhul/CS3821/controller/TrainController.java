package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

// Supplies mocked Greater Anglia departures for the journey planner and status page
@RestController
@RequestMapping("/api/trains")
public class TrainController {

        // Return simple fake departures keyed by the CRS code so the frontend can show data immediately
        @GetMapping("/greater-anglia")
        public ResponseEntity<?> getGreaterAnglia(@RequestParam String station) {

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

        Map<String, Object> response = Map.of(
                "trainServices", List.of(train1, train2)
        );

        return ResponseEntity.ok(response);
    }
}