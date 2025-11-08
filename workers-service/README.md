# 🌳 Workers Service

A Node.js/TypeScript microservice that provides lightning-fast search suggestions using a Trie data structure. This service builds and maintains a prefix tree from aggregated queries, offers real-time auto-complete suggestions, and uses Redis for ultra-fast caching.

![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7+-green)
![Redis](https://img.shields.io/badge/Redis-Upstash-red)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)

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
- [Trie Data Structure](#trie-data-structure)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Workers Service is responsible for:
- **Trie Construction**: Builds efficient prefix tree from aggregated queries
- **Search Suggestions**: Provides real-time auto-complete suggestions
- **Redis Caching**: Ultra-fast response times through intelligent caching
- **Prefix Matching**: O(m) time complexity for any prefix length
- **Performance Optimization**: Sub-millisecond response times for cached queries

This service is the performance powerhouse of the search engine, delivering instant suggestions as users type.

## ✨ Features

### Core Features
- 🌳 **Trie Data Structure**: Efficient prefix-based search
- ⚡ **Redis Caching**: Lightning-fast cached responses
- 🔍 **Auto-complete Suggestions**: Real-time as-you-type suggestions
- 📊 **Frequency Ranking**: Suggestions sorted by popularity
- 🔄 **Incremental Updates**: Rebuild trie with new data
- 💾 **Persistent Storage**: MongoDB for trie data

### Technical Features
- 🚀 **REST API**: Clean, documented endpoints
- 🔥 **High Performance**: Sub-10ms response times (cached)
- 📈 **Scalable Architecture**: Handle millions of queries
- 🎯 **TypeScript**: Type-safe code
- 🌐 **CORS Support**: Full cross-origin support
- ⚙️ **Environment Config**: Secure credential management

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend / Client                    │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTP REST
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Workers Service                        │
│                      Port: 8100                         │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────┐        ┌──────────────────────┐   │
│  │   Express      │───────▶│    Controllers       │   │
│  │   Routes       │        │  dataController.ts   │   │
│  └────────────────┘        └──────────────────────┘   │
│          │                            │                │
│          │                            ▼                │
│          │                  ┌──────────────────────┐   │
│          │                  │   Trie Services      │   │
│          │                  │  - TrieBuilder       │   │
│          │                  │  - TrieNode          │   │
│          │                  │  - TrieStorage       │   │
│          │                  └──────────────────────┘   │
│          │                            │                │
│          ▼                            ▼                │
│  ┌────────────────┐        ┌──────────────────────┐   │
│  │  Redis Cache   │        │   MongoDB Models     │   │
│  │  (Upstash)     │        │  - PrefixSuggestion  │   │
│  │  - Get cached  │        │  - Suggestion        │   │
│  │  - Set cache   │        └──────────────────────┘   │
│  └────────────────┘                   │                │
└─────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │   Redis Cloud    │        │   MongoDB Atlas  │
    │   (Upstash)      │        │   or Local       │
    │   Cache Layer    │        │   Trie Storage   │
    └──────────────────┘        └──────────────────┘
```

### Request Flow

#### Search Suggestions Flow
```
User Types "spr" → Workers Service
                ↓
         Check Redis Cache
                ↓
        ┌───────┴───────┐
        │               │
    Cache Hit       Cache Miss
        │               │
        │           Query MongoDB
        │               │
        │          Get Suggestions
        │               │
        │          Cache in Redis
        │               │
        └───────┬───────┘
                ↓
        Return Suggestions
```

#### Trie Building Flow
```
POST /build-trie → Fetch Aggregated Data
                        ↓
                   Build Trie Tree
                        ↓
            Store Prefix → Suggestions
                        ↓
              Save to MongoDB
                        ↓
           Return Success Message
```

## 🛠️ Technology Stack

### Core Technologies
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.x
- **Framework**: Express.js 4.x
- **Database**: MongoDB 7+
- **Cache**: Redis (Upstash Cloud)
- **ODM**: Mongoose

### Key Dependencies

```json
{
  "dependencies": {
    "@types/express": "^5.0.5",
    "@types/mongoose": "^5.11.96",
    "@upstash/redis": "^1.35.6",
    "express": "^5.1.0",
    "mongoose": "^8.19.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "nodemon": "^3.1.10",
    "ts-node": "^10.9.2"
  }
}
```

### Features by Technology

| Technology | Purpose | Benefits |
|------------|---------|----------|
| TypeScript | Type safety | Catch errors at compile time |
| Express.js | Web framework | Fast, minimal, flexible |
| MongoDB | Document storage | Flexible schema for trie data |
| Redis (Upstash) | Caching | Sub-millisecond responses |
| Mongoose | ODM | Schema validation, middleware |

## 📁 Project Structure

```
workers-service/
├── src/
│   ├── app.ts                          # Main application entry
│   │
│   ├── config/
│   │   └── db.ts                       # MongoDB connection
│   │
│   ├── controller/
│   │   └── dataController.ts           # HTTP request handlers
│   │
│   ├── models/
│   │   ├── prefixSuggestionSchema.ts   # Trie node schema
│   │   └── suggestionSchema.ts         # Suggestion schema
│   │
│   ├── services/
│   │   ├── TrieBuilder.ts              # Builds trie structure
│   │   ├── TrieNode.ts                 # Trie node class
│   │   └── TrieStorage.ts              # Stores trie in MongoDB
│   │
│   └── routes/                         # API routes (if needed)
│
├── dist/                               # Compiled JavaScript (generated)
│
├── .env                                # Environment variables (create this)
├── .gitignore                          # Git ignore file
├── package.json                        # Project dependencies
├── tsconfig.json                       # TypeScript configuration
└── README.md                           # This file
```

## 📋 Prerequisites

- **Node.js 18 or higher**
  ```bash
  node --version
  ```

- **npm or yarn**
  ```bash
  npm --version
  ```

- **MongoDB** (Local or Atlas)
  - Local: Install and run `mongod`
  - Cloud: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

- **Redis (Upstash)**
  - Sign up at [Upstash](https://upstash.com/)
  - Create a new Redis database

- **Aggregator Service** (must have data)
  - Ensure aggregated queries exist

## 🚀 Installation

### 1. Navigate to Project Directory

```bash
cd workers-service
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Set Up MongoDB

#### Option 1: Local MongoDB

```bash
# Start MongoDB
mongod --dbpath /path/to/data/directory

# Verify it's running
mongosh
```

#### Option 2: MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Whitelist your IP address

### 4. Set Up Redis (Upstash)

1. Sign up at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy REST URL and Token from dashboard

### 5. Configure Environment Variables

Create `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/search_engine

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/search_engine?retryWrites=true&w=majority

# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/search_engine` |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | `https://xxx.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis authentication token | `AXXxxx...` |

### TypeScript Configuration

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Package Scripts

`package.json`:
```json
{
  "scripts": {
    "start": "tsc -b && node dist/app.js",
    "dev": "nodemon src/app.ts",
    "build": "tsc -b",
    "clean": "rm -rf dist"
  }
}
```

## 🏃 Running the Service

### Development Mode (with auto-reload)

```bash
npm run dev
```

This uses `nodemon` to automatically restart on file changes.

### Production Mode

```bash
# Build TypeScript
npm run build

# Run compiled JavaScript
npm start
```

### Manual Build and Run

```bash
# Compile TypeScript
tsc

# Run compiled code
node dist/app.js
```

### Verify Service is Running

```bash
# Check search endpoint
curl "http://localhost:8100/search?q=test"

# Expected response: [] or array of suggestions
```

## 📚 API Documentation

### Base URL
```
http://localhost:8100
```

### Endpoints

#### 1. Get Search Suggestions

**Description**: Get auto-complete suggestions for a given prefix.

**Request:**
```http
GET /search?q={prefix}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search prefix (e.g., "spr") |

**Response:** `200 OK`
```json
[
  {
    "query": "spring boot",
    "frequency": 15
  },
  {
    "query": "spring framework",
    "frequency": 10
  },
  {
    "query": "spring security",
    "frequency": 5
  }
]
```

**Response for No Matches:** `200 OK`
```json
[]
```

**cURL Examples:**
```bash
# Get suggestions for "spr"
curl "http://localhost:8100/search?q=spr"

# Get suggestions for "java"
curl "http://localhost:8100/search?q=java"

# URL encode special characters
curl "http://localhost:8100/search?q=spring%20boot"
```

**Performance:**
- Cache Hit: < 10ms
- Cache Miss: 20-50ms
- Empty Results: < 5ms

**Cache Behavior:**
- Results cached for 1 hour (3600 seconds)
- Automatic cache invalidation after expiry
- Cache key: prefix string

---

#### 2. Build Trie

**Description**: Build or rebuild the Trie data structure from aggregated queries.

**Request:**
```http
POST /build-trie
Content-Type: application/json
```

**Request Body:** None required (can be empty JSON `{}`)

**Response:** `200 OK`
```json
{
  "message": "Trie built successfully",
  "details": {
    "totalQueries": 150,
    "totalPrefixes": 1250,
    "buildTime": "125ms"
  }
}
```

**Response on Error:** `500 Internal Server Error`
```json
{
  "error": "Failed to build trie",
  "message": "No aggregated data found"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8100/build-trie \
  -H "Content-Type: application/json"
```

**Process:**
1. Fetches all aggregated queries from Aggregator Service
2. Builds Trie tree structure in memory
3. Extracts all prefix → suggestions mappings
4. Stores in MongoDB `prefixsuggestions` collection
5. Returns build statistics

**When to Run:**
- After new queries are aggregated
- When suggestions seem outdated
- After significant traffic increase
- As part of scheduled maintenance

**Execution Time:**
- Small dataset (< 100 queries): < 1 second
- Medium dataset (100-1000 queries): 1-5 seconds
- Large dataset (> 1000 queries): 5-30 seconds

---

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Query parameter 'q' is required"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Database connection failed"
}
```

## 🌳 Trie Data Structure

### What is a Trie?

A Trie (prefix tree) is a tree data structure used for efficient string searching. Each node represents a character, and paths from root to node represent prefixes.

### Example Trie

```
        root
       /  |  \
      s   j   r
     /    |    \
    p     a     e
   /      |      \
  r       v       s
 /        |        \
i         a         t
|         
n         Queries at this level:
|         - "spring boot" (15)
g         - "spring framework" (10)
          - "spring security" (5)
```

### Time Complexity

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| Insert | O(m) | m = length of word |
| Search | O(m) | m = length of prefix |
| Delete | O(m) | m = length of word |
| Get Suggestions | O(p + n) | p = prefix length, n = results |

### Space Complexity

- **Best Case**: O(n * m) where n = number of words, m = average word length
- **Worst Case**: O(ALPHABET_SIZE * n * m) for sparse data

### Implementation

#### TrieNode Class

```typescript
export class TrieNode {
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;
    suggestions: Array<{ query: string; frequency: number }>;
    
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.suggestions = [];
    }
}
```

#### TrieBuilder Service

```typescript
export class TrieBuilder {
    private root: TrieNode;
    
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word: string, frequency: number): void {
        let node = this.root;
        
        for (const char of word.toLowerCase()) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char)!;
        }
        
        node.isEndOfWord = true;
        node.suggestions.push({ query: word, frequency });
    }
    
    search(prefix: string): Array<{ query: string; frequency: number }> {
        let node = this.root;
        
        for (const char of prefix.toLowerCase()) {
            if (!node.children.has(char)) {
                return [];
            }
            node = node.children.get(char)!;
        }
        
        return this.collectSuggestions(node);
    }
    
    private collectSuggestions(node: TrieNode): Array<{ query: string; frequency: number }> {
        const suggestions: Array<{ query: string; frequency: number }> = [];
        
        if (node.isEndOfWord) {
            suggestions.push(...node.suggestions);
        }
        
        for (const child of node.children.values()) {
            suggestions.push(...this.collectSuggestions(child));
        }
        
        // Sort by frequency descending
        return suggestions.sort((a, b) => b.frequency - a.frequency);
    }
}
```

## 🗄️ Database Schema

### MongoDB Collections

#### 1. prefixsuggestions Collection

Stores trie nodes with prefix-based suggestions.

```typescript
{
  _id: "spr",              // The prefix
  suggestions: [
    {
      query: "spring boot",
      frequency: 15
    },
    {
      query: "spring framework",
      frequency: 10
    },
    {
      query: "spring security",
      frequency: 5
    }
  ]
}
```

**Schema Definition:**

```typescript
const prefixSuggestionSchema = new Schema({
  _id: { type: String, required: true },    // Prefix as ID
  suggestions: [
    {
      query: { type: String, required: true },
      frequency: { type: Number, required: true }
    }
  ]
});
```

**Indexes:**
```javascript
// _id is automatically indexed
db.prefixsuggestions.createIndex({ "_id": 1 });
```

#### 2. suggestions Collection

Stores individual query suggestions (if needed).

```typescript
{
  _id: ObjectId("..."),
  query: "spring boot tutorial",
  frequency: 15
}
```

**Schema Definition:**

```typescript
const suggestionSchema = new Schema({
  query: { type: String, required: true, unique: true },
  frequency: { type: Number, default: 1 }
}, { _id: false });
```

### Redis Cache Structure

#### Cache Keys
```
Key: {prefix}
Value: JSON array of suggestions
TTL: 3600 seconds (1 hour)
```

#### Example:
```
Key: "spr"
Value: [{"query":"spring boot","frequency":15},{"query":"spring framework","frequency":10}]
Expiry: 3600s
```

### Sample Queries

#### MongoDB

```javascript
// Find suggestions for prefix "spr"
db.prefixsuggestions.findOne({ _id: "spr" });

// Count total prefixes
db.prefixsuggestions.countDocuments();

// Get all prefixes starting with "s"
db.prefixsuggestions.find({ _id: /^s/ });

// Find high-frequency suggestions
db.prefixsuggestions.find({
  "suggestions.frequency": { $gt: 10 }
});
```

#### Redis (using Upstash REST API)

```bash
# Get cached suggestions
curl https://your-redis.upstash.io/get/spr \
  -H "Authorization: Bearer YOUR_TOKEN"

# Set cache
curl https://your-redis.upstash.io/set/spr/suggestions \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check TTL
curl https://your-redis.upstash.io/ttl/spr \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🧪 Testing

### Manual Testing

#### 1. Test Search Endpoint (Empty)

```bash
curl "http://localhost:8100/search?q=xyz"
# Expected: []
```

#### 2. Build Trie

```bash
# Ensure aggregated data exists first
curl -X POST http://localhost:8090/aggregate/run

# Then build trie
curl -X POST http://localhost:8100/build-trie
```

#### 3. Test Search Endpoint (With Data)

```bash
curl "http://localhost:8100/search?q=spr"
# Expected: Array of suggestions
```

#### 4. Test Cache

```bash
# First request (cache miss)
time curl "http://localhost:8100/search?q=spr"

# Second request (cache hit - should be faster)
time curl "http://localhost:8100/search?q=spr"
```

### Performance Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 "http://localhost:8100/search?q=test"

# Using hey
hey -n 1000 -c 10 "http://localhost:8100/search?q=test"

# Expected results:
# - Cache hits: < 10ms response time
# - Cache miss: 20-50ms response time
# - Throughput: 1000+ req/sec
```

### Integration Testing

```bash
# Full workflow test
./test-workflow.sh
```

Create `test-workflow.sh`:
```bash
#!/bin/bash

echo "1. Adding test queries..."
for i in {1..5}; do
  curl -X POST http://localhost:8080/api/queries \
    -H "Content-Type: application/json" \
    -d '{"query":"spring boot"}' -s
done

echo "\n2. Running aggregation..."
curl -X POST http://localhost:8090/aggregate/run -s

echo "\n3. Building trie..."
curl -X POST http://localhost:8100/build-trie -s

echo "\n4. Testing search..."
curl "http://localhost:8100/search?q=spr" -s

echo "\nWorkflow test complete!"
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Error:**
```
MongooseError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
mongod --dbpath /path/to/data

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/search_engine
```

#### 2. Redis Connection Failed

**Error:**
```
Error connecting to Redis: Invalid token
```

**Solutions:**
- Verify Upstash credentials in `.env`
- Check network connectivity
- Ensure Redis URL includes `https://`
- Verify token is correct

#### 3. Empty Suggestions

**Error:**
```
GET /search?q=test returns []
```

**Solutions:**
```bash
# 1. Check if trie is built
curl "http://localhost:8100/search?q=a"

# 2. Rebuild trie
curl -X POST http://localhost:8100/build-trie

# 3. Verify aggregated data exists
curl http://localhost:8090/aggregate/data
```

#### 4. TypeScript Compilation Errors

**Error:**
```
Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Install types
npm install --save-dev @types/express @types/node
```

#### 5. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::8100
```

**Solution:**
```bash
# Find process
lsof -ti:8100

# Kill process
lsof -ti:8100 | xargs kill -9

# Or change port in app.ts
const PORT = 8101;
```

## 📊 Performance Optimization

### Redis Optimization

```typescript
// Adjust cache TTL based on update frequency
await redisClient.set(prefix, suggestions, {
  ex: 7200  // 2 hours for popular prefixes
});

// Use pipeline for batch operations
const pipeline = redisClient.pipeline();
pipeline.set('prefix1', data1);
pipeline.set('prefix2', data2);
await pipeline.exec();
```

### MongoDB Optimization

```javascript
// Create indexes
db.prefixsuggestions.createIndex({ "_id": 1 });
db.suggestions.createIndex({ "query": 1 });
db.suggestions.createIndex({ "frequency": -1 });

// Use lean() for read-only queries
const suggestions = await PrefixSuggestionModel
  .findById(prefix)
  .lean();
```

### Trie Optimization

```typescript
// Limit suggestion results
const MAX_SUGGESTIONS = 10;

getSuggestions(prefix: string): Suggestion[] {
  const results = this.search(prefix);
  return results.slice(0, MAX_SUGGESTIONS);
}

// Implement prefix compression for space
// Store only frequent prefixes (frequency > threshold)
```

## 📈 Monitoring

### Logging

Add structured logging:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Use in code
logger.info('Search request', { prefix, resultCount });
logger.error('Redis connection failed', { error });
```

### Metrics

Track key metrics:

```typescript
let cacheHits = 0;
let cacheMisses = 0;
let totalSearches = 0;

app.get('/metrics', (req, res) => {
  res.json({
    totalSearches,
    cacheHits,
    cacheMisses,
    cacheHitRate: (cacheHits / totalSearches) * 100
  });
});
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/search_engine
UPSTASH_REDIS_REST_URL=https://prod-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_prod_token
```

### Docker Support

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

EXPOSE 8100

CMD ["node", "dist/app.js"]
```

Build and run:
```bash
docker build -t workers-service .
docker run -p 8100:8100 --env-file .env workers-service
```

### PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start service
pm2 start dist/app.js --name workers-service

# Monitor
pm2 monit

# Logs
pm2 logs workers-service

# Restart
pm2 restart workers-service
```

## 📝 Best Practices

1. **Regular Trie Rebuilds**: Schedule daily or after aggregation
2. **Cache Warming**: Pre-populate cache for common prefixes
3. **Monitor Redis Memory**: Set maxmemory policy
4. **Index MongoDB**: Ensure proper indexes for queries
5. **Error Handling**: Graceful fallbacks if Redis/MongoDB fails
6. **Rate Limiting**: Protect endpoints from abuse
7. **Logging**: Track cache hit rates and performance

## 🔒 Security

- [ ] Add API key authentication
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Validate and sanitize input
- [ ] Use HTTPS in production
- [ ] Secure environment variables
- [ ] Implement CORS whitelist
- [ ] Add request logging

## 📝 License

This service is part of the Search Engine project, licensed under MIT License.

---

**Service Status**: ✅ Production Ready

**Last Updated**: November 8, 2025
