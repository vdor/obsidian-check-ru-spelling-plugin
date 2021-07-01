'use strict';

var obsidian = require('obsidian');
var assert = require('assert');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const getDefaultSettings = () => ({
    customWords: "",
});

class SpellChekerSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Settings for checker of spelling" });
        new obsidian.Setting(containerEl)
            .setName("Custom words")
            .setDesc("Custom spelling words")
            .addText((text) => text
            .setPlaceholder("Enter words separated by comma")
            .setValue(this.plugin.settings.customWords)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            const prev = this.plugin.settings.customWords;
            this.plugin.settings.customWords = value;
            this.plugin.handleChangeCustomWords(prev, value);
            yield this.plugin.saveSettings();
        })));
    }
}

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var isBuffer = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
};

var ruleCodes_1 = ruleCodes;

var NO_CODES$1 = [];

// Parse rule codes.
function ruleCodes(flags, value) {
  var index = 0;
  var result;

  if (!value) return NO_CODES$1

  if (flags.FLAG === 'long') {
    // Creating an array of the right length immediately
    // avoiding resizes and using memory more efficiently
    result = new Array(Math.ceil(value.length / 2));

    while (index < value.length) {
      result[index / 2] = value.slice(index, index + 2);
      index += 2;
    }

    return result
  }

  return value.split(flags.FLAG === 'num' ? ',' : '')
}

var affix_1 = affix;

var push$2 = [].push;

// Relative frequencies of letters in the English language.
var alphabet = 'etaoinshrdlcumwfgypbvkjxqz'.split('');

// Expressions.
var whiteSpaceExpression$1 = /\s+/;

// Defaults.
var defaultKeyboardLayout = [
  'qwertzuop',
  'yxcvbnm',
  'qaw',
  'say',
  'wse',
  'dsx',
  'sy',
  'edr',
  'fdc',
  'dx',
  'rft',
  'gfv',
  'fc',
  'tgz',
  'hgb',
  'gv',
  'zhu',
  'jhn',
  'hb',
  'uji',
  'kjm',
  'jn',
  'iko',
  'lkm'
];

// Parse an affix file.
// eslint-disable-next-line complexity
function affix(doc) {
  var rules = Object.create(null);
  var compoundRuleCodes = Object.create(null);
  var flags = Object.create(null);
  var replacementTable = [];
  var conversion = {in: [], out: []};
  var compoundRules = [];
  var aff = doc.toString('utf8');
  var lines = [];
  var last = 0;
  var index = aff.indexOf('\n');
  var parts;
  var line;
  var ruleType;
  var count;
  var remove;
  var add;
  var source;
  var entry;
  var position;
  var rule;
  var value;
  var offset;
  var character;

  flags.KEY = [];

  // Process the affix buffer into a list of applicable lines.
  while (index > -1) {
    pushLine(aff.slice(last, index));
    last = index + 1;
    index = aff.indexOf('\n', last);
  }

  pushLine(aff.slice(last));

  // Process each line.
  index = -1;

  while (++index < lines.length) {
    line = lines[index];
    parts = line.split(whiteSpaceExpression$1);
    ruleType = parts[0];

    if (ruleType === 'REP') {
      count = index + parseInt(parts[1], 10);

      while (++index <= count) {
        parts = lines[index].split(whiteSpaceExpression$1);
        replacementTable.push([parts[1], parts[2]]);
      }

      index--;
    } else if (ruleType === 'ICONV' || ruleType === 'OCONV') {
      count = index + parseInt(parts[1], 10);
      entry = conversion[ruleType === 'ICONV' ? 'in' : 'out'];

      while (++index <= count) {
        parts = lines[index].split(whiteSpaceExpression$1);
        entry.push([new RegExp(parts[1], 'g'), parts[2]]);
      }

      index--;
    } else if (ruleType === 'COMPOUNDRULE') {
      count = index + parseInt(parts[1], 10);

      while (++index <= count) {
        rule = lines[index].split(whiteSpaceExpression$1)[1];
        position = -1;

        compoundRules.push(rule);

        while (++position < rule.length) {
          compoundRuleCodes[rule.charAt(position)] = [];
        }
      }

      index--;
    } else if (ruleType === 'PFX' || ruleType === 'SFX') {
      count = index + parseInt(parts[3], 10);

      rule = {
        type: ruleType,
        combineable: parts[2] === 'Y',
        entries: []
      };

      rules[parts[1]] = rule;

      while (++index <= count) {
        parts = lines[index].split(whiteSpaceExpression$1);
        remove = parts[2];
        add = parts[3].split('/');
        source = parts[4];

        entry = {
          add: '',
          remove: '',
          match: '',
          continuation: ruleCodes_1(flags, add[1])
        };

        if (add && add[0] !== '0') {
          entry.add = add[0];
        }

        try {
          if (remove !== '0') {
            entry.remove = ruleType === 'SFX' ? end(remove) : remove;
          }

          if (source && source !== '.') {
            entry.match = ruleType === 'SFX' ? end(source) : start(source);
          }
        } catch (_) {
          // Ignore invalid regex patterns.
          entry = null;
        }

        if (entry) {
          rule.entries.push(entry);
        }
      }

      index--;
    } else if (ruleType === 'TRY') {
      source = parts[1];
      offset = -1;
      value = [];

      while (++offset < source.length) {
        character = source.charAt(offset);

        if (character.toLowerCase() === character) {
          value.push(character);
        }
      }

      // Some dictionaries may forget a character.
      // Notably `en` forgets `j`, `x`, and `y`.
      offset = -1;

      while (++offset < alphabet.length) {
        if (source.indexOf(alphabet[offset]) < 0) {
          value.push(alphabet[offset]);
        }
      }

      flags[ruleType] = value;
    } else if (ruleType === 'KEY') {
      push$2.apply(flags[ruleType], parts[1].split('|'));
    } else if (ruleType === 'COMPOUNDMIN') {
      flags[ruleType] = Number(parts[1]);
    } else if (ruleType === 'ONLYINCOMPOUND') {
      // If we add this ONLYINCOMPOUND flag to `compoundRuleCodes`, then
      // `parseDic` will do the work of saving the list of words that are
      // compound-only.
      flags[ruleType] = parts[1];
      compoundRuleCodes[parts[1]] = [];
    } else if (
      ruleType === 'FLAG' ||
      ruleType === 'KEEPCASE' ||
      ruleType === 'NOSUGGEST' ||
      ruleType === 'WORDCHARS'
    ) {
      flags[ruleType] = parts[1];
    } else {
      // Default handling: set them for now.
      flags[ruleType] = parts[1];
    }
  }

  // Default for `COMPOUNDMIN` is `3`.
  // See `man 4 hunspell`.
  if (isNaN(flags.COMPOUNDMIN)) {
    flags.COMPOUNDMIN = 3;
  }

  if (!flags.KEY.length) {
    flags.KEY = defaultKeyboardLayout;
  }

  /* istanbul ignore if - Dictionaries seem to always have this. */
  if (!flags.TRY) {
    flags.TRY = alphabet.concat();
  }

  if (!flags.KEEPCASE) {
    flags.KEEPCASE = false;
  }

  return {
    compoundRuleCodes: compoundRuleCodes,
    replacementTable: replacementTable,
    conversion: conversion,
    compoundRules: compoundRules,
    rules: rules,
    flags: flags
  }

  function pushLine(line) {
    line = line.trim();

    // Hash can be a valid flag, so we only discard line that starts with it.
    if (line && line.charCodeAt(0) !== 35 /* `#` */) {
      lines.push(line);
    }
  }
}

// Wrap the `source` of an expression-like string so that it matches only at
// the end of a value.
function end(source) {
  return new RegExp(source + '$')
}

// Wrap the `source` of an expression-like string so that it matches only at
// the start of a value.
function start(source) {
  return new RegExp('^' + source)
}

var normalize_1 = normalize;

// Normalize `value` with patterns.
function normalize(value, patterns) {
  var index = -1;

  while (++index < patterns.length) {
    value = value.replace(patterns[index][0], patterns[index][1]);
  }

  return value
}

var flag_1 = flag;

// Check whether a word has a flag.
function flag(values, value, flags) {
  return flags && value in values && flags.indexOf(values[value]) > -1
}

var exact_1 = exact$1;

// Check spelling of `value`, exactly.
function exact$1(context, value) {
  var index = -1;

  if (context.data[value]) {
    return !flag_1(context.flags, 'ONLYINCOMPOUND', context.data[value])
  }

  // Check if this might be a compound word.
  if (value.length >= context.flags.COMPOUNDMIN) {
    while (++index < context.compoundRules.length) {
      if (context.compoundRules[index].test(value)) {
        return true
      }
    }
  }

  return false
}

var form_1 = form;

// Find a known form of `value`.
function form(context, value, all) {
  var normal = value.trim();
  var alternative;

  if (!normal) {
    return null
  }

  normal = normalize_1(normal, context.conversion.in);

  if (exact_1(context, normal)) {
    if (!all && flag_1(context.flags, 'FORBIDDENWORD', context.data[normal])) {
      return null
    }

    return normal
  }

  // Try sentence case if the value is uppercase.
  if (normal.toUpperCase() === normal) {
    alternative = normal.charAt(0) + normal.slice(1).toLowerCase();

    if (ignore(context.flags, context.data[alternative], all)) {
      return null
    }

    if (exact_1(context, alternative)) {
      return alternative
    }
  }

  // Try lowercase.
  alternative = normal.toLowerCase();

  if (alternative !== normal) {
    if (ignore(context.flags, context.data[alternative], all)) {
      return null
    }

    if (exact_1(context, alternative)) {
      return alternative
    }
  }

  return null
}

function ignore(flags, dict, all) {
  return (
    flag_1(flags, 'KEEPCASE', dict) || all || flag_1(flags, 'FORBIDDENWORD', dict)
  )
}

var correct_1 = correct;

// Check spelling of `value`.
function correct(value) {
  return Boolean(form_1(this, value))
}

var casing_1 = casing;

// Get the casing of `value`.
function casing(value) {
  var head = exact(value.charAt(0));
  var rest = value.slice(1);

  if (!rest) {
    return head
  }

  rest = exact(rest);

  if (head === rest) {
    return head
  }

  if (head === 'u' && rest === 'l') {
    return 's'
  }

  return null
}

function exact(value) {
  return value === value.toLowerCase()
    ? 'l'
    : value === value.toUpperCase()
    ? 'u'
    : null
}

var suggest_1 = suggest;

var push$1 = [].push;

// Suggest spelling for `value`.
// eslint-disable-next-line complexity
function suggest(value) {
  var self = this;
  var charAdded = {};
  var suggestions = [];
  var weighted = {};
  var memory;
  var replacement;
  var edits = [];
  var values;
  var index;
  var offset;
  var position;
  var count;
  var otherOffset;
  var otherCharacter;
  var character;
  var group;
  var before;
  var after;
  var upper;
  var insensitive;
  var firstLevel;
  var previous;
  var next;
  var nextCharacter;
  var max;
  var distance;
  var size;
  var normalized;
  var suggestion;
  var currentCase;

  value = normalize_1(value.trim(), self.conversion.in);

  if (!value || self.correct(value)) {
    return []
  }

  currentCase = casing_1(value);

  // Check the replacement table.
  index = -1;

  while (++index < self.replacementTable.length) {
    replacement = self.replacementTable[index];
    offset = value.indexOf(replacement[0]);

    while (offset > -1) {
      edits.push(value.replace(replacement[0], replacement[1]));
      offset = value.indexOf(replacement[0], offset + 1);
    }
  }

  // Check the keyboard.
  index = -1;

  while (++index < value.length) {
    character = value.charAt(index);
    before = value.slice(0, index);
    after = value.slice(index + 1);
    insensitive = character.toLowerCase();
    upper = insensitive !== character;
    charAdded = {};

    offset = -1;

    while (++offset < self.flags.KEY.length) {
      group = self.flags.KEY[offset];
      position = group.indexOf(insensitive);

      if (position < 0) {
        continue
      }

      otherOffset = -1;

      while (++otherOffset < group.length) {
        if (otherOffset !== position) {
          otherCharacter = group.charAt(otherOffset);

          if (charAdded[otherCharacter]) {
            continue
          }

          charAdded[otherCharacter] = true;

          if (upper) {
            otherCharacter = otherCharacter.toUpperCase();
          }

          edits.push(before + otherCharacter + after);
        }
      }
    }
  }

  // Check cases where one of a double character was forgotten, or one too many
  // were added, up to three “distances”.  This increases the success-rate by 2%
  // and speeds the process up by 13%.
  index = -1;
  nextCharacter = value.charAt(0);
  values = [''];
  max = 1;
  distance = 0;

  while (++index < value.length) {
    character = nextCharacter;
    nextCharacter = value.charAt(index + 1);
    before = value.slice(0, index);

    replacement = character === nextCharacter ? '' : character + character;
    offset = -1;
    count = values.length;

    while (++offset < count) {
      if (offset <= max) {
        values.push(values[offset] + replacement);
      }

      values[offset] += character;
    }

    if (++distance < 3) {
      max = values.length;
    }
  }

  push$1.apply(edits, values);

  // Ensure the capitalised and uppercase values are included.
  values = [value];
  replacement = value.toLowerCase();

  if (value === replacement || currentCase === null) {
    values.push(value.charAt(0).toUpperCase() + replacement.slice(1));
  }

  replacement = value.toUpperCase();

  if (value !== replacement) {
    values.push(replacement);
  }

  // Construct a memory object for `generate`.
  memory = {
    state: {},
    weighted: weighted,
    suggestions: suggestions
  };

  firstLevel = generate(self, memory, values, edits);

  // While there are no suggestions based on generated values with an
  // edit-distance of `1`, check the generated values, `SIZE` at a time.
  // Basically, we’re generating values with an edit-distance of `2`, but were
  // doing it in small batches because it’s such an expensive operation.
  previous = 0;
  max = Math.min(firstLevel.length, Math.pow(Math.max(15 - value.length, 3), 3));
  size = Math.max(Math.pow(10 - value.length, 3), 1);

  while (!suggestions.length && previous < max) {
    next = previous + size;
    generate(self, memory, firstLevel.slice(previous, next));
    previous = next;
  }

  // Sort the suggestions based on their weight.
  suggestions.sort(sort);

  // Normalize the output.
  values = [];
  normalized = [];
  index = -1;

  while (++index < suggestions.length) {
    suggestion = normalize_1(suggestions[index], self.conversion.out);
    replacement = suggestion.toLowerCase();

    if (normalized.indexOf(replacement) < 0) {
      values.push(suggestion);
      normalized.push(replacement);
    }
  }

  // BOOM! All done!
  return values

  function sort(a, b) {
    return sortWeight(a, b) || sortCasing(a, b) || sortAlpha(a, b)
  }

  function sortWeight(a, b) {
    return weighted[a] === weighted[b] ? 0 : weighted[a] > weighted[b] ? -1 : 1
  }

  function sortCasing(a, b) {
    var leftCasing = casing_1(a);
    var rightCasing = casing_1(b);

    return leftCasing === rightCasing
      ? 0
      : leftCasing === currentCase
      ? -1
      : rightCasing === currentCase
      ? 1
      : undefined
  }

  function sortAlpha(a, b) {
    return a.localeCompare(b)
  }
}

// Get a list of values close in edit distance to `words`.
function generate(context, memory, words, edits) {
  var characters = context.flags.TRY;
  var data = context.data;
  var flags = context.flags;
  var result = [];
  var index = -1;
  var word;
  var before;
  var character;
  var nextCharacter;
  var nextAfter;
  var nextNextAfter;
  var nextUpper;
  var currentCase;
  var position;
  var after;
  var upper;
  var inject;
  var offset;

  // Check the pre-generated edits.
  if (edits) {
    while (++index < edits.length) {
      check(edits[index], true);
    }
  }

  // Iterate over given word.
  index = -1;

  while (++index < words.length) {
    word = words[index];
    before = '';
    character = '';
    nextCharacter = word.charAt(0);
    nextAfter = word;
    nextNextAfter = word.slice(1);
    nextUpper = nextCharacter.toLowerCase() !== nextCharacter;
    currentCase = casing_1(word);
    position = -1;

    // Iterate over every character (including the end).
    while (++position <= word.length) {
      before += character;
      after = nextAfter;
      nextAfter = nextNextAfter;
      nextNextAfter = nextAfter.slice(1);
      character = nextCharacter;
      nextCharacter = word.charAt(position + 1);
      upper = nextUpper;

      if (nextCharacter) {
        nextUpper = nextCharacter.toLowerCase() !== nextCharacter;
      }

      if (nextAfter && upper !== nextUpper) {
        // Remove.
        check(before + switchCase(nextAfter));

        // Switch.
        check(
          before +
            switchCase(nextCharacter) +
            switchCase(character) +
            nextNextAfter
        );
      }

      // Remove.
      check(before + nextAfter);

      // Switch.
      if (nextAfter) {
        check(before + nextCharacter + character + nextNextAfter);
      }

      // Iterate over all possible letters.
      offset = -1;

      while (++offset < characters.length) {
        inject = characters[offset];

        // Try uppercase if the original character was uppercased.
        if (upper && inject !== inject.toUpperCase()) {
          if (currentCase !== 's') {
            check(before + inject + after);
            check(before + inject + nextAfter);
          }

          inject = inject.toUpperCase();

          check(before + inject + after);
          check(before + inject + nextAfter);
        } else {
          // Add and replace.
          check(before + inject + after);
          check(before + inject + nextAfter);
        }
      }
    }
  }

  // Return the list of generated words.
  return result

  // Check and handle a generated value.
  function check(value, double) {
    var state = memory.state[value];
    var corrected;

    if (state !== Boolean(state)) {
      result.push(value);

      corrected = form_1(context, value);
      state = corrected && !flag_1(flags, 'NOSUGGEST', data[corrected]);

      memory.state[value] = state;

      if (state) {
        memory.weighted[value] = double ? 10 : 0;
        memory.suggestions.push(value);
      }
    }

    if (state) {
      memory.weighted[value]++;
    }
  }

  function switchCase(fragment) {
    var first = fragment.charAt(0);

    return (
      (first.toLowerCase() === first
        ? first.toUpperCase()
        : first.toLowerCase()) + fragment.slice(1)
    )
  }
}

var spell_1 = spell;

// Check spelling of `word`.
function spell(word) {
  var self = this;
  var value = form_1(self, word, true);

  // Hunspell also provides `root` (root word of the input word), and `compound`
  // (whether `word` was compound).
  return {
    correct: self.correct(word),
    forbidden: Boolean(
      value && flag_1(self.flags, 'FORBIDDENWORD', self.data[value])
    ),
    warn: Boolean(value && flag_1(self.flags, 'WARN', self.data[value]))
  }
}

var apply_1 = apply;

// Apply a rule.
function apply(value, rule, rules, words) {
  var index = -1;
  var entry;
  var next;
  var continuationRule;
  var continuation;
  var position;

  while (++index < rule.entries.length) {
    entry = rule.entries[index];
    continuation = entry.continuation;
    position = -1;

    if (!entry.match || entry.match.test(value)) {
      next = entry.remove ? value.replace(entry.remove, '') : value;
      next = rule.type === 'SFX' ? next + entry.add : entry.add + next;
      words.push(next);

      if (continuation && continuation.length) {
        while (++position < continuation.length) {
          continuationRule = rules[continuation[position]];

          if (continuationRule) {
            apply(next, continuationRule, rules, words);
          }
        }
      }
    }
  }

  return words
}

var add_1$1 = add$3;

var push = [].push;

var NO_RULES = [];

// Add `rules` for `word` to the table.
function addRules(dict, word, rules) {
  var curr = dict[word];

  // Some dictionaries will list the same word multiple times with different
  // rule sets.
  if (word in dict) {
    if (curr === NO_RULES) {
      dict[word] = rules.concat();
    } else {
      push.apply(curr, rules);
    }
  } else {
    dict[word] = rules.concat();
  }
}

function add$3(dict, word, codes, options) {
  var position = -1;
  var rule;
  var offset;
  var subposition;
  var suboffset;
  var combined;
  var newWords;
  var otherNewWords;

  // Compound words.
  if (
    !('NEEDAFFIX' in options.flags) ||
    codes.indexOf(options.flags.NEEDAFFIX) < 0
  ) {
    addRules(dict, word, codes);
  }

  while (++position < codes.length) {
    rule = options.rules[codes[position]];

    if (codes[position] in options.compoundRuleCodes) {
      options.compoundRuleCodes[codes[position]].push(word);
    }

    if (rule) {
      newWords = apply_1(word, rule, options.rules, []);
      offset = -1;

      while (++offset < newWords.length) {
        if (!(newWords[offset] in dict)) {
          dict[newWords[offset]] = NO_RULES;
        }

        if (rule.combineable) {
          subposition = position;

          while (++subposition < codes.length) {
            combined = options.rules[codes[subposition]];

            if (
              combined &&
              combined.combineable &&
              rule.type !== combined.type
            ) {
              otherNewWords = apply_1(
                newWords[offset],
                combined,
                options.rules,
                []
              );
              suboffset = -1;

              while (++suboffset < otherNewWords.length) {
                if (!(otherNewWords[suboffset] in dict)) {
                  dict[otherNewWords[suboffset]] = NO_RULES;
                }
              }
            }
          }
        }
      }
    }
  }
}

var add_1 = add$2;

var NO_CODES = [];

// Add `value` to the checker.
function add$2(value, model) {
  var self = this;

  add_1$1(self.data, value, self.data[model] || NO_CODES, self);

  return self
}

var remove_1 = remove;

// Remove `value` from the checker.
function remove(value) {
  var self = this;

  delete self.data[value];

  return self
}

var wordCharacters_1 = wordCharacters;

// Get the word characters defined in affix.
function wordCharacters() {
  return this.flags.WORDCHARS || null
}

var dictionary$1 = parse;

// Expressions.
var whiteSpaceExpression = /\s/g;

// Parse a dictionary.
function parse(buf, options, dict) {
  // Parse as lines (ignoring the first line).
  var value = buf.toString('utf8');
  var last = value.indexOf('\n') + 1;
  var index = value.indexOf('\n', last);

  while (index > -1) {
    // Some dictionaries use tabs as comments.
    if (value.charCodeAt(last) !== 9 /* `\t` */) {
      parseLine(value.slice(last, index), options, dict);
    }

    last = index + 1;
    index = value.indexOf('\n', last);
  }

  parseLine(value.slice(last), options, dict);
}

// Parse a line in dictionary.
function parseLine(line, options, dict) {
  var slashOffset = line.indexOf('/');
  var hashOffset = line.indexOf('#');
  var codes = '';
  var word;
  var result;

  // Find offsets.
  while (
    slashOffset > -1 &&
    line.charCodeAt(slashOffset - 1) === 92 /* `\` */
  ) {
    line = line.slice(0, slashOffset - 1) + line.slice(slashOffset);
    slashOffset = line.indexOf('/', slashOffset);
  }

  // Handle hash and slash offsets.
  // Note that hash can be a valid flag, so we should not just discard
  // everything after it.
  if (hashOffset > -1) {
    if (slashOffset > -1 && slashOffset < hashOffset) {
      word = line.slice(0, slashOffset);
      whiteSpaceExpression.lastIndex = slashOffset + 1;
      result = whiteSpaceExpression.exec(line);
      codes = line.slice(slashOffset + 1, result ? result.index : undefined);
    } else {
      word = line.slice(0, hashOffset);
    }
  } else if (slashOffset > -1) {
    word = line.slice(0, slashOffset);
    codes = line.slice(slashOffset + 1);
  } else {
    word = line;
  }

  word = word.trim();

  if (word) {
    add_1$1(dict, word, ruleCodes_1(options.flags, codes.trim()), options);
  }
}

var dictionary = add$1;

// Add a dictionary file.
function add$1(buf) {
  var self = this;
  var index = -1;
  var rule;
  var source;
  var character;
  var offset;

  dictionary$1(buf, self, self.data);

  // Regenerate compound expressions.
  while (++index < self.compoundRules.length) {
    rule = self.compoundRules[index];
    source = '';
    offset = -1;

    while (++offset < rule.length) {
      character = rule.charAt(offset);
      source += self.compoundRuleCodes[character].length
        ? '(?:' + self.compoundRuleCodes[character].join('|') + ')'
        : character;
    }

    self.compoundRules[index] = new RegExp(source, 'i');
  }

  return self
}

var personal = add;

// Add a dictionary.
function add(buf) {
  var self = this;
  var lines = buf.toString('utf8').split('\n');
  var index = -1;
  var line;
  var forbidden;
  var word;
  var flag;

  // Ensure there’s a key for `FORBIDDENWORD`: `false` cannot be set through an
  // affix file so its safe to use as a magic constant.
  if (self.flags.FORBIDDENWORD === undefined) self.flags.FORBIDDENWORD = false;
  flag = self.flags.FORBIDDENWORD;

  while (++index < lines.length) {
    line = lines[index].trim();

    if (!line) {
      continue
    }

    line = line.split('/');
    word = line[0];
    forbidden = word.charAt(0) === '*';

    if (forbidden) {
      word = word.slice(1);
    }

    self.add(word, line[1]);

    if (forbidden) {
      self.data[word].push(flag);
    }
  }

  return self
}

var lib = NSpell;

var proto = NSpell.prototype;

proto.correct = correct_1;
proto.suggest = suggest_1;
proto.spell = spell_1;
proto.add = add_1;
proto.remove = remove_1;
proto.wordCharacters = wordCharacters_1;
proto.dictionary = dictionary;
proto.personal = personal;

// Construct a new spelling context.
function NSpell(aff, dic) {
  var index = -1;
  var dictionaries;

  if (!(this instanceof NSpell)) {
    return new NSpell(aff, dic)
  }

  if (typeof aff === 'string' || isBuffer(aff)) {
    if (typeof dic === 'string' || isBuffer(dic)) {
      dictionaries = [{dic: dic}];
    }
  } else if (aff) {
    if ('length' in aff) {
      dictionaries = aff;
      aff = aff[0] && aff[0].aff;
    } else {
      if (aff.dic) {
        dictionaries = [aff];
      }

      aff = aff.aff;
    }
  }

  if (!aff) {
    throw new Error('Missing `aff` in dictionary')
  }

  aff = affix_1(aff);

  this.data = Object.create(null);
  this.compoundRuleCodes = aff.compoundRuleCodes;
  this.replacementTable = aff.replacementTable;
  this.conversion = aff.conversion;
  this.compoundRules = aff.compoundRules;
  this.rules = aff.rules;
  this.flags = aff.flags;

  if (dictionaries) {
    while (++index < dictionaries.length) {
      if (dictionaries[index].dic) {
        this.dictionary(dictionaries[index].dic);
      }
    }
  }
}

class SpellChecker {
}

class NSpellChecker extends SpellChecker {
    constructor(nSpell) {
        super();
        this.nSpell = nSpell;
    }
    ;
    addWord(word) {
        this.nSpell.add(word);
        return Promise.resolve();
    }
    addWords(words) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(words.map(word => this.addWord(word)));
        });
    }
    removeWord(word) {
        this.nSpell.remove(word);
        return Promise.resolve();
    }
    removeWords(words) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(words.map(word => this.removeWord(word)));
        });
    }
    suggest(word) {
        return Promise.resolve(this.nSpell.suggest(word));
    }
    correct(word) {
        return Promise.resolve(this.nSpell.correct(word));
    }
}

class SpellCheckerFactory {
}
class NSpellCheckerFactory extends SpellCheckerFactory {
    constructor(affUris, dicUris, loadDictionary) {
        super();
        if (affUris.length !== dicUris.length) {
            throw new assert.AssertionError();
        }
        this._affUris = affUris;
        this._dicUris = dicUris;
        this.loadDictionary = loadDictionary;
    }
    getSpellChecker() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            for (let i = 0; i < this._affUris.length; i++) {
                const affUri = this._affUris[i];
                const dicUri = this._dicUris[i];
                promises.push(this.loadDictionary(affUri, dicUri));
            }
            const dictionaries = yield Promise.all(promises);
            const nspellInstance = lib(dictionaries);
            return new NSpellChecker(nspellInstance);
        });
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}

function loadFile(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(uri);
        const aBuf = yield res.arrayBuffer();
        return Buffer.from(aBuf);
    });
}
function load(affUri, dicUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const [aff, dic] = yield Promise.all([loadFile(affUri), loadFile(dicUri)]);
        const result = {
            aff,
            dic,
        };
        return result;
    });
}

function stOfrWordsToArray(words) {
    return words
        .split(",")
        .map((w) => w.trim())
        .filter((w) => w);
}

const textRegexp = /^[А-я-]+$/;
class SpellChekerPlugin extends obsidian.Plugin {
    constructor(app, manifest) {
        super(app, manifest);
        this.markers = [];
        this.attachCodeMirror = (cm) => {
            if (this.cm != null) {
                this.cm.off("change", this.checkSpellingOverEditorDebounced);
            }
            this.cm = cm;
            this.cm.on("change", this.checkSpellingOverEditorDebounced);
            this.checkSpellingOverEditorDebounced();
        };
        this.handleChangeCustomWords = (prevWords, newWords) => __awaiter(this, void 0, void 0, function* () {
            yield this.spellChecker.removeWords(stOfrWordsToArray(prevWords));
            yield this.spellChecker.addWords(stOfrWordsToArray(newWords));
            this.checkSpellingOverEditorDebounced();
        });
        this.checkSpellingOverEditor = () => __awaiter(this, void 0, void 0, function* () {
            if (this.cm == null) {
                return;
            }
            this.markers.forEach((m) => {
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
                    const isValid = yield this.spellChecker.correct(currentWord);
                    if (!isValid) {
                        const startPos = posChar - currentWord.length - 1;
                        const endPos = posChar;
                        const m = this.cm.markText({ ch: startPos, line }, { ch: endPos, line }, { className: "spelling-error" });
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
        });
        this.checkSpellingOverEditorDebounced = debounce(this.checkSpellingOverEditor, 1000, false);
        this.spellCheckerFactory = new NSpellCheckerFactory([
            "https://raw.githubusercontent.com/wooorm/dictionaries/main/dictionaries/ru/index.aff",
        ], [
            "https://raw.githubusercontent.com/wooorm/dictionaries/main/dictionaries/ru/index.dic",
        ], load);
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                yield this.loadSettings(),
                (this.spellChecker = yield this.spellCheckerFactory.getSpellChecker()),
            ]);
            const customWords = stOfrWordsToArray(this.settings.customWords);
            yield this.spellChecker.addWords(customWords);
            this.registerCodeMirror(this.attachCodeMirror);
            this.addSettingTab(new SpellChekerSettingTab(this.app, this));
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign(getDefaultSettings(), yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}

module.exports = SpellChekerPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9jb3JlL3NldHRpbmdzLnRzIiwic3JjL2NvcmUvc2V0dGluZ1RhYi50cyIsIm5vZGVfbW9kdWxlcy9pcy1idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi91dGlsL3J1bGUtY29kZXMuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi91dGlsL2FmZml4LmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9ub3JtYWxpemUuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi91dGlsL2ZsYWcuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi91dGlsL2V4YWN0LmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9mb3JtLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvY29ycmVjdC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3V0aWwvY2FzaW5nLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvc3VnZ2VzdC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3NwZWxsLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9hcHBseS5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3V0aWwvYWRkLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvYWRkLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvcmVtb3ZlLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvd29yZC1jaGFyYWN0ZXJzLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9kaWN0aW9uYXJ5LmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvZGljdGlvbmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3BlcnNvbmFsLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvaW5kZXguanMiLCJzcmMvc3BlbGxDaGVja2VyL2Fic3RyYWN0LnRzIiwic3JjL3NwZWxsQ2hlY2tlci9uU3BlbGxDaGVja2VyLnRzIiwic3JjL3NwZWxsQ2hlY2tlci9mYWN0b3J5LnRzIiwic3JjL3V0aWxzL2RlYm91bmNlLnRzIiwic3JjL3V0aWxzL2RpY3Rpb25hcmllcy50cyIsInNyYy91dGlscy93b3Jkcy50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIk5PX0NPREVTIiwicHVzaCIsIndoaXRlU3BhY2VFeHByZXNzaW9uIiwicGFyc2UiLCJleGFjdCIsImZsYWciLCJub3JtYWxpemUiLCJmb3JtIiwiY2FzaW5nIiwiYWRkIiwiYXBwbHkiLCJwYXJzZUNvZGVzIiwicmVxdWlyZSQkMCIsInJlcXVpcmUkJDEiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyIsInJlcXVpcmUkJDQiLCJyZXF1aXJlJCQ1IiwicmVxdWlyZSQkNiIsInJlcXVpcmUkJDciLCJidWZmZXIiLCJhZmZpeCIsIkFzc2VydGlvbkVycm9yIiwibnNwZWxsIiwiUGx1Z2luIiwibG9hZERpY3Rpb25hcnkiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FB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
