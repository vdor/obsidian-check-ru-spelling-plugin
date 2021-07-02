export function stOfrWordsToArray(words: string): string[] {
  return words
    .split(',')
    .map((w) => w.trim())
    .filter((w) => w);
}
