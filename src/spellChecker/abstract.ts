export default abstract class SpellChecker {
  abstract addWord(word: string): Promise<void>;
  abstract addWords(words: string[]): Promise<void>;
  abstract removeWord(word: string): Promise<void>;
  abstract removeWords(words: string[]): Promise<void>;
  abstract suggest(word: string): Promise<string[]>;
  abstract correct(word: string): Promise<boolean>;
}
