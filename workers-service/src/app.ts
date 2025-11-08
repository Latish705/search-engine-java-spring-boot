import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import PrefixSuggestionModel from "./models/prefixSuggestionSchema";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { buildTrieHandler } from "./controller/dataController";

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
const PORT = 8100;

let redisClient: Redis;

async function main() {
  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  await connectDB();

  // Route to trigger trie build process
  app.post("/build-trie", buildTrieHandler);

  app.get("/search", async (req: Request, res: Response) => {
    const prefix = req.query.q as string;
    console.log(prefix);

    if (!prefix) {
      return res.status(400).send({ error: "Query parameter 'q' is required" });
    }

    try {
      const cachedData = await redisClient.get(prefix);
      if (cachedData) {
        return res.status(200).send(cachedData);
      }
      const doc = await PrefixSuggestionModel.findById(prefix);

      if (doc) {
        await redisClient.set(prefix, doc.suggestions, {
          ex: 3600,
        });
        return res.status(200).send(doc.suggestions);
      } else {
        await redisClient.set(prefix, [], { ex: 3600 });
        return res.status(200).send([]);
      }
    } catch (error) {
      console.error("Error occurred while processing request:", error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  });
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main().catch((error) => {
  console.error("Error occurred during server initialization:", error);
  process.exit(1);
});
