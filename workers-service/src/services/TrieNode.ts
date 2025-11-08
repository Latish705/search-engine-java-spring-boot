import { ISuggestion } from "../models/suggestionSchema";

export class TopSuggestion {
  query: string;
  frequency: number;
  constructor(query: string, frequency: number) {
    this.query = query;
    this.frequency = frequency;
  }
}

export class TrieNode {
  children: Map<string, TrieNode>;
  topSuggestions: TopSuggestion[];
  isEndOfWord: boolean;
  frequency: number;

  constructor() {
    this.children = new Map<string, TrieNode>();
    this.topSuggestions = [];
    this.isEndOfWord = false;
    this.frequency = 0;
  }
}
