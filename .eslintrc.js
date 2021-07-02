module.exports = {
  extends: ['airbnb-typescript/base'],
  parserOptions: {
      project: './tsconfig.json',
  },
  rules: {
    "import/prefer-default-export": "off",
    "max-classes-per-file": "off",
    "no-continue": "off"
  }
};
