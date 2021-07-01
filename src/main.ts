import { App, Plugin, PluginManifest } from "obsidian";

import SpellChekerSettingTab from "./core/settingTab";
import SpellChecker from "./spellChecker/abstract";
import {
  NSpellCheckerFactory,
  SpellCheckerFactory,
} from "./spellChecker/factory";
import { debounce } from "./utils/debounce";
import loadDictionary from "./utils/dictionaries";
import { stOfrWordsToArray } from "./utils/words";

interface SpellChekerPluginSettings {
  customWords: string;
}

const DEFAULT_SETTINGS: SpellChekerPluginSettings = {
  customWords: "",
};

const textRegexp = /^[А-я-]+$/;

export default class SpellChekerPlugin extends Plugin {
  settings: SpellChekerPluginSettings;
  cm: CodeMirror.Editor;
  markers: any[] = [];
  customWords: string[];
  dialog: Node | null;

  spellChecker: SpellChecker;
  spellCheckerFactory: SpellCheckerFactory;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.spellCheckerFactory = new NSpellCheckerFactory(
      [
        "https://raw.githubusercontent.com/wooorm/dictionaries/main/dictionaries/ru/index.aff",
      ],
      [
        "https://raw.githubusercontent.com/wooorm/dictionaries/main/dictionaries/ru/index.dic",
      ],
      loadDictionary
    );
  }

  async onload() {
    await Promise.all([
      await this.loadSettings(),
      (this.spellChecker = await this.spellCheckerFactory.getSpellChecker()),
    ]);
    const customWords = stOfrWordsToArray(this.settings.customWords);
    await this.spellChecker.addWords(customWords);

    this.registerCodeMirror(this.attachCodeMirror);
    this.addSettingTab(new SpellChekerSettingTab(this.app, this));
  }

  attachCodeMirror = (cm: CodeMirror.Editor) => {
    if (this.cm != null) {
      this.cm.off('change', this.checkSpellingOverEditorDebounced);
    }
  
    this.cm = cm;
    this.cm.on("change", this.checkSpellingOverEditorDebounced);
    this.checkSpellingOverEditorDebounced();
  };

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  handleChangeCustomWords = async (prevWords: string, newWords: string) => {
    await this.spellChecker.removeWords(stOfrWordsToArray(prevWords));
    await this.spellChecker.addWords(stOfrWordsToArray(newWords));
  };

  checkSpellingOverEditor = async () => {
    if (this.cm == null) {
      return;
    }

    this.markers.forEach((m: any) => {
      m.clear();
    });

    this.markers = [];

    const text = this.cm.getValue();
    let currentWord = "";

    let line = 0;
    let posChar = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (textRegexp.test(char)) {
        currentWord += char;
        posChar += 1;
        continue;
      }

      if (currentWord.length !== 0 && !currentWord.includes("-")) {
        const isValid = await this.spellChecker.correct(currentWord);

        if (!isValid) {
          const startPos = posChar - currentWord.length - 1;
          const endPos = posChar;
          const m = this.cm.markText(
            { ch: startPos, line },
            { ch: endPos, line },
            { className: "spelling-error" }
          );
          this.markers.push(m);
        }
      }

      posChar += 1;

      if (char === "\n") {
        posChar = 0;
        line += 1;
      }

      currentWord = "";
    }
  };

  checkSpellingOverEditorDebounced = debounce(this.checkSpellingOverEditor, 1000, false);
}
