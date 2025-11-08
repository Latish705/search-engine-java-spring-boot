import PrefixSuggestionModel from "../models/prefixSuggestionSchema";
import { TrieNode } from "./TrieNode";

export class TrieStorageService {
  async serializeAndStoreTrie(root: TrieNode) {
    const allOps: any[] = [];
    console.log("Flattening in-memory Trie...");
    this._dfsSerialize(root, "", allOps);
    if (allOps.length > 0) {
      await this._writeBatch(allOps);
    }
  }

  async _writeBatch(allOps: any[]) {
    try {
      console.log("Writing batch of", allOps.length, "operations to DB...");
      console.log("First operation:", JSON.stringify(allOps[0], null, 2));
      const result = await PrefixSuggestionModel.bulkWrite(allOps);
      console.log("Batch write completed. Modified:", result.modifiedCount, "Upserted:", result.upsertedCount);
    } catch (error) {
      console.error("Error writing batch to DB:", error);
      throw error;
    }
  }

  _dfsSerialize(node: TrieNode, prefix: string, allOps: any[]) {
    if (node.topSuggestions.length > 0) {
      allOps.push({
        updateOne: {
          filter: { _id: prefix },
          update: { $set: { suggestions: node.topSuggestions } },
          upsert: true,
        },
      });
    }

    for (const [char, childNode] of node.children.entries()) {
      this._dfsSerialize(childNode, prefix + char, allOps);
    }
  }
}
