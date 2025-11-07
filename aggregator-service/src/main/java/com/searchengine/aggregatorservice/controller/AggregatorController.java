package com.searchengine.aggregatorservice.controller;


import com.searchengine.aggregatorservice.service.AggregatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/aggregate")
@RequiredArgsConstructor
public class AggregatorController {

    private final AggregatorService aggregatorService;

    @PostMapping("/run")
    public ResponseEntity<String> runAggregation() {
        aggregatorService.aggregateQuery();
        return ResponseEntity.ok("Aggregation job executed.");
    }
}

