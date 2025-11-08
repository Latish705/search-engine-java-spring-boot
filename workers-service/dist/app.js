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
const express_1 = __importDefault(require("express"));
const prefixSuggestionSchema_1 = __importDefault(require("./models/prefixSuggestionSchema"));
const redis_1 = require("@upstash/redis");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 8100;
let redisClient;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        redisClient = new redis_1.Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        (0, db_1.default)();
        app.get("/search", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const prefix = req.query.q;
            console.log(prefix);
            if (!prefix) {
                return res.status(400).send({ error: "Query parameter 'q' is required" });
            }
            try {
                const cachedData = yield redisClient.get(prefix);
                if (cachedData) {
                    return res.status(200).send(cachedData);
                }
                const doc = yield prefixSuggestionSchema_1.default.findById(prefix);
                if (doc) {
                    yield redisClient.set(prefix, doc.suggestions, {
                        ex: 3600,
                    });
                    return res.status(200).send(doc.suggestions);
                }
                else {
                    yield redisClient.set(prefix, [], { ex: 3600 });
                    return res.status(200).send([]);
                }
            }
            catch (error) {
                console.error("Error occurred while processing request:", error);
                return res.status(500).send({ error: "Internal Server Error" });
            }
        }));
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    });
}
main().catch((error) => {
    console.error("Error occurred during server initialization:", error);
    process.exit(1);
});
