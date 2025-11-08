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
const axios_1 = __importDefault(require("axios"));
const TrieBuilder_1 = __importDefault(require("../services/TrieBuilder"));
const TrieStorage_1 = require("../services/TrieStorage");
const db_1 = __importDefault(require("../config/db"));
function getAggregatedData() {
    return __awaiter(this, void 0, void 0, function* () {
        // const data = req.body;
        // here we need to call the aggregated data service to get the data or we can directly get it from db
        // we choose db call for now
        try {
            const resData = yield axios_1.default.get("http://localhost:8090/aggregate/data");
            console.log("Response received from aggregation service");
            console.log("Data:", resData.data);
            return resData.data;
        }
        catch (error) {
            console.error("Error fetching aggregated data:", error);
            throw error;
        }
    });
}
function runBuildProcess() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Worker process starting...");
        yield (0, db_1.default)(); // Connect to MongoDB first
        const startTime = Date.now();
        const data = yield getAggregatedData();
        console.log(data, typeof data);
        console.log("Building Trie in memory...");
        const builder = new TrieBuilder_1.default();
        for (const item of data) {
            builder.insert(item.query, item.frequency);
        }
        console.log("Serializing and storing Trie to sharded DBs...");
        const storage = new TrieStorage_1.TrieStorageService();
        yield storage.serializeAndStoreTrie(builder.root);
        const endTime = Date.now();
        console.log(`\n✅ Worker process finished in ${(endTime - startTime) / 1000} seconds.`);
        process.exit(0);
    });
}
runBuildProcess().catch((error) => {
    console.error("Worker process failed:", error);
    process.exit(1);
});
