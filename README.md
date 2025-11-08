# 🔍 Search Engine - Microservices Architecture

A modern, scalable search engine built with microservices architecture, featuring real-time search suggestions, analytics tracking, and query aggregation. The system uses a Trie data structure for fast auto-completion and provides comprehensive analytics for search patterns.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7+-green)
![Redis](https://img.shields.io/badge/Redis-Cloud-red)

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Services](#running-the-services)
- [API Documentation](#api-documentation)
- [Frontend Interface](#frontend-interface)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## 🏗️ Architecture Overview

The system consists of three independent microservices that work together to provide a complete search engine solution:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (HTML/JS)                      │
│                    Port: file:// or 3000                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Analytics    │    │  Aggregator   │    │   Workers     │
│  Logs Service │    │   Service     │    │   Service     │
│   Port: 8080  │    │  Port: 8090   │    │  Port: 8100   │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  PostgreSQL   │    │  PostgreSQL   │    │   MongoDB     │
│    queries    │    │  aggregated   │    │  + Redis      │
│               │    │  _query       │    │  suggestions  │
└───────────────┘    └───────────────┘    └───────────────┘
```

### Service Responsibilities

1. **Analytics-Logs Service** (Spring Boot)

   - Records every search query with timestamp
   - Provides query history and deletion capabilities
   - Stores raw search data in PostgreSQL

2. **Aggregator Service** (Spring Boot)

   - Aggregates queries by frequency
   - Identifies popular search terms
   - Scheduled jobs for automatic aggregation
   - Provides aggregated data for analytics

3. **Workers Service** (Node.js/TypeScript)
   - Builds and maintains Trie data structure
   - Provides real-time search suggestions
   - Uses Redis for caching
   - Optimized for fast prefix matching

## ✨ Features

### Core Features

- 🔍 **Real-time Search Suggestions**: Lightning-fast auto-complete using Trie data structure
- 📊 **Query Analytics**: Track and analyze all search queries with timestamps
- 📈 **Popular Searches**: Identify trending search terms with frequency analysis
- 🌳 **Trie Data Structure**: Efficient prefix-based search suggestions
- ⚡ **Redis Caching**: Ultra-fast response times for repeated searches
- 🎯 **CORS Enabled**: Full cross-origin support for frontend integration

### Technical Features

- 🔄 **Microservices Architecture**: Independent, scalable services
- 🗄️ **Multi-Database**: PostgreSQL for transactional data, MongoDB for documents, Redis for caching
- 📝 **RESTful APIs**: Clean, well-documented endpoints
- 🎨 **Modern UI**: Single-page application with responsive design
- 🔐 **Data Validation**: Input validation and error handling
- 📊 **Service Health Monitoring**: Real-time service status checks

## 🛠️ Technology Stack

### Backend Services

#### Analytics-Logs Service

- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL
- **Build Tool**: Gradle
- **Key Dependencies**:
  - Spring Data JPA
  - PostgreSQL Driver
  - Lombok
  - Spring Web

#### Aggregator Service

- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL
- **Build Tool**: Gradle
- **Key Dependencies**:
  - Spring Data JPA
  - Spring Scheduling
  - Quartz Scheduler
  - PostgreSQL Driver
  - Lombok

#### Workers Service

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Databases**: MongoDB, Redis (Upstash)
- **Build Tool**: npm
- **Key Dependencies**:
  - Express.js
  - Mongoose
  - @upstash/redis
  - cors
  - dotenv

### Frontend

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Async/await, Fetch API
- **No Framework**: Pure vanilla JavaScript for simplicity

## 📁 Project Structure

```
search-engine/
├── analytics-logs/              # Analytics Logs Service
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/searchengine/analyticslogs/
│   │   │   │   ├── config/         # CORS configuration
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── model/          # JPA entities
│   │   │   │   ├── repository/     # Data repositories
│   │   │   │   ├── service/        # Business logic
│   │   │   │   └── AnalyticsLogsApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── build.gradle
│   └── README.md
│
├── aggregator-service/          # Aggregator Service
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/searchengine/aggregatorservice/
│   │   │   │   ├── config/         # CORS configuration
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── model/          # JPA entities
│   │   │   │   ├── repository/     # Data repositories
│   │   │   │   ├── service/        # Business logic
│   │   │   │   └── AggregatorServiceApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── build.gradle
│   └── README.md
│
├── workers-service/             # Workers Service
│   ├── src/
│   │   ├── app.ts              # Main application
│   │   ├── config/
│   │   │   └── db.ts           # MongoDB connection
│   │   ├── controller/
│   │   │   └── dataController.ts
│   │   ├── models/             # MongoDB schemas
│   │   │   ├── prefixSuggestionSchema.ts
│   │   │   └── suggestionSchema.ts
│   │   ├── services/           # Trie implementation
│   │   │   ├── TrieBuilder.ts
│   │   │   ├── TrieNode.ts
│   │   │   └── TrieStorage.ts
│   │   └── routes/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── index.html                   # Frontend interface
└── README.md                    # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 17 or higher**

  ```bash
  java -version
  ```

- **Node.js 18+ and npm**

  ```bash
  node --version
  npm --version
  ```

- **PostgreSQL 15+**

  ```bash
  psql --version
  ```

- **MongoDB 7+ (Local or Atlas)**

  ```bash
  mongod --version
  ```

- **Redis (Upstash Cloud Account or Local)**
  - Sign up at [Upstash](https://upstash.com/) for free Redis

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Latish705/search-engine-java-spring-boot.git
cd search-engine-java-spring-boot
```

### 2. Database Setup

#### PostgreSQL Setup

```sql
-- Create database
CREATE DATABASE my_dbs;

-- Connect to database
\c my_dbs

-- The tables will be auto-created by Spring Boot JPA
```

#### MongoDB Setup

Option 1: Local MongoDB

```bash
# Start MongoDB service
mongod
```

Option 2: MongoDB Atlas

- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string

#### Redis Setup (Upstash)

1. Sign up at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and Token

### 3. Configure Services

#### Analytics-Logs Service

Edit `analytics-logs/src/main/resources/application.properties`:

```properties
spring.application.name=analytics-logs
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/my_dbs
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

#### Aggregator Service

Edit `aggregator-service/src/main/resources/application.properties`:

```properties
spring.application.name=aggregator-service
server.port=8090

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/my_dbs
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

#### Workers Service

Create `workers-service/.env`:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/search_engine
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/search_engine

# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### 4. Install Dependencies

#### Analytics-Logs Service

```bash
cd analytics-logs
./gradlew build
cd ..
```

#### Aggregator Service

```bash
cd aggregator-service
./gradlew build
cd ..
```

#### Workers Service

```bash
cd workers-service
npm install
cd ..
```

## 🏃 Running the Services

### Start All Services

#### Terminal 1: Analytics-Logs Service

```bash
cd analytics-logs
./gradlew bootRun
```

Service will start on `http://localhost:8080`

#### Terminal 2: Aggregator Service

```bash
cd aggregator-service
./gradlew bootRun
```

Service will start on `http://localhost:8090`

#### Terminal 3: Workers Service

```bash
cd workers-service
npm start
# Or for development with auto-reload:
npm run dev
```

Service will start on `http://localhost:8100`

### Access Frontend

Open `index.html` in your browser:

```bash
# Option 1: Direct file opening
open index.html

# Option 2: Using Python HTTP server
python3 -m http.server 3000
# Then navigate to http://localhost:3000

# Option 3: Using Node.js http-server
npx http-server -p 3000
```

## 📚 API Documentation

### Analytics-Logs Service (Port 8080)

#### Get All Queries

```http
GET /api/queries
```

**Response:**

```json
[
  {
    "id": 1,
    "query": "spring boot tutorial",
    "timestamp": "2025-11-08T10:30:00"
  }
]
```

#### Create Query

```http
POST /api/queries
Content-Type: application/json

{
  "query": "spring boot tutorial"
}
```

#### Delete Query

```http
DELETE /api/queries/{id}
```

### Aggregator Service (Port 8090)

#### Run Aggregation

```http
POST /aggregate/run
```

**Response:**

```
Aggregation job executed.
```

#### Get Aggregated Data

```http
GET /aggregate/data
```

**Response:**

```json
[
  {
    "id": 1,
    "query": "spring boot",
    "frequency": 15,
    "lastUpdated": "2025-11-08T10:30:00"
  }
]
```

### Workers Service (Port 8100)

#### Get Search Suggestions

```http
GET /search?q={prefix}
```

**Example:**

```http
GET /search?q=spr
```

**Response:**

```json
[
  {
    "query": "spring boot",
    "frequency": 15
  },
  {
    "query": "spring framework",
    "frequency": 10
  }
]
```

#### Build Trie

```http
POST /build-trie
Content-Type: application/json
```

**Response:**

```json
{
  "message": "Trie built successfully",
  "details": {
    "totalNodes": 1250,
    "buildTime": "125ms"
  }
}
```

## 🎨 Frontend Interface

The frontend provides a comprehensive interface to interact with all services:

### Features

1. **Search with Auto-Suggestions**

   - Real-time suggestions as you type
   - Shows query frequency
   - Click to select and search

2. **Query Analytics Dashboard**

   - View all logged queries
   - Filter and sort capabilities
   - Delete individual queries
   - Real-time timestamp display

3. **Popular Searches**

   - Run aggregation manually
   - View trending searches
   - Frequency analysis
   - Last updated timestamps

4. **Trie Builder**

   - Build/Rebuild trie data structure
   - Visual feedback on build status
   - Detailed build information

5. **Service Status Monitor**
   - Real-time health checks
   - Visual indicators (online/offline)
   - Individual service status

## 🗄️ Database Schema

### PostgreSQL - Analytics-Logs Service

#### queries table

```sql
CREATE TABLE queries (
    id BIGSERIAL PRIMARY KEY,
    query VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### PostgreSQL - Aggregator Service

#### aggregated_query table

```sql
CREATE TABLE aggregated_query (
    id BIGSERIAL PRIMARY KEY,
    query VARCHAR(255) NOT NULL UNIQUE,
    frequency BIGINT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP NOT NULL
);
```

### MongoDB - Workers Service

#### suggestions collection

```javascript
{
  _id: ObjectId,
  query: String,      // The search query
  frequency: Number   // How many times it appears
}
```

#### prefixsuggestions collection

```javascript
{
  _id: String,        // The prefix (e.g., "spr")
  suggestions: [
    {
      query: String,
      frequency: Number
    }
  ]
}
```

## 🔄 Data Flow

1. **User Types in Search Box**

   - Frontend sends prefix to Workers Service
   - Workers checks Redis cache
   - If not cached, queries MongoDB Trie
   - Returns suggestions to frontend

2. **User Performs Search**

   - Frontend logs query to Analytics-Logs Service
   - Query stored in PostgreSQL with timestamp

3. **Aggregation Process**

   - User clicks "Run Aggregation" or scheduled job runs
   - Aggregator Service queries Analytics-Logs database
   - Counts query frequencies
   - Updates aggregated_query table

4. **Trie Building**
   - User clicks "Build Trie"
   - Workers Service fetches aggregated data
   - Builds Trie data structure
   - Stores in MongoDB for fast prefix search
   - Sets up Redis caching

## 🧪 Testing

### Test Analytics Service

```bash
curl -X POST http://localhost:8080/api/queries \
  -H "Content-Type: application/json" \
  -d '{"query":"spring boot tutorial"}'
```

### Test Aggregator Service

```bash
curl -X POST http://localhost:8090/aggregate/run
curl http://localhost:8090/aggregate/data
```

### Test Workers Service

```bash
curl "http://localhost:8100/search?q=spr"
curl -X POST http://localhost:8100/build-trie
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure CORS configuration is present in both Spring Boot services
   - Check browser console for specific CORS errors

2. **Database Connection Failed**

   - Verify PostgreSQL is running: `pg_isready`
   - Check connection credentials in application.properties
   - Ensure database exists

3. **MongoDB Connection Issues**

   - Check MongoDB is running: `mongod --version`
   - Verify connection string in .env file
   - Check network connectivity for Atlas

4. **Port Already in Use**

   ```bash
   # Find and kill process
   lsof -ti:8080 | xargs kill -9
   ```

5. **Redis Connection Failed**
   - Verify Upstash credentials
   - Check network connectivity
   - Ensure Redis REST URL and Token are correct

## 🔧 Configuration

### Changing Ports

#### Spring Boot Services

Edit `application.properties`:

```properties
server.port=YOUR_PORT
```

#### Workers Service

Edit `src/app.ts`:

```typescript
const PORT = YOUR_PORT;
```

#### Frontend

Edit `index.html`:

```javascript
const config = {
  analyticsService: "http://localhost:YOUR_PORT/api/queries",
  aggregatorService: "http://localhost:YOUR_PORT/aggregate",
  workersService: "http://localhost:YOUR_PORT",
};
```

## 🚀 Deployment

### Docker Deployment (Recommended)

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: my_dbs
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: admin123
    ports:
      - "5432:5432"

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"

  analytics-logs:
    build: ./analytics-logs
    ports:
      - "8080:8080"
    depends_on:
      - postgres

  aggregator-service:
    build: ./aggregator-service
    ports:
      - "8090:8090"
    depends_on:
      - postgres

  workers-service:
    build: ./workers-service
    ports:
      - "8100:8100"
    depends_on:
      - mongodb
```

Run with:

```bash
docker-compose up -d
```

### Cloud Deployment

- **Heroku**: Deploy each service separately
- **AWS**: Use ECS/EKS for container orchestration
- **Google Cloud**: Use Cloud Run or GKE
- **Azure**: Use Azure Container Instances or AKS

## 📊 Performance Optimization

1. **Redis Caching**: Reduces database queries for repeated searches
2. **Database Indexing**: Index on query fields for faster lookups
3. **Connection Pooling**: Configured in Spring Boot and MongoDB
4. **Trie Data Structure**: O(m) time complexity for prefix matching
5. **Scheduled Aggregation**: Reduces real-time processing overhead

## 🔒 Security Considerations

- [ ] Add authentication/authorization (JWT, OAuth2)
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS in production
- [ ] Implement API key management
- [ ] Add request logging and monitoring

## 📈 Future Enhancements

- [ ] Add user authentication and profiles
- [ ] Implement search history per user
- [ ] Add advanced analytics (charts, graphs)
- [ ] Implement fuzzy search
- [ ] Add spell correction
- [ ] Create mobile app
- [ ] Add Docker support
- [ ] Implement Kubernetes orchestration
- [ ] Add CI/CD pipeline
- [ ] Implement distributed tracing
- [ ] Add GraphQL API
- [ ] Implement WebSocket for real-time updates

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Latish Dwani** - [@Latish705](https://github.com/Latish705)

## 🙏 Acknowledgments

- Spring Boot Documentation
- MongoDB Documentation
- Express.js Documentation
- Upstash Redis
- All open-source contributors

## 📞 Support

For support, email latishdwani@example.com or create an issue in the repository.

---

**Made with ❤️ using Java Spring Boot, Node.js, and TypeScript**
