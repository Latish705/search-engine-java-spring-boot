import axios from "axios";
import { Request, Response } from "express";
import TrieBuilderWorker from "../services/TrieBuilder";
import { TrieStorageService } from "../services/TrieStorage";

async function getAggregatedData() {
  // const data = req.body;

  // here we need to call the aggregated data service to get the data or we can directly get it from db

  // we choose db call for now
  try {
    const resData = await axios.get("http://localhost:8090/aggregate/run");
    return resData.data;
  } catch (error) {
    console.error("Error fetching aggregated data:", error);
    throw error;
  }
}

async function runBuildProcess() {
  console.log("Worker process starting...");
  const startTime = Date.now();

  const data = await getAggregatedData();

  console.log("Building Trie in memory...");
  const builder = new TrieBuilderWorker();
  for (const item of data) {
    builder.insert(item.query, item.frequency);
  }

  console.log("Serializing and storing Trie to sharded DBs...");
  const storage = new TrieStorageService();
  await storage.serializeAndStoreTrie(builder.root);

  const endTime = Date.now();
  console.log(
    `\n✅ Worker process finished in ${(endTime - startTime) / 1000} seconds.`
  );

  process.exit(0);
}

runBuildProcess().catch((error) => {
  console.error("Worker process failed:", error);
  process.exit(1);
});
