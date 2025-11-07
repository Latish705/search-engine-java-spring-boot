package com.searchengine.aggregatorservice.service;

import com.searchengine.aggregatorservice.model.AggregatedQuery;
import com.searchengine.aggregatorservice.repository.AggregatedQueryRepository;
import com.searchengine.aggregatorservice.repository.QueryRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class AggregatorService {

    private final QueryRepository queryRepository;

    private final AggregatedQueryRepository aggregatedQueryRepository;

    public AggregatorService(QueryRepository queryRepository, AggregatedQueryRepository aggregatedQueryRepository) {
        this.queryRepository = queryRepository;
        this.aggregatedQueryRepository = aggregatedQueryRepository;
    }

    @Transactional
    public void aggregateQuery(){
        System.out.println("Starting Aggregator Service");

        List<Map<String,Object>> queries = queryRepository.countQueries();

        for(Map<String,Object> entry : queries){
            String query = (String) entry.get("query");
            Long freq = ((Number) entry.get("freq")).longValue();

            AggregatedQuery existing = aggregatedQueryRepository.findByQuery(query).orElse(null);

            if(existing == null){
                aggregatedQueryRepository.save(new AggregatedQuery(null,query,freq, LocalDateTime.now()));
            }else{
                existing.setFrequency(freq);
                existing.setLastUpdated(LocalDateTime.now());
                aggregatedQueryRepository.save(existing);
            }
        }

        System.out.println("Finished Aggregator Service");
    }
}
