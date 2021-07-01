import {
  App,
  PluginSettingTab,
  Setting,
  Plugin
} from "obsidian";
import { SpellChekerPluginSettings } from './settings';

interface CustomPlugin extends Plugin {
  settings: SpellChekerPluginSettings;
  handleChangeCustomWords: (prevWords: string, newWords: string) => void;
  saveSettings: () => Promise<void>;
}

export default class SpellChekerSettingTab extends PluginSettingTab {
  plugin: CustomPlugin;

  constructor(app: App, plugin: CustomPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for checker of spellings." });

    new Setting(containerEl)
      .setName("Custom words")
      .setDesc("Custom spelling words")
      .addText((text) =>
        text
          .setPlaceholder("Enter words separated by comma")
          .setValue(this.plugin.settings.customWords)
          .onChange(async (value) => {
            const prev = this.plugin.settings.customWords;
            this.plugin.settings.customWords = value;
            this.plugin.handleChangeCustomWords(prev, value);
            await this.plugin.saveSettings();
          })
      );
  }
}
