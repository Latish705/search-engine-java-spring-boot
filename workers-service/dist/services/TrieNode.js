"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrieNode = exports.TopSuggestion = void 0;
class TopSuggestion {
    constructor(query, frequency) {
        this.query = query;
        this.frequency = frequency;
    }
}
exports.TopSuggestion = TopSuggestion;
class TrieNode {
    constructor() {
        this.children = new Map();
        this.topSuggestions = [];
        this.isEndOfWord = false;
        this.frequency = 0;
    }
}
exports.TrieNode = TrieNode;
