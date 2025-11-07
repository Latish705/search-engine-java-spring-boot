package com.searchengine.analyticslogs.repository;

import com.searchengine.analyticslogs.model.Query;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QueryRespository extends JpaRepository<Query,Long> {
}
