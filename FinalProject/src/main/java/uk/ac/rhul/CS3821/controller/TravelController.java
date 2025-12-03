package uk.ac.rhul.CS3821.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.CS3821.service.TravelPlannerService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/travel")
public class TravelController {

    private final TravelPlannerService travelPlannerService;

    public TravelController(TravelPlannerService travelPlannerService) {
        this.travelPlannerService = travelPlannerService;
    }

