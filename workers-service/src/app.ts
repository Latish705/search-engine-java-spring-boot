import express from "express";
import { Request, Response } from "express";
import PrefixSuggestionModel from "./models/prefixSuggestionSchema";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8100;

let redisClient: Redis;

async function main() {
  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  app.get("/search", async (req: Request, res: Response) => {
    const prefix = req.query.q as string;
    if (!prefix) {
      return res.status(400).send({ error: "Query parameter 'q' is required" });
    }

    try {
      const cachedData = await redisClient.get<string>(prefix);
      if (cachedData) {
        return res.status(200).send(JSON.parse(cachedData));
      }
      const doc = await PrefixSuggestionModel.findById(prefix);

      if (doc) {
        await redisClient.set(prefix, JSON.stringify(doc.suggestions), {
          ex: 3600,
        });
        return res.status(200).send(doc.suggestions);
      } else {
        await redisClient.set(prefix, JSON.stringify([]), { ex: 3600 });
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
