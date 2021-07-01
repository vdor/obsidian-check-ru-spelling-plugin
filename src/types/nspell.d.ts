declare module 'nspell' {
  export default function (dict: any) : Nspell;
}

interface Nspell {
  correct: (text: string) => boolean;
  suggest: (text: string) => string[];
  add: (text: string) => void;
  remove: (text: string) => void;
}
