package com.searchengine.analyticslogs.service;


import com.searchengine.analyticslogs.model.Query;
import com.searchengine.analyticslogs.repository.QueryRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QueryService {
    private final QueryRepository queryRepository;

    public QueryService(QueryRepository queryRepository) {
        this.queryRepository = queryRepository;
    }

    public Query createQuery(Query query){
        return queryRepository.save(query);
    }

    public List<Query> getAllQueries(){
        return queryRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    public Boolean deleteQueryById(Long id){
        if(queryRepository.existsById(id)){
            queryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}