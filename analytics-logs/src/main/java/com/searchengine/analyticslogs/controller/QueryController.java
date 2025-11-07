package com.searchengine.analyticslogs.controller;


import com.searchengine.analyticslogs.model.Query;
import com.searchengine.analyticslogs.service.QueryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/queries")
public class QueryController {

    private final QueryService queryService;
    public QueryController(QueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping
    public List<Query> getQueries(){
        return queryService.getAllQueries();
    }

    @PostMapping
    public void saveQuery(@RequestBody Query query){
        queryService.createQuery(query);

    }

    @DeleteMapping("/{id}")
    public Boolean deleteQuery(@PathVariable Long id){
        return queryService.deleteQueryById(id);
    }
}
