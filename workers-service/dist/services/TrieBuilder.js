"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TrieNode_1 = require("./TrieNode");
const MAX_SUGGESTIONS = 6;
class TrieBuilderWorker {
    constructor() {
        this.root = new TrieNode_1.TrieNode();
    }
    insert(query, frequency) {
        let currentNode = this.root;
        const newSuggestion = new TrieNode_1.TopSuggestion(query, frequency);
        for (const char of query) {
            if (!currentNode.children.has(char)) {
                currentNode.children.set(char, new TrieNode_1.TrieNode());
            }
            currentNode = currentNode.children.get(char);
            this._updateTopSuggestions(currentNode, newSuggestion);
        }
        currentNode.isEndOfWord = true;
        currentNode.frequency = frequency;
    }
    _updateTopSuggestions(node, newSuggestion) {
        node.topSuggestions.push(newSuggestion);
        node.topSuggestions.sort((a, b) => b.frequency - a.frequency);
        if (node.topSuggestions.length > MAX_SUGGESTIONS) {
            node.topSuggestions.pop();
        }
    }
}
exports.default = TrieBuilderWorker;
