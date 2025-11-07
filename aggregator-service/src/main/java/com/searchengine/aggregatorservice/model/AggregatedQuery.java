package com.searchengine.aggregatorservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "aggregated_query")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AggregatedQuery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String query;

    private Long frequency;

    private LocalDateTime lastUpdated;
}
