"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrieStorageService = void 0;
const prefixSuggestionSchema_1 = __importDefault(require("../models/prefixSuggestionSchema"));
class TrieStorageService {
    serializeAndStoreTrie(root) {
        return __awaiter(this, void 0, void 0, function* () {
            const allOps = [];
            console.log("Flattening in-memory Trie...");
            this._dfsSerialize(root, "", allOps);
            if (allOps.length > 0) {
                yield this._writeBatch(allOps);
            }
        });
    }
    _writeBatch(allOps) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Writing batch of", allOps.length, "operations to DB...");
                console.log("First operation:", JSON.stringify(allOps[0], null, 2));
                const result = yield prefixSuggestionSchema_1.default.bulkWrite(allOps);
                console.log("Batch write completed. Modified:", result.modifiedCount, "Upserted:", result.upsertedCount);
            }
            catch (error) {
                console.error("Error writing batch to DB:", error);
                throw error;
            }
        });
    }
    _dfsSerialize(node, prefix, allOps) {
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
exports.TrieStorageService = TrieStorageService;
