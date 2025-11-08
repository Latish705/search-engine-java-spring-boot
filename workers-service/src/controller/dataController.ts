import axios from "axios";
import { Request, Response } from "express";
import TrieBuilderWorker from "../services/TrieBuilder";
import { TrieStorageService } from "../services/TrieStorage";
import connectDB from "../config/db";

export async function buildTrieHandler(req: Request, res: Response) {
  try {
    console.log("Trie build process starting...");
    const startTime = Date.now();

    await connectDB();
    const data = await getAggregatedData();
    
    console.log("Building Trie in memory...");
    const builder = new TrieBuilderWorker();
    for (const item of data) {
      builder.insert(item.query, item.frequency);
    }

    console.log("Serializing and storing Trie to DB...");
    const storage = new TrieStorageService();
    await storage.serializeAndStoreTrie(builder.root);

    const endTime = Date.now();
    const timeElapsed = (endTime - startTime) / 1000;
    
    console.log(`\n✅ Trie build process finished in ${timeElapsed} seconds.`);
    return res.status(200).json({ 
      message: "Trie built and stored successfully",
      timeElapsed: timeElapsed,
      entriesProcessed: data.length
    });
  } catch (error) {
    console.error("Trie build process failed:", error);
    return res.status(500).json({ 
      error: "Failed to build trie",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

async function getAggregatedData() {
  // const data = req.body;

  // here we need to call the aggregated data service to get the data or we can directly get it from db

  // we choose db call for now
  try {
    const resData = await axios.get("http://localhost:8090/aggregate/data");
    console.log("Response received from aggregation service");
    console.log("Data:", resData.data);

    return resData.data;
  } catch (error) {
    console.error("Error fetching aggregated data:", error);
    throw error;
  }
}

// Old standalone process code removed - now handled by buildTrieHandler
