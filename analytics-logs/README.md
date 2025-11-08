# 📊 Analytics-Logs Service

A Spring Boot microservice that tracks and manages all search queries in the search engine system. This service acts as the primary data collector, recording every search query with timestamps for comprehensive analytics and historical tracking.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)
![Gradle](https://img.shields.io/badge/Gradle-8.x-green)

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
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Analytics-Logs Service is responsible for:
- **Recording Search Queries**: Captures every search query made by users
- **Query History**: Maintains a complete historical record with timestamps
- **CRUD Operations**: Provides endpoints for creating, reading, and deleting queries
- **Data Source**: Acts as the primary data source for the Aggregator Service
- **Real-time Logging**: Instant persistence of search queries

This service is the foundation of the search analytics pipeline, feeding data to the aggregation and suggestion systems.

## ✨ Features

### Core Features
- ✅ **Query Logging**: Automatic timestamping of all search queries
- 📝 **Query Retrieval**: Fetch all logged queries with full details
- 🗑️ **Query Deletion**: Remove individual queries by ID
- ⏰ **Automatic Timestamps**: Uses `@CreationTimestamp` for consistent timing
- 🔄 **CORS Support**: Full cross-origin resource sharing enabled
- 🔒 **Data Validation**: Input validation on query fields

### Technical Features
- 🚀 **REST API**: Clean, RESTful endpoints
- 💾 **JPA/Hibernate**: ORM for database operations
- 📊 **PostgreSQL**: Reliable relational database
- 🎯 **Lombok**: Reduced boilerplate code
- 🔧 **Auto-configuration**: Spring Boot auto-configuration
- 📈 **Connection Pooling**: HikariCP for optimal performance

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend / Client                    │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTP REST
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Analytics-Logs Service                 │
│                      Port: 8080                         │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────┐        ┌──────────────────────┐   │
│  │   Controller   │───────▶│     Service Layer    │   │
│  │  QueryController│        │   QueryService       │   │
│  └────────────────┘        └──────────────────────┘   │
│          │                            │                │
│          │                            ▼                │
│          │                  ┌──────────────────────┐   │
│          │                  │   Repository Layer   │   │
│          │                  │   QueryRepository    │   │
│          │                  └──────────────────────┘   │
│          │                            │                │
│          ▼                            ▼                │
│  ┌────────────────┐        ┌──────────────────────┐   │
│  │  CORS Config   │        │    JPA/Hibernate     │   │
│  └────────────────┘        └──────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   PostgreSQL DB  │
                  │  Table: queries  │
                  └──────────────────┘
```

### Layer Responsibilities

1. **Controller Layer** (`QueryController`)
   - Handles HTTP requests
   - Request validation
   - Response formatting
   - Exception handling

2. **Service Layer** (`QueryService`)
   - Business logic
   - Transaction management
   - Data transformation
   - Validation rules

3. **Repository Layer** (`QueryRepository`)
   - Database operations
   - Query execution
   - Data persistence
   - CRUD operations

4. **Configuration Layer**
   - CORS configuration
   - Database connection
   - JPA settings

## 🛠️ Technology Stack

### Core Technologies
- **Java**: 17 LTS
- **Spring Boot**: 3.x
- **Spring Data JPA**: Database abstraction
- **Hibernate**: ORM framework
- **PostgreSQL**: 15+ (Database)
- **Gradle**: 8.x (Build tool)

### Dependencies

#### Main Dependencies
```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    compileOnly 'org.projectlombok:lombok'
    runtimeOnly 'org.postgresql:postgresql'
    annotationProcessor 'org.projectlombok:lombok'
}
```

#### Key Annotations Used
- `@RestController`: REST API endpoints
- `@Service`: Service layer beans
- `@Repository`: Data access layer
- `@Entity`: JPA entities
- `@Data`: Lombok getters/setters
- `@CreationTimestamp`: Auto timestamp
- `@CrossOrigin`: CORS support

## 📁 Project Structure

```
analytics-logs/
├── src/
│   ├── main/
│   │   ├── java/com/searchengine/analyticslogs/
│   │   │   ├── config/
│   │   │   │   └── CorsConfig.java              # CORS configuration
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   └── QueryController.java         # REST endpoints
│   │   │   │
│   │   │   ├── model/
│   │   │   │   └── Query.java                   # JPA entity
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   └── QueryRepository.java         # Data access
│   │   │   │
│   │   │   ├── service/
│   │   │   │   └── QueryService.java            # Business logic
│   │   │   │
│   │   │   └── AnalyticsLogsApplication.java    # Main class
│   │   │
│   │   └── resources/
│   │       ├── application.properties            # Configuration
│   │       ├── static/                          # Static resources
│   │       └── templates/                       # Templates (if needed)
│   │
│   └── test/
│       └── java/com/searchengine/analyticslogs/
│           └── AnalyticsLogsApplicationTests.java
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
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code recommended)

## 🚀 Installation

### 1. Clone the Repository

```bash
cd analytics-logs
```

### 2. Database Setup

#### Install PostgreSQL

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [PostgreSQL Official Site](https://www.postgresql.org/download/windows/)

#### Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE my_dbs;

# Create user (if needed)
CREATE USER postgres WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE my_dbs TO postgres;

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
spring.application.name=analytics-logs

# Server Port
server.port=8080

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

# Logging
logging.level.com.searchengine.analyticslogs=INFO
logging.level.org.hibernate.SQL=DEBUG
```

### Configuration Options Explained

| Property | Description | Default |
|----------|-------------|---------|
| `server.port` | Service port | 8080 |
| `spring.datasource.url` | PostgreSQL connection URL | localhost:5432 |
| `spring.jpa.hibernate.ddl-auto` | Schema generation strategy | update |
| `spring.jpa.show-sql` | Show SQL in logs | true |
| `spring.datasource.hikari.maximum-pool-size` | Max DB connections | 10 |

### DDL-Auto Options

- `none`: No schema generation
- `validate`: Validate schema, make no changes
- `update`: Update schema if needed (recommended for dev)
- `create`: Create schema, destroying previous data
- `create-drop`: Create schema, drop on shutdown

## 🏃 Running the Service

### Option 1: Using Gradle Wrapper (Recommended)

```bash
# Development mode with auto-reload
./gradlew bootRun

# Or with specific profile
./gradlew bootRun --args='--spring.profiles.active=dev'
```

### Option 2: Using JAR

```bash
# Build JAR
./gradlew clean build

# Run JAR
java -jar build/libs/analytics-logs-0.0.1-SNAPSHOT.jar
```

### Option 3: Using IDE

1. Open project in IntelliJ IDEA / Eclipse
2. Navigate to `AnalyticsLogsApplication.java`
3. Click Run button or press `Shift + F10`

### Verify Service is Running

```bash
# Check service health
curl http://localhost:8080/api/queries

# Or open in browser
open http://localhost:8080/api/queries
```

## 📚 API Documentation

### Base URL
```
http://localhost:8080
```

### Endpoints

#### 1. Get All Queries

**Request:**
```http
GET /api/queries
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "query": "spring boot tutorial",
    "timestamp": "2025-11-08T10:30:00.123456"
  },
  {
    "id": 2,
    "query": "java microservices",
    "timestamp": "2025-11-08T10:35:00.123456"
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/api/queries
```

---

#### 2. Create Query

**Request:**
```http
POST /api/queries
Content-Type: application/json

{
  "query": "spring boot tutorial"
}
```

**Response:** `200 OK`
```
Query saved successfully
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/queries \
  -H "Content-Type: application/json" \
  -d '{"query":"spring boot tutorial"}'
```

**Notes:**
- `query` field is required
- `timestamp` is automatically generated
- `id` is auto-incremented

---

#### 3. Delete Query

**Request:**
```http
DELETE /api/queries/{id}
```

**Response:** `200 OK`
```json
true
```

Or `404 Not Found` if query doesn't exist

**cURL Example:**
```bash
curl -X DELETE http://localhost:8080/api/queries/1
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "Query field is required"
}
```

#### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Query with id 123 not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

## 🗄️ Database Schema

### queries Table

```sql
CREATE TABLE queries (
    id BIGSERIAL PRIMARY KEY,
    query VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_queries_timestamp ON queries(timestamp DESC);
CREATE INDEX idx_queries_query ON queries(query);
```

### Field Descriptions

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing identifier |
| `query` | VARCHAR(255) | NOT NULL | The search query text |
| `timestamp` | TIMESTAMP(6) | NOT NULL | When query was created |

### Sample Data

```sql
INSERT INTO queries (query, timestamp) VALUES
  ('spring boot tutorial', '2025-11-08 10:30:00'),
  ('java microservices', '2025-11-08 10:35:00'),
  ('rest api design', '2025-11-08 10:40:00');
```

### Useful SQL Queries

```sql
-- Get total query count
SELECT COUNT(*) FROM queries;

-- Get queries from today
SELECT * FROM queries 
WHERE DATE(timestamp) = CURRENT_DATE
ORDER BY timestamp DESC;

-- Get most recent queries
SELECT * FROM queries 
ORDER BY timestamp DESC 
LIMIT 10;

-- Get queries by keyword
SELECT * FROM queries 
WHERE query ILIKE '%spring%';

-- Get query statistics
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as total_queries
FROM queries
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

## 🧪 Testing

### Manual Testing

#### Test Query Creation
```bash
curl -X POST http://localhost:8080/api/queries \
  -H "Content-Type: application/json" \
  -d '{"query":"test query"}'
```

#### Test Query Retrieval
```bash
curl http://localhost:8080/api/queries
```

#### Test Query Deletion
```bash
curl -X DELETE http://localhost:8080/api/queries/1
```

### Using Postman

1. Import the following collection:

```json
{
  "info": {
    "name": "Analytics-Logs Service",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Queries",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/queries"
      }
    },
    {
      "name": "Create Query",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/queries",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"query\":\"spring boot tutorial\"}"
        }
      }
    },
    {
      "name": "Delete Query",
      "request": {
        "method": "DELETE",
        "url": "http://localhost:8080/api/queries/1"
      }
    }
  ]
}
```

### Unit Testing

Run tests with:
```bash
./gradlew test
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port 8080 Already in Use

**Error:**
```
Web server failed to start. Port 8080 was already in use.
```

**Solution:**
```bash
# Find process using port 8080
lsof -ti:8080

# Kill the process
lsof -ti:8080 | xargs kill -9

# Or change port in application.properties
server.port=8081
```

#### 2. Database Connection Failed

**Error:**
```
java.sql.SQLException: Connection to localhost:5432 refused
```

**Solutions:**
- Verify PostgreSQL is running:
  ```bash
  pg_isready
  ```
- Check connection details in `application.properties`
- Ensure database exists:
  ```bash
  psql -l | grep my_dbs
  ```

#### 3. Table Does Not Exist

**Error:**
```
org.postgresql.util.PSQLException: ERROR: relation "queries" does not exist
```

**Solution:**
Set in `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=update
```

#### 4. CORS Errors

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
Ensure `CorsConfig.java` is present and properly configured.

#### 5. Lombok Not Working

**Error:**
```
cannot find symbol: method getQuery()
```

**Solution:**
- Enable annotation processing in IDE
- Ensure Lombok plugin is installed
- Rebuild project: `./gradlew clean build`

## 📊 Performance Optimization

### Database Indexing

```sql
-- Add indexes for better query performance
CREATE INDEX idx_queries_timestamp ON queries(timestamp DESC);
CREATE INDEX idx_queries_query ON queries(query);
CREATE INDEX idx_queries_query_text ON queries USING gin(to_tsvector('english', query));
```

### Connection Pooling

Configure HikariCP in `application.properties`:

```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.max-lifetime=1200000
```

### Caching (Optional)

Add Spring Cache for frequently accessed data:

```java
@Service
@EnableCaching
public class QueryService {
    @Cacheable("queries")
    public List<Query> getAllQueries() {
        // ...
    }
}
```

## 🔒 Security Recommendations

1. **Add Authentication**: Implement Spring Security with JWT
2. **Input Validation**: Add `@Valid` and validation annotations
3. **Rate Limiting**: Implement request rate limiting
4. **SQL Injection**: Already protected by JPA/Hibernate
5. **HTTPS**: Enable SSL in production
6. **Environment Variables**: Use for sensitive configuration

## 📈 Monitoring & Logging

### Enable Actuator

Add to `build.gradle`:
```groovy
implementation 'org.springframework.boot:spring-boot-starter-actuator'
```

Access endpoints:
- Health: `http://localhost:8080/actuator/health`
- Metrics: `http://localhost:8080/actuator/metrics`
- Info: `http://localhost:8080/actuator/info`

### Custom Logging

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class QueryService {
    private static final Logger logger = LoggerFactory.getLogger(QueryService.class);
    
    public void createQuery(Query query) {
        logger.info("Creating query: {}", query.getQuery());
        // ...
    }
}
```

## 🚀 Deployment

### Build for Production

```bash
./gradlew clean build -x test
```

### Run as Service

Create systemd service file: `/etc/systemd/system/analytics-logs.service`

```ini
[Unit]
Description=Analytics Logs Service
After=network.target

[Service]
User=appuser
ExecStart=/usr/bin/java -jar /opt/analytics-logs/analytics-logs.jar
SuccessExitStatus=143
TimeoutStopSec=10
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable analytics-logs
sudo systemctl start analytics-logs
```

## 📝 License

This service is part of the Search Engine project, licensed under MIT License.

## 🤝 Contributing

Please refer to the main project README for contribution guidelines.

---

**Service Status**: ✅ Production Ready

**Last Updated**: November 8, 2025
