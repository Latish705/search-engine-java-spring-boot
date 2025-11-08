"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const prefixSuggestionSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    suggestions: [
        {
            query: { type: String, required: true },
            frequency: { type: Number, required: true },
        },
    ],
});
const PrefixSuggestionModel = (0, mongoose_1.model)("PrefixSuggestion", prefixSuggestionSchema);
exports.default = PrefixSuggestionModel;
