import { AssertionError } from 'assert';
import nspell from 'nspell';
import { DictrionaryResult } from 'src/types/dictionary';
import SpellChecker from 'src/spellChecker/abstract';
import NSpellChecker from 'src/spellChecker/nSpellChecker';

export abstract class SpellCheckerFactory {
  abstract getSpellChecker(): Promise<SpellChecker>;
}

type DictionaryLoader = (affUri: string, dicUri: string) => Promise<DictrionaryResult>;

export class NSpellCheckerFactory extends SpellCheckerFactory {
  #affUris: string[];

  #dicUris: string[];

  loadDictionary: DictionaryLoader;

  constructor(affUris: string[], dicUris: string[], loadDictionary: DictionaryLoader) {
    super();

    if (affUris.length !== dicUris.length) {
      throw new AssertionError();
    }

    this.#affUris = affUris;
    this.#dicUris = dicUris;
    this.loadDictionary = loadDictionary;
  }

  async getSpellChecker(): Promise<SpellChecker> {
    const promises: Promise<DictrionaryResult>[] = [];

    for (let i = 0; i < this.#affUris.length; i += 1) {
      const affUri = this.#affUris[i];
      const dicUri = this.#dicUris[i];
      promises.push(this.loadDictionary(affUri, dicUri));
    }
    const dictionaries = await Promise.all(promises);
    const nspellInstance = nspell(dictionaries);
    return new NSpellChecker(nspellInstance);
  }
}
