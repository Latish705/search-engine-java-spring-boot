# 📈 Aggregator Service

A Spring Boot microservice that aggregates search query data to identify popular search terms and trends. This service processes raw query logs from the Analytics-Logs Service and provides valuable insights through frequency analysis and scheduled aggregation jobs.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)
![Gradle](https://img.shields.io/badge/Gradle-8.x-green)
![Quartz](https://img.shields.io/badge/Quartz-Scheduler-red)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Service](#running-the-service)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Scheduling](#scheduling)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Aggregator Service is responsible for:
- **Query Aggregation**: Counts and groups search queries by frequency
- **Trend Analysis**: Identifies popular and trending search terms
- **Scheduled Jobs**: Automatic periodic aggregation using Quartz Scheduler
- **Data Processing**: Transforms raw logs into actionable insights
- **Data Source for Workers**: Provides aggregated data for Trie building

This service acts as the analytical brain of the search engine, processing historical data to improve search suggestions and understand user behavior.

## ✨ Features

### Core Features
- 📊 **Query Aggregation**: Automatically aggregates queries from Analytics-Logs Service
- 🔄 **Frequency Analysis**: Counts how many times each query appears
- ⏰ **Scheduled Execution**: Runs aggregation jobs at configurable intervals
- 📈 **Trend Tracking**: Identifies popular searches over time
- 🗄️ **Persistent Storage**: Stores aggregated data in PostgreSQL
- 🔄 **Incremental Updates**: Updates existing aggregations efficiently

### Technical Features
- 🚀 **REST API**: Manual and automated aggregation triggers
- ⚡ **Quartz Scheduler**: Robust job scheduling framework
- 💾 **JPA/Hibernate**: ORM for database operations
- 🎯 **Spring Scheduling**: `@EnableScheduling` support
- 🔒 **Transaction Management**: Ensures data consistency
- 🔧 **Connection Pooling**: HikariCP for optimal performance
- 🌐 **CORS Support**: Full cross-origin resource sharing

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend / Client                    │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTP REST
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Aggregator Service                     │
│                      Port: 8090                         │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────┐        ┌──────────────────────┐   │
│  │   Controller   │───────▶│     Service Layer    │   │
│  │AggregatorCtrl  │        │  AggregatorService   │   │
│  └────────────────┘        └──────────────────────┘   │
│          │                            │                │
│          │                            ▼                │
│          │                  ┌──────────────────────┐   │
│          │                  │   Repository Layer   │   │
│          │                  │AggregatedQueryRepo   │   │
│          │                  └──────────────────────┘   │
│          │                            │                │
│  ┌────────────────┐                  │                │
│  │ Quartz Scheduler│                 │                │
│  │  - CronTrigger  │                 │                │
│  │  - JobDetail    │                 │                │
│  └────────────────┘                  │                │
│          │                            │                │
│          └────────────────────────────┘                │
└─────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │  PostgreSQL DB   │        │  PostgreSQL DB   │
    │ aggregated_query │        │  queries (read)  │
    │   (write/read)   │        │  Analytics Logs  │
    └──────────────────┘        └──────────────────┘
```

### Data Flow

1. **Manual Trigger** (via REST API)
   ```
   POST /aggregate/run → Service → Aggregate → Database
   ```

2. **Scheduled Trigger** (via Quartz)
   ```
   Cron Schedule → Job → Service → Aggregate → Database
   ```

3. **Data Retrieval**
   ```
   GET /aggregate/data → Repository → Return Results
   ```

## 🛠️ Technology Stack

### Core Technologies
- **Java**: 17 LTS
- **Spring Boot**: 3.x
- **Spring Data JPA**: Database abstraction
- **Spring Scheduling**: `@EnableScheduling`
- **Quartz Scheduler**: 2.3.x (Advanced scheduling)
- **Hibernate**: ORM framework
- **PostgreSQL**: 15+ (Database)
- **Gradle**: 8.x (Build tool)

### Dependencies

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-quartz'
    compileOnly 'org.projectlombok:lombok'
    runtimeOnly 'org.postgresql:postgresql'
    annotationProcessor 'org.projectlombok:lombok'
}
```

### Key Features
- `@EnableScheduling`: Activates scheduling support
- `@Scheduled`: Method-level scheduling annotations
- Quartz Job Store: In-memory job storage
- Connection Pooling: HikariCP
- Transaction Management: Spring `@Transactional`

## 📁 Project Structure

```
aggregator-service/
├── src/
│   ├── main/
│   │   ├── java/com/searchengine/aggregatorservice/
│   │   │   ├── config/
│   │   │   │   └── CorsConfig.java              # CORS configuration
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   └── AggregatorController.java    # REST endpoints
│   │   │   │
│   │   │   ├── model/
│   │   │   │   └── AggregatedQuery.java         # JPA entity
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   └── AggregatedQueryRepository.java # Data access
│   │   │   │
│   │   │   ├── service/
│   │   │   │   └── AggregatorService.java       # Business logic
│   │   │   │
│   │   │   └── AggregatorServiceApplication.java # Main class
│   │   │
│   │   └── resources/
│   │       ├── application.properties            # Configuration
│   │       ├── static/                          # Static resources
│   │       └── templates/                       # Templates
│   │
│   └── test/
│       └── java/com/searchengine/aggregatorservice/
│           └── AggregatorServiceApplicationTests.java
│
├── build.gradle                                  # Build configuration
├── gradlew                                       # Gradle wrapper (Unix)
├── gradlew.bat                                   # Gradle wrapper (Windows)
├── settings.gradle                               # Project settings
└── README.md                                     # This file
```

## 📋 Prerequisites

- **Java Development Kit (JDK) 17 or higher**
- **PostgreSQL 15 or higher**
- **Gradle 8.x** (or use the included wrapper)
- **Analytics-Logs Service** (must be running and have data)
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code recommended)

## 🚀 Installation

### 1. Navigate to Project Directory

```bash
cd aggregator-service
```

### 2. Database Setup

The Aggregator Service uses the same PostgreSQL database as the Analytics-Logs Service.

```bash
# Connect to PostgreSQL
psql postgres

# Use existing database
\c my_dbs

# The aggregated_query table will be auto-created by JPA

# Exit
\q
```

### 3. Install Dependencies

```bash
# Using Gradle wrapper (recommended)
./gradlew build

# Or using system Gradle
gradle build
```

## ⚙️ Configuration

### application.properties

Location: `src/main/resources/application.properties`

```properties
# Application Name
spring.application.name=aggregator-service

# Server Port
server.port=8090

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/my_dbs
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# HikariCP Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000

# Quartz Configuration
spring.quartz.job-store-type=memory
spring.quartz.properties.org.quartz.threadPool.threadCount=5
spring.quartz.auto-startup=true
spring.quartz.overwrite-existing-jobs=true

# Logging
logging.level.com.searchengine.aggregatorservice=INFO
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.quartz=INFO
```

### Configuration Options Explained

| Property | Description | Default |
|----------|-------------|---------|
| `server.port` | Service port | 8090 |
| `spring.datasource.url` | PostgreSQL connection URL | localhost:5432 |
| `spring.jpa.hibernate.ddl-auto` | Schema generation strategy | update |
| `spring.quartz.job-store-type` | Job storage (memory/jdbc) | memory |
| `spring.quartz.auto-startup` | Auto-start scheduler | true |

### Quartz Scheduler Configuration

The service uses Quartz for advanced scheduling capabilities:

- **Job Store**: In-memory (can be changed to JDBC for persistence)
- **Thread Pool**: 5 threads for concurrent job execution
- **Auto-startup**: Scheduler starts automatically with application
- **Job Overwrite**: New jobs overwrite existing ones

## 🏃 Running the Service

### Prerequisites Check

Ensure Analytics-Logs Service is running:
```bash
curl http://localhost:8080/api/queries
```

### Option 1: Using Gradle Wrapper (Recommended)

```bash
# Development mode
./gradlew bootRun

# With specific profile
./gradlew bootRun --args='--spring.profiles.active=dev'
```

### Option 2: Using JAR

```bash
# Build JAR
./gradlew clean build

# Run JAR
java -jar build/libs/aggregator-service-0.0.1-SNAPSHOT.jar
```

### Option 3: Using IDE

1. Open project in IntelliJ IDEA / Eclipse
2. Navigate to `AggregatorServiceApplication.java`
3. Click Run button or press `Shift + F10`

### Verify Service is Running

```bash
# Check service health
curl http://localhost:8090/aggregate/data

# Or open in browser
open http://localhost:8090/aggregate/data
```

## 📚 API Documentation

### Base URL
```
http://localhost:8090
```

### Endpoints

#### 1. Run Aggregation Job

**Description**: Manually trigger the aggregation process to analyze queries from the Analytics-Logs Service.

**Request:**
```http
POST /aggregate/run
```

**Response:** `200 OK`
```
Aggregation job executed.
```

**Process:**
1. Fetches all queries from Analytics-Logs database
2. Groups queries by text
3. Counts frequency of each query
4. Updates or inserts aggregated data
5. Updates timestamps

**cURL Example:**
```bash
curl -X POST http://localhost:8090/aggregate/run
```

**Response Time**: Typically 100-500ms depending on data size

---

#### 2. Get Aggregated Data

**Description**: Retrieve all aggregated queries with their frequencies.

**Request:**
```http
GET /aggregate/data
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "query": "spring boot tutorial",
    "frequency": 15,
    "lastUpdated": "2025-11-08T10:30:00.123456"
  },
  {
    "id": 2,
    "query": "java microservices",
    "frequency": 10,
    "lastUpdated": "2025-11-08T10:30:00.123456"
  },
  {
    "id": 3,
    "query": "rest api design",
    "frequency": 8,
    "lastUpdated": "2025-11-08T10:30:00.123456"
  }
]
```

**Sorting**: Results are sorted by frequency (descending) by default

**cURL Example:**
```bash
curl -X GET http://localhost:8090/aggregate/data
```

**Use Cases:**
- Display popular searches on frontend
- Feed data to Workers Service for Trie building
- Analytics dashboards
- Trending searches analysis

---

### Error Responses

#### 500 Internal Server Error
```json
{
  "error": "Aggregation failed",
  "message": "Unable to connect to Analytics-Logs database"
}
```

#### 503 Service Unavailable
```json
{
  "error": "Service unavailable",
  "message": "Analytics-Logs Service is not responding"
}
```

## 🗄️ Database Schema

### aggregated_query Table

```sql
CREATE TABLE aggregated_query (
    id BIGSERIAL PRIMARY KEY,
    query VARCHAR(255) NOT NULL UNIQUE,
    frequency BIGINT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP(6) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_aggregated_query_frequency ON aggregated_query(frequency DESC);
CREATE INDEX idx_aggregated_query_query ON aggregated_query(query);
CREATE INDEX idx_aggregated_query_updated ON aggregated_query(last_updated DESC);
```

### Field Descriptions

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing identifier |
| `query` | VARCHAR(255) | NOT NULL, UNIQUE | The search query text |
| `frequency` | BIGINT | NOT NULL | How many times query appears |
| `last_updated` | TIMESTAMP(6) | NOT NULL | Last aggregation time |

### Sample Data

```sql
INSERT INTO aggregated_query (query, frequency, last_updated) VALUES
  ('spring boot tutorial', 15, NOW()),
  ('java microservices', 10, NOW()),
  ('rest api design', 8, NOW()),
  ('docker tutorial', 5, NOW());
```

### Aggregation Logic

The aggregation process:

```sql
-- Conceptual SQL (actual implementation in Java)
INSERT INTO aggregated_query (query, frequency, last_updated)
SELECT 
    query,
    COUNT(*) as frequency,
    NOW() as last_updated
FROM queries
GROUP BY query
ON CONFLICT (query) 
DO UPDATE SET 
    frequency = aggregated_query.frequency + EXCLUDED.frequency,
    last_updated = NOW();
```

### Useful SQL Queries

```sql
-- Get top 10 most popular searches
SELECT * FROM aggregated_query 
ORDER BY frequency DESC 
LIMIT 10;

-- Get recently updated aggregations
SELECT * FROM aggregated_query 
ORDER BY last_updated DESC 
LIMIT 10;

-- Get searches with frequency > 5
SELECT * FROM aggregated_query 
WHERE frequency > 5
ORDER BY frequency DESC;

-- Get total number of unique queries
SELECT COUNT(DISTINCT query) FROM aggregated_query;

-- Get total search volume
SELECT SUM(frequency) FROM aggregated_query;

-- Get average frequency
SELECT AVG(frequency) FROM aggregated_query;
```

## ⏰ Scheduling

### Scheduled Jobs

The service can run aggregation jobs automatically at configured intervals.

#### Using Spring @Scheduled

Add to `AggregatorService`:

```java
import org.springframework.scheduling.annotation.Scheduled;

@Service
public class AggregatorService {
    
    // Run every hour
    @Scheduled(cron = "0 0 * * * *")
    public void scheduledAggregation() {
        aggregateQuery();
    }
    
    // Run every 30 minutes
    @Scheduled(fixedRate = 1800000)
    public void periodicAggregation() {
        aggregateQuery();
    }
}
```

#### Using Quartz Scheduler

More advanced scheduling with Quartz:

```java
import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuartzConfig {
    
    @Bean
    public JobDetail aggregationJobDetail() {
        return JobBuilder.newJob(AggregationJob.class)
            .withIdentity("aggregationJob")
            .storeDurably()
            .build();
    }
    
    @Bean
    public Trigger aggregationTrigger() {
        // Run every day at 2 AM
        return TriggerBuilder.newTrigger()
            .forJob(aggregationJobDetail())
            .withIdentity("aggregationTrigger")
            .withSchedule(
                CronScheduleBuilder.cronSchedule("0 0 2 * * ?")
            )
            .build();
    }
}
```

### Cron Expression Examples

| Expression | Description |
|------------|-------------|
| `0 0 * * * *` | Every hour |
| `0 */30 * * * *` | Every 30 minutes |
| `0 0 2 * * ?` | Every day at 2 AM |
| `0 0 12 * * MON-FRI` | Weekdays at noon |
| `0 0 0 1 * ?` | First day of month |

## 🧪 Testing

### Manual Testing

#### 1. Create Test Data in Analytics-Logs

```bash
# Add some queries
for i in {1..5}; do
  curl -X POST http://localhost:8080/api/queries \
    -H "Content-Type: application/json" \
    -d '{"query":"spring boot"}'
done

for i in {1..3}; do
  curl -X POST http://localhost:8080/api/queries \
    -H "Content-Type: application/json" \
    -d '{"query":"java tutorial"}'
done
```

#### 2. Run Aggregation

```bash
curl -X POST http://localhost:8090/aggregate/run
```

#### 3. Verify Results

```bash
curl http://localhost:8090/aggregate/data
```

Expected output:
```json
[
  {
    "id": 1,
    "query": "spring boot",
    "frequency": 5,
    "lastUpdated": "2025-11-08T10:30:00"
  },
  {
    "id": 2,
    "query": "java tutorial",
    "frequency": 3,
    "lastUpdated": "2025-11-08T10:30:00"
  }
]
```

### Integration Testing

```bash
# Run all tests
./gradlew test

# Run with coverage
./gradlew test jacocoTestReport
```

### Performance Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:8090/aggregate/data

# Using hey
hey -n 1000 -c 10 http://localhost:8090/aggregate/data
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port 8090 Already in Use

**Error:**
```
Web server failed to start. Port 8090 was already in use.
```

**Solution:**
```bash
# Find and kill process
lsof -ti:8090 | xargs kill -9

# Or change port
server.port=8091
```

#### 2. Cannot Connect to Analytics-Logs Database

**Error:**
```
Unable to fetch queries from Analytics-Logs Service
```

**Solutions:**
- Ensure Analytics-Logs Service is running on port 8080
- Verify database connection settings match Analytics-Logs
- Check both services use the same database

#### 3. No Data to Aggregate

**Error:**
```
Aggregation completed but no data found
```

**Solution:**
```bash
# Add test data to Analytics-Logs
curl -X POST http://localhost:8080/api/queries \
  -H "Content-Type: application/json" \
  -d '{"query":"test"}'
```

#### 4. Quartz Scheduler Not Starting

**Error:**
```
Quartz Scheduler failed to start
```

**Solution:**
Check `application.properties`:
```properties
spring.quartz.auto-startup=true
spring.quartz.job-store-type=memory
```

#### 5. Duplicate Key Error

**Error:**
```
ERROR: duplicate key value violates unique constraint "aggregated_query_query_key"
```

**This is expected behavior** - the aggregation uses `ON CONFLICT` to update existing records.

## 📊 Performance Optimization

### Database Optimization

```sql
-- Add composite index for common queries
CREATE INDEX idx_aggregated_query_freq_updated 
ON aggregated_query(frequency DESC, last_updated DESC);

-- Analyze table for query planner
ANALYZE aggregated_query;

-- Vacuum to reclaim storage
VACUUM ANALYZE aggregated_query;
```

### Service Optimization

```properties
# Increase connection pool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10

# Enable batch processing
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
```

### Caching (Optional)

```java
@Service
@EnableCaching
public class AggregatorService {
    
    @Cacheable(value = "aggregatedQueries", unless = "#result.isEmpty()")
    public List<AggregatedQuery> getQueries() {
        return repository.findAll();
    }
}
```

## 📈 Monitoring

### Actuator Endpoints

Add to `build.gradle`:
```groovy
implementation 'org.springframework.boot:spring-boot-starter-actuator'
```

Access:
- Health: `http://localhost:8090/actuator/health`
- Metrics: `http://localhost:8090/actuator/metrics`
- Scheduled Tasks: `http://localhost:8090/actuator/scheduledtasks`

### Custom Metrics

```java
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;

@Service
public class AggregatorService {
    private final Counter aggregationCounter;
    
    public AggregatorService(MeterRegistry registry) {
        this.aggregationCounter = registry.counter("aggregation.runs");
    }
    
    public void aggregateQuery() {
        aggregationCounter.increment();
        // ... aggregation logic
    }
}
```

## 🚀 Deployment

### Production Configuration

```properties
# Disable SQL logging
spring.jpa.show-sql=false

# Use JDBC job store for persistence
spring.quartz.job-store-type=jdbc

# Production database pool
spring.datasource.hikari.maximum-pool-size=50
```

### Docker Support

Create `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY build/libs/aggregator-service-*.jar app.jar
EXPOSE 8090
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:
```bash
./gradlew build
docker build -t aggregator-service .
docker run -p 8090:8090 aggregator-service
```

## 📝 Best Practices

1. **Run Aggregation During Off-Peak Hours**: Schedule for low-traffic periods
2. **Monitor Performance**: Track aggregation execution time
3. **Regular Cleanup**: Archive old data periodically
4. **Index Maintenance**: Regular VACUUM and ANALYZE
5. **Connection Pool Tuning**: Adjust based on load

## 🔒 Security

- [ ] Add authentication for aggregation trigger
- [ ] Implement rate limiting on endpoints
- [ ] Use environment variables for credentials
- [ ] Enable HTTPS in production
- [ ] Add input validation
- [ ] Implement audit logging

## 📝 License

This service is part of the Search Engine project, licensed under MIT License.

---

**Service Status**: ✅ Production Ready

**Last Updated**: November 8, 2025
