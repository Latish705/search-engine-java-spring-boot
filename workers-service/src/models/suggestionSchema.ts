import mongoose, { Schema, model, Document } from "mongoose";

export interface ISuggestion {
  query: string;
  frequency: number;
}

const suggestionSchema: Schema = new Schema(
  {
    query: { type: String, required: true, unique: true },
    frequency: { type: Number, default: 1 },
  },
  { _id: false }
);

const SuggestionModel = model<ISuggestion>("Suggestion", suggestionSchema);

export default SuggestionModel;
