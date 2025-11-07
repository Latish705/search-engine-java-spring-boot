package com.searchengine.aggregatorservice.repository;

import com.searchengine.aggregatorservice.model.AggregatedQuery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AggregatedQueryRepository extends JpaRepository<AggregatedQuery,Long> {
    Optional<AggregatedQuery> findByQuery(String query);
}
