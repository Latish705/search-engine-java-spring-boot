import mongoose, { Schema, model, Document } from "mongoose";
import { ISuggestion } from "./suggestionSchema";

interface IPrefixSuggestion extends Document {
  _id: string;
  suggestions: ISuggestion[];
}

const prefixSuggestionSchema: Schema = new Schema({
  _id: { type: String, required: true },
  suggestions: [
    {
      query: { type: String, required: true },
      frequency: { type: Number, required: true },
    },
  ],
});

const PrefixSuggestionModel = model<IPrefixSuggestion>(
  "PrefixSuggestion",
  prefixSuggestionSchema
);

export default PrefixSuggestionModel;
