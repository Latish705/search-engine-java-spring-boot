import SuggestionModel from "../models/suggestionSchema";
import { TrieNode } from "./TrieNode";

export class TrieStorageService {
  async serializeAndStoreTrie(root: TrieNode) {
    const allOps: any[] = [];
    console.log("Flattening in-memory Trie...");
    this._dfsSerialize(root, "", allOps);
  }

  async _writeBatch(allOps: any[]) {
    console.log("Writing batch of ", allOps.length, " operations to DB...");
    await SuggestionModel.bulkWrite(allOps);
    console.log("Batch write completed.");
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

    for (const char in node.children) {
      this._dfsSerialize(node.children.get(char)!, prefix + char, allOps);
    }
  }
}
