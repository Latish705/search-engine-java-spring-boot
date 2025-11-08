import mongoose, { Schema, model, Document } from "mongoose";
import { ISuggestion } from "./suggestionSchema";

interface IPrefixSuggestion extends Document {
  _id: string;
  suggestions: ISuggestion[];
}

const prefixSuggestionSchema: Schema = new Schema({
  _id: { type: String, required: true },
  suggestions: { type: [Object], default: [] },
});

const PrefixSuggestionModel = model<IPrefixSuggestion>(
  "PrefixSuggestion",
  prefixSuggestionSchema
);

export default PrefixSuggestionModel;
