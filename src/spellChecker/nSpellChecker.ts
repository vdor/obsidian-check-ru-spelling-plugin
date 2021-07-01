import SpellChecker from "./abstract";

export default class NSpellChecker extends SpellChecker {
  nSpell: Nspell;

  constructor(nSpell: Nspell) {
    super();
    this.nSpell = nSpell;
  };

  addWord(word: string): Promise<void> {
    this.nSpell.add(word);
    return Promise.resolve();
  }

  async addWords(words: string[]): Promise<void> {
    await Promise.all(words.map(word => this.addWord(word)));
  }

  removeWord(word: string): Promise<void> {
    this.nSpell.remove(word);
    return Promise.resolve();
  }

  async removeWords(words: string[]): Promise<void> {
    await Promise.all(words.map(word => this.removeWord(word)));
  }

  suggest(word: string): Promise<string[]> {
    return Promise.resolve(this.nSpell.suggest(word));
  }

  correct(word: string): Promise<boolean> {
    return Promise.resolve(this.nSpell.correct(word));
  }
}
