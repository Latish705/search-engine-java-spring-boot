"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const suggestionSchema = new mongoose_1.Schema({
    query: { type: String, required: true, unique: true },
    frequency: { type: Number, default: 1 },
}, { _id: false });
const SuggestionModel = (0, mongoose_1.model)("Suggestion", suggestionSchema);
exports.default = SuggestionModel;
