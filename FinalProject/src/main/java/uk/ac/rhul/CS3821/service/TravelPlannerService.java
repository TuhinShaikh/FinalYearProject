package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Generates travel recommendations combining transport modes based on user needs.
 */
@Service
public class TravelPlannerService {

        /**
         * Creates a list of mocked recommendations; currently prioritises accessibility and weather flags.
         */
        public List<Map<String, Object>> getRecommendations(String origin, String destination, boolean accessibilityNeeded, boolean badWeather) {
        List<Map<String, Object>> options = new ArrayList<>();

        options.add(Map.of(
                "mode", "Tube",
                "provider", "TfL",
                "estimatedTime", 25,
                "cost", 3.50,
                "recommended", !badWeather
        ));

        options.add(Map.of(
                "mode", "Train",
                "provider", "National Rail",
                "estimatedTime", 40,
                "cost", 7.20,
                "recommended", accessibilityNeeded
        ));

        options.add(Map.of(
                "mode", "Car",
                "provider", "Uber",
                "estimatedTime", 30,
                "cost", 15.00,
                "recommended", badWeather
        ));

        return options;
    }
}