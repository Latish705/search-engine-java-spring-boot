package com.searchengine.aggregatorservice.repository;

import com.searchengine.aggregatorservice.model.Queries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface QueryRepository extends JpaRepository<Queries, Long> {
     @Query("SELECT a.query AS query, COUNT(a) AS freq FROM Queries a GROUP BY a.query")
    List<Map<String, Object>> countQueries();
}
