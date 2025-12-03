package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TravelPlannerService {

    public List<Map<String, Object>> getRecommendations(String origin, String destination, boolean accessibilityNeeded, boolean badWeather) {
        List<Map<String, Object>> options = new ArrayList<>();

        options.add(Map.of(
                "mode", "Tube",
                "provider", "TfL",
                "estimatedTime", 25,
                "cost", 3.50,
                "recommended", !badWeather
        ));
