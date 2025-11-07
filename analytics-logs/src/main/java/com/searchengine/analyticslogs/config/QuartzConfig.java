package com.searchengine.analyticslogs.config;

import com.searchengine.analyticslogs.job.QuerySchedulerJob;
import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail queryJobDetail() {
        return JobBuilder.newJob(QuerySchedulerJob.class)
                .withIdentity("queryJob")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger queryJobTrigger(JobDetail queryJobDetail) {
        return TriggerBuilder.newTrigger()
                .forJob(queryJobDetail)
                .withIdentity("queryTrigger")
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withIntervalInMinutes(5)  // Runs every 5 minutes
                        .repeatForever())
                .build();
    }
}
