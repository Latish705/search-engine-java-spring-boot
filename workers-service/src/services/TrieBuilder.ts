import { ISuggestion } from "../models/suggestionSchema";
import { TrieNode, TopSuggestion } from "./TrieNode";

const MAX_SUGGESTIONS = 6;

class TrieBuilderWorker {
  root: TrieNode;
  constructor() {
    this.root = new TrieNode();
  }

  insert(query: string, frequency: number): void {
    let currentNode = this.root;

    const newSuggestion = new TopSuggestion(query, frequency);

    for (const char of query) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TrieNode());
      }
      currentNode = currentNode.children.get(char)!;

      this._updateTopSuggestions(currentNode, newSuggestion);
    }

    currentNode.isEndOfWord = true;
    currentNode.frequency = frequency;
  }

  private _updateTopSuggestions(
    node: TrieNode,
    newSuggestion: TopSuggestion
  ): void {
    node.topSuggestions.push(newSuggestion);

    node.topSuggestions.sort((a, b) => b.frequency - a.frequency);

    if (node.topSuggestions.length > MAX_SUGGESTIONS) {
      node.topSuggestions.pop();
    }
  }
}

export default TrieBuilderWorker;
