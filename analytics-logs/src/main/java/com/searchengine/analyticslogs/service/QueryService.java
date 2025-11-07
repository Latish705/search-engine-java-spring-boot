package com.searchengine.analyticslogs.service;


import com.searchengine.analyticslogs.model.Query;
import com.searchengine.analyticslogs.repository.QueryRespository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QueryService {
    private final QueryRespository queryRespository;

    public QueryService(QueryRespository queryRespository) {
        this.queryRespository = queryRespository;
    }

    public Query createQuery(Query query){
        return queryRespository.save(query);
    }

    public List<Query> getAllQueries(){
        return queryRespository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    public Boolean deleteQueryById(Long id){
        if(queryRespository.existsById(id)){
            queryRespository.deleteById(id);
            return true;
        }
        return false;
    }
}


