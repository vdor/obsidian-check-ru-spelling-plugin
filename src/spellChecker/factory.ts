import { AssertionError } from "assert";
import nspell from "nspell";
import { DictrionaryResult } from "src/types/dictionary";
import SpellChecker from 'src/spellChecker/abstract';
import NSpellChecker from 'src/spellChecker/nSpellChecker';

export abstract class SpellCheckerFactory {
  abstract getSpellChecker(): Promise<SpellChecker>;
}

type DictionaryLoader = (affUri: string, dicUri: string) => Promise<DictrionaryResult>;

export class NSpellCheckerFactory extends SpellCheckerFactory {
  _affUris: string[];
  _dicUris: string[];
  loadDictionary: DictionaryLoader;

  constructor(affUris: string[], dicUris: string[], loadDictionary: DictionaryLoader) {
    super();

    if (affUris.length !== dicUris.length) {
      throw new AssertionError();
    }

    this._affUris = affUris;
    this._dicUris = dicUris;
    this.loadDictionary = loadDictionary;
  }

  async getSpellChecker(): Promise<SpellChecker> {
    const promises: Promise<DictrionaryResult>[] = [];

    for (let i = 0; i < this._affUris.length; i++) {
      const affUri = this._affUris[i];
      const dicUri = this._dicUris[i];
      promises.push(this.loadDictionary(affUri, dicUri));
    }
    const dictionaries = await Promise.all(promises);
    const nspellInstance = nspell(dictionaries);
    return new NSpellChecker(nspellInstance);
  }
}
