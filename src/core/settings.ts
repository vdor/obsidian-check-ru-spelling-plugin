export interface SpellChekerPluginSettings {
  customWords: string;
}

export const getDefaultSettings = () : SpellChekerPluginSettings => ({
  customWords: '',
});
