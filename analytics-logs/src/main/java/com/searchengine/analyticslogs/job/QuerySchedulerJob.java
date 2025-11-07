package com.searchengine.analyticslogs.job;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.searchengine.analyticslogs.service.QueryService;

@Component
public class QuerySchedulerJob extends QuartzJobBean {

    @Autowired
    private QueryService queryService;

    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
        // Your scheduled task logic here
        queryService.getAllQueries();
    }
}
