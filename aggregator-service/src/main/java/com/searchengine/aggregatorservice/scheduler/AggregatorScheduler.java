package com.searchengine.aggregatorservice.scheduler;

import com.searchengine.aggregatorservice.service.AggregatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AggregatorScheduler {
    private final AggregatorService aggregatorService;

    @Scheduled(cron = "0 0 3 ? * SUN")
    public void runWeeklyAggregation(){
        aggregatorService.aggregateQuery();
    }
}
