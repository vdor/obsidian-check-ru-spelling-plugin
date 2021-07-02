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

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

const getDefaultSettings = () => ({
    customWords: '',
});

class SpellChekerSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for checker of spelling' });
        new obsidian.Setting(containerEl)
            .setName('Custom words')
            .setDesc('Custom spelling words')
            .addText((text) => text
            .setPlaceholder('Enter words separated by comma')
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
    addWord(word) {
        this.nSpell.add(word);
        return Promise.resolve();
    }
    addWords(words) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(words.map((word) => this.addWord(word)));
        });
    }
    removeWord(word) {
        this.nSpell.remove(word);
        return Promise.resolve();
    }
    removeWords(words) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(words.map((word) => this.removeWord(word)));
        });
    }
    suggest(word) {
        return Promise.resolve(this.nSpell.suggest(word));
    }
    correct(word) {
        return Promise.resolve(this.nSpell.correct(word));
    }
}

var _NSpellCheckerFactory_affUris, _NSpellCheckerFactory_dicUris;
class SpellCheckerFactory {
}
class NSpellCheckerFactory extends SpellCheckerFactory {
    constructor(affUris, dicUris, loadDictionary) {
        super();
        _NSpellCheckerFactory_affUris.set(this, void 0);
        _NSpellCheckerFactory_dicUris.set(this, void 0);
        if (affUris.length !== dicUris.length) {
            throw new assert.AssertionError();
        }
        __classPrivateFieldSet(this, _NSpellCheckerFactory_affUris, affUris, "f");
        __classPrivateFieldSet(this, _NSpellCheckerFactory_dicUris, dicUris, "f");
        this.loadDictionary = loadDictionary;
    }
    getSpellChecker() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            for (let i = 0; i < __classPrivateFieldGet(this, _NSpellCheckerFactory_affUris, "f").length; i += 1) {
                const affUri = __classPrivateFieldGet(this, _NSpellCheckerFactory_affUris, "f")[i];
                const dicUri = __classPrivateFieldGet(this, _NSpellCheckerFactory_dicUris, "f")[i];
                promises.push(this.loadDictionary(affUri, dicUri));
            }
            const dictionaries = yield Promise.all(promises);
            const nspellInstance = lib(dictionaries);
            return new NSpellChecker(nspellInstance);
        });
    }
}
_NSpellCheckerFactory_affUris = new WeakMap(), _NSpellCheckerFactory_dicUris = new WeakMap();

function debounce(func, wait, immediate) {
    let timeout;
    return function debounced(...args) {
        const context = this;
        const later = function f() {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        const callNow = immediate && !timeout;
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
        .split(',')
        .map((w) => w.trim())
        .filter((w) => w);
}

var _SpellChekerPlugin_cm, _SpellChekerPlugin_markers, _SpellChekerPlugin_spellChecker, _SpellChekerPlugin_spellCheckerFactory;
const textRegexp = /^[А-я-]+$/;
class SpellChekerPlugin extends obsidian.Plugin {
    constructor(app, manifest) {
        super(app, manifest);
        _SpellChekerPlugin_cm.set(this, void 0);
        _SpellChekerPlugin_markers.set(this, []);
        _SpellChekerPlugin_spellChecker.set(this, void 0);
        _SpellChekerPlugin_spellCheckerFactory.set(this, void 0);
        this.attachCodeMirror = (cm) => {
            if (__classPrivateFieldGet(this, _SpellChekerPlugin_cm, "f") != null) {
                __classPrivateFieldGet(this, _SpellChekerPlugin_cm, "f").off('change', this.checkSpellingOverEditorDebounced);
            }
            __classPrivateFieldSet(this, _SpellChekerPlugin_cm, cm, "f");
            __classPrivateFieldGet(this, _SpellChekerPlugin_cm, "f").on('change', this.checkSpellingOverEditorDebounced);
            this.checkSpellingOverEditorDebounced();
        };
        this.handleChangeCustomWords = (prevWords, newWords) => __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _SpellChekerPlugin_spellChecker, "f").removeWords(stOfrWordsToArray(prevWords));
            yield __classPrivateFieldGet(this, _SpellChekerPlugin_spellChecker, "f").addWords(stOfrWordsToArray(newWords));
            this.checkSpellingOverEditorDebounced();
        });
        this.checkSpellingOverEditor = () => __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _SpellChekerPlugin_cm, "f") == null) {
                return;
            }
            __classPrivateFieldGet(this, _SpellChekerPlugin_markers, "f").forEach((m) => {
                m.clear();
            });
            __classPrivateFieldSet(this, _SpellChekerPlugin_markers, [], "f");
            const text = __classPrivateFieldGet(this, _SpellChekerPlugin_cm, "f").getValue();
            let currentWord = '';
            let line = 0;
            let posChar = 0;
            for (let i = 0; i < text.length; i += 1) {
                const char = text[i];
                if (textRegexp.test(char)) {
                    currentWord += char;
                    posChar += 1;
                    continue;
                }
                if (currentWord.length !== 0 && !currentWord.includes('-')) {
                    // eslint-disable-next-line no-await-in-loop
                    const isValid = yield __classPrivateFieldGet(this, _SpellChekerPlugin_spellChecker, "f").correct(currentWord);
                    if (!isValid) {
                        const startPos = posChar - currentWord.length - 1;
                        const endPos = posChar;
                        const m = __classPrivateFieldGet(this, _SpellChekerPlugin_cm, "f").markText({ ch: startPos, line }, { ch: endPos, line }, { className: 'spelling-error' });
                        __classPrivateFieldGet(this, _SpellChekerPlugin_markers, "f").push(m);
                    }
                }
                posChar += 1;
                if (char === '\n') {
                    posChar = 0;
                    line += 1;
                }
                currentWord = '';
            }
        });
        this.checkSpellingOverEditorDebounced = debounce(this.checkSpellingOverEditor, 1000, false);
        __classPrivateFieldSet(this, _SpellChekerPlugin_spellCheckerFactory, new NSpellCheckerFactory([
            'https://raw.githubusercontent.com/wooorm/dictionaries/main/dictionaries/ru/index.aff',
        ], [
            'https://raw.githubusercontent.com/wooorm/dictionaries/main/dictionaries/ru/index.dic',
        ], load), "f");
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                yield this.loadSettings(),
                (__classPrivateFieldSet(this, _SpellChekerPlugin_spellChecker, yield __classPrivateFieldGet(this, _SpellChekerPlugin_spellCheckerFactory, "f").getSpellChecker(), "f")),
            ]);
            const customWords = stOfrWordsToArray(this.settings.customWords);
            yield __classPrivateFieldGet(this, _SpellChekerPlugin_spellChecker, "f").addWords(customWords);
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
_SpellChekerPlugin_cm = new WeakMap(), _SpellChekerPlugin_markers = new WeakMap(), _SpellChekerPlugin_spellChecker = new WeakMap(), _SpellChekerPlugin_spellCheckerFactory = new WeakMap();

module.exports = SpellChekerPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9jb3JlL3NldHRpbmdzLnRzIiwic3JjL2NvcmUvc2V0dGluZ1RhYi50cyIsIm5vZGVfbW9kdWxlcy9pcy1idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi91dGlsL3J1bGUtY29kZXMuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi91dGlsL2FmZml4LmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9ub3JtYWxpemUuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi91dGlsL2ZsYWcuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi91dGlsL2V4YWN0LmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9mb3JtLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvY29ycmVjdC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3V0aWwvY2FzaW5nLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvc3VnZ2VzdC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3NwZWxsLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9hcHBseS5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3V0aWwvYWRkLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvYWRkLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvcmVtb3ZlLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvd29yZC1jaGFyYWN0ZXJzLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9kaWN0aW9uYXJ5LmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvZGljdGlvbmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3BlcnNvbmFsLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvaW5kZXguanMiLCJzcmMvc3BlbGxDaGVja2VyL2Fic3RyYWN0LnRzIiwic3JjL3NwZWxsQ2hlY2tlci9uU3BlbGxDaGVja2VyLnRzIiwic3JjL3NwZWxsQ2hlY2tlci9mYWN0b3J5LnRzIiwic3JjL3V0aWxzL2RlYm91bmNlLnRzIiwic3JjL3V0aWxzL2RpY3Rpb25hcmllcy50cyIsInNyYy91dGlscy93b3Jkcy50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIk5PX0NPREVTIiwicHVzaCIsIndoaXRlU3BhY2VFeHByZXNzaW9uIiwicGFyc2UiLCJleGFjdCIsImZsYWciLCJub3JtYWxpemUiLCJmb3JtIiwiY2FzaW5nIiwiYWRkIiwiYXBwbHkiLCJwYXJzZUNvZGVzIiwicmVxdWlyZSQkMCIsInJlcXVpcmUkJDEiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyIsInJlcXVpcmUkJDQiLCJyZXF1aXJlJCQ1IiwicmVxdWlyZSQkNiIsInJlcXVpcmUkJDciLCJidWZmZXIiLCJhZmZpeCIsIkFzc2VydGlvbkVycm9yIiwibnNwZWxsIiwiUGx1Z2luIiwibG9hZERpY3Rpb25hcnkiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBcUpEO0FBQ08sU0FBUyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDakUsSUFBSSxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0FBQ2pHLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxVQUFVLEdBQUcsUUFBUSxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQywwRUFBMEUsQ0FBQyxDQUFDO0FBQ3ZMLElBQUksT0FBTyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsRyxDQUFDO0FBQ0Q7QUFDTyxTQUFTLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDeEUsSUFBSSxJQUFJLElBQUksS0FBSyxHQUFHLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQzVFLElBQUksSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsK0NBQStDLENBQUMsQ0FBQztBQUNqRyxJQUFJLElBQUksT0FBTyxLQUFLLEtBQUssVUFBVSxHQUFHLFFBQVEsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMseUVBQXlFLENBQUMsQ0FBQztBQUN0TCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDOUc7O0FDMU9PLE1BQU0sa0JBQWtCLEdBQUcsT0FBbUM7SUFDbkUsV0FBVyxFQUFFLEVBQUU7Q0FDaEIsQ0FBQzs7TUNRbUIscUJBQXNCLFNBQVFBLHlCQUFnQjtJQUdqRSxZQUFZLEdBQVEsRUFBRSxNQUFvQjtRQUN4QyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ3RCO0lBRUQsT0FBTztRQUNMLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFN0IsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXBCLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLGtDQUFrQyxFQUFFLENBQUMsQ0FBQztRQUV6RSxJQUFJQyxnQkFBTyxDQUFDLFdBQVcsQ0FBQzthQUNyQixPQUFPLENBQUMsY0FBYyxDQUFDO2FBQ3ZCLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQzthQUNoQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSTthQUNwQixjQUFjLENBQUMsZ0NBQWdDLENBQUM7YUFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQzthQUMxQyxRQUFRLENBQUMsQ0FBTyxLQUFLO1lBQ3BCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztZQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2pELE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUNsQyxDQUFBLENBQUMsQ0FBQyxDQUFDO0tBQ1Q7Ozs7Ozs7OztBQ2xDSCxZQUFjLEdBQUcsU0FBUyxRQUFRLEVBQUUsR0FBRyxFQUFFO0FBQ3pDLEVBQUUsT0FBTyxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxXQUFXLElBQUksSUFBSTtBQUMvQyxJQUFJLE9BQU8sR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEtBQUssVUFBVSxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztBQUNuRjs7QUNSQSxlQUFjLEdBQUcsVUFBUztBQUMxQjtBQUNBLElBQUlDLFVBQVEsR0FBRyxHQUFFO0FBQ2pCO0FBQ0E7QUFDQSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ2pDLEVBQUUsSUFBSSxLQUFLLEdBQUcsRUFBQztBQUNmLEVBQUUsSUFBSSxPQUFNO0FBQ1o7QUFDQSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBT0EsVUFBUTtBQUM3QjtBQUNBLEVBQUUsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtBQUM3QjtBQUNBO0FBQ0EsSUFBSSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFDO0FBQ25EO0FBQ0EsSUFBSSxPQUFPLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ2pDLE1BQU0sTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFDO0FBQ3ZELE1BQU0sS0FBSyxJQUFJLEVBQUM7QUFDaEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLE1BQU07QUFDakIsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNyRDs7QUN2QkEsV0FBYyxHQUFHLE1BQUs7QUFDdEI7QUFDQSxJQUFJQyxNQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUk7QUFDbEI7QUFDQTtBQUNBLElBQUksUUFBUSxHQUFHLDRCQUE0QixDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUM7QUFDckQ7QUFDQTtBQUNBLElBQUlDLHNCQUFvQixHQUFHLE1BQUs7QUFDaEM7QUFDQTtBQUNBLElBQUkscUJBQXFCLEdBQUc7QUFDNUIsRUFBRSxXQUFXO0FBQ2IsRUFBRSxTQUFTO0FBQ1gsRUFBRSxLQUFLO0FBQ1AsRUFBRSxLQUFLO0FBQ1AsRUFBRSxLQUFLO0FBQ1AsRUFBRSxLQUFLO0FBQ1AsRUFBRSxJQUFJO0FBQ04sRUFBRSxLQUFLO0FBQ1AsRUFBRSxLQUFLO0FBQ1AsRUFBRSxJQUFJO0FBQ04sRUFBRSxLQUFLO0FBQ1AsRUFBRSxLQUFLO0FBQ1AsRUFBRSxJQUFJO0FBQ04sRUFBRSxLQUFLO0FBQ1AsRUFBRSxLQUFLO0FBQ1AsRUFBRSxJQUFJO0FBQ04sRUFBRSxLQUFLO0FBQ1AsRUFBRSxLQUFLO0FBQ1AsRUFBRSxJQUFJO0FBQ04sRUFBRSxLQUFLO0FBQ1AsRUFBRSxLQUFLO0FBQ1AsRUFBRSxJQUFJO0FBQ04sRUFBRSxLQUFLO0FBQ1AsRUFBRSxLQUFLO0FBQ1AsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFNBQVMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNwQixFQUFFLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFDO0FBQ2pDLEVBQUUsSUFBSSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQztBQUM3QyxFQUFFLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFDO0FBQ2pDLEVBQUUsSUFBSSxnQkFBZ0IsR0FBRyxHQUFFO0FBQzNCLEVBQUUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUM7QUFDcEMsRUFBRSxJQUFJLGFBQWEsR0FBRyxHQUFFO0FBQ3hCLEVBQUUsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUM7QUFDaEMsRUFBRSxJQUFJLEtBQUssR0FBRyxHQUFFO0FBQ2hCLEVBQUUsSUFBSSxJQUFJLEdBQUcsRUFBQztBQUNkLEVBQUUsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUM7QUFDL0IsRUFBRSxJQUFJLE1BQUs7QUFDWCxFQUFFLElBQUksS0FBSTtBQUNWLEVBQUUsSUFBSSxTQUFRO0FBQ2QsRUFBRSxJQUFJLE1BQUs7QUFDWCxFQUFFLElBQUksT0FBTTtBQUNaLEVBQUUsSUFBSSxJQUFHO0FBQ1QsRUFBRSxJQUFJLE9BQU07QUFDWixFQUFFLElBQUksTUFBSztBQUNYLEVBQUUsSUFBSSxTQUFRO0FBQ2QsRUFBRSxJQUFJLEtBQUk7QUFDVixFQUFFLElBQUksTUFBSztBQUNYLEVBQUUsSUFBSSxPQUFNO0FBQ1osRUFBRSxJQUFJLFVBQVM7QUFDZjtBQUNBLEVBQUUsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFFO0FBQ2hCO0FBQ0E7QUFDQSxFQUFFLE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ3JCLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFDO0FBQ3BDLElBQUksSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFDO0FBQ3BCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBQztBQUNuQyxHQUFHO0FBQ0g7QUFDQSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFDO0FBQzNCO0FBQ0E7QUFDQSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUM7QUFDWjtBQUNBLEVBQUUsT0FBTyxFQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ2pDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUM7QUFDdkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQ0Esc0JBQW9CLEVBQUM7QUFDNUMsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBQztBQUN2QjtBQUNBLElBQUksSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFO0FBQzVCLE1BQU0sS0FBSyxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQztBQUM1QztBQUNBLE1BQU0sT0FBTyxFQUFFLEtBQUssSUFBSSxLQUFLLEVBQUU7QUFDL0IsUUFBUSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQ0Esc0JBQW9CLEVBQUM7QUFDeEQsUUFBUSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDbkQsT0FBTztBQUNQO0FBQ0EsTUFBTSxLQUFLLEdBQUU7QUFDYixLQUFLLE1BQU0sSUFBSSxRQUFRLEtBQUssT0FBTyxJQUFJLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFDN0QsTUFBTSxLQUFLLEdBQUcsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFDO0FBQzVDLE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxRQUFRLEtBQUssT0FBTyxHQUFHLElBQUksR0FBRyxLQUFLLEVBQUM7QUFDN0Q7QUFDQSxNQUFNLE9BQU8sRUFBRSxLQUFLLElBQUksS0FBSyxFQUFFO0FBQy9CLFFBQVEsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUNBLHNCQUFvQixFQUFDO0FBQ3hELFFBQVEsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN6RCxPQUFPO0FBQ1A7QUFDQSxNQUFNLEtBQUssR0FBRTtBQUNiLEtBQUssTUFBTSxJQUFJLFFBQVEsS0FBSyxjQUFjLEVBQUU7QUFDNUMsTUFBTSxLQUFLLEdBQUcsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFDO0FBQzVDO0FBQ0EsTUFBTSxPQUFPLEVBQUUsS0FBSyxJQUFJLEtBQUssRUFBRTtBQUMvQixRQUFRLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDQSxzQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUMxRCxRQUFRLFFBQVEsR0FBRyxDQUFDLEVBQUM7QUFDckI7QUFDQSxRQUFRLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDO0FBQ2hDO0FBQ0EsUUFBUSxPQUFPLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDekMsVUFBVSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRTtBQUN2RCxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0EsTUFBTSxLQUFLLEdBQUU7QUFDYixLQUFLLE1BQU0sSUFBSSxRQUFRLEtBQUssS0FBSyxJQUFJLFFBQVEsS0FBSyxLQUFLLEVBQUU7QUFDekQsTUFBTSxLQUFLLEdBQUcsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFDO0FBQzVDO0FBQ0EsTUFBTSxJQUFJLEdBQUc7QUFDYixRQUFRLElBQUksRUFBRSxRQUFRO0FBQ3RCLFFBQVEsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHO0FBQ3JDLFFBQVEsT0FBTyxFQUFFLEVBQUU7QUFDbkIsUUFBTztBQUNQO0FBQ0EsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSTtBQUM1QjtBQUNBLE1BQU0sT0FBTyxFQUFFLEtBQUssSUFBSSxLQUFLLEVBQUU7QUFDL0IsUUFBUSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQ0Esc0JBQW9CLEVBQUM7QUFDeEQsUUFBUSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBQztBQUN6QixRQUFRLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBQztBQUNqQyxRQUFRLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFDO0FBQ3pCO0FBQ0EsUUFBUSxLQUFLLEdBQUc7QUFDaEIsVUFBVSxHQUFHLEVBQUUsRUFBRTtBQUNqQixVQUFVLE1BQU0sRUFBRSxFQUFFO0FBQ3BCLFVBQVUsS0FBSyxFQUFFLEVBQUU7QUFDbkIsVUFBVSxZQUFZLEVBQUVDLFdBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFVBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUNuQyxVQUFVLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBQztBQUM1QixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUk7QUFDWixVQUFVLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRTtBQUM5QixZQUFZLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxLQUFLLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsT0FBTTtBQUNwRSxXQUFXO0FBQ1g7QUFDQSxVQUFVLElBQUksTUFBTSxJQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUU7QUFDeEMsWUFBWSxLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsS0FBSyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUM7QUFDMUUsV0FBVztBQUNYLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNwQjtBQUNBLFVBQVUsS0FBSyxHQUFHLEtBQUk7QUFDdEIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLEtBQUssRUFBRTtBQUNuQixVQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQztBQUNsQyxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0EsTUFBTSxLQUFLLEdBQUU7QUFDYixLQUFLLE1BQU0sSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFO0FBQ25DLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUM7QUFDdkIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxFQUFDO0FBQ2pCLE1BQU0sS0FBSyxHQUFHLEdBQUU7QUFDaEI7QUFDQSxNQUFNLE9BQU8sRUFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUN2QyxRQUFRLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBQztBQUN6QztBQUNBLFFBQVEsSUFBSSxTQUFTLENBQUMsV0FBVyxFQUFFLEtBQUssU0FBUyxFQUFFO0FBQ25ELFVBQVUsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUM7QUFDL0IsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxNQUFNLE1BQU0sR0FBRyxDQUFDLEVBQUM7QUFDakI7QUFDQSxNQUFNLE9BQU8sRUFBRSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRTtBQUN6QyxRQUFRLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDbEQsVUFBVSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBQztBQUN0QyxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0EsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBSztBQUM3QixLQUFLLE1BQU0sSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFO0FBQ25DLE1BQU1GLE1BQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUM7QUFDdEQsS0FBSyxNQUFNLElBQUksUUFBUSxLQUFLLGFBQWEsRUFBRTtBQUMzQyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3hDLEtBQUssTUFBTSxJQUFJLFFBQVEsS0FBSyxnQkFBZ0IsRUFBRTtBQUM5QztBQUNBO0FBQ0E7QUFDQSxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFDO0FBQ2hDLE1BQU0saUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRTtBQUN0QyxLQUFLLE1BQU07QUFDWCxNQUFNLFFBQVEsS0FBSyxNQUFNO0FBQ3pCLE1BQU0sUUFBUSxLQUFLLFVBQVU7QUFDN0IsTUFBTSxRQUFRLEtBQUssV0FBVztBQUM5QixNQUFNLFFBQVEsS0FBSyxXQUFXO0FBQzlCLE1BQU07QUFDTixNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFDO0FBQ2hDLEtBQUssTUFBTTtBQUNYO0FBQ0EsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBQztBQUNoQyxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQ2hDLElBQUksS0FBSyxDQUFDLFdBQVcsR0FBRyxFQUFDO0FBQ3pCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO0FBQ3pCLElBQUksS0FBSyxDQUFDLEdBQUcsR0FBRyxzQkFBcUI7QUFDckMsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQ2xCLElBQUksS0FBSyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFFO0FBQ2pDLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDdkIsSUFBSSxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQUs7QUFDMUIsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPO0FBQ1QsSUFBSSxpQkFBaUIsRUFBRSxpQkFBaUI7QUFDeEMsSUFBSSxnQkFBZ0IsRUFBRSxnQkFBZ0I7QUFDdEMsSUFBSSxVQUFVLEVBQUUsVUFBVTtBQUMxQixJQUFJLGFBQWEsRUFBRSxhQUFhO0FBQ2hDLElBQUksS0FBSyxFQUFFLEtBQUs7QUFDaEIsSUFBSSxLQUFLLEVBQUUsS0FBSztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRTtBQUMxQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFFO0FBQ3RCO0FBQ0E7QUFDQSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxZQUFZO0FBQ3JELE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUM7QUFDdEIsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsU0FBUyxHQUFHLENBQUMsTUFBTSxFQUFFO0FBQ3JCLEVBQUUsT0FBTyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ2pDLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxTQUFTLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDdkIsRUFBRSxPQUFPLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUM7QUFDakM7O0FDdFFBLGVBQWMsR0FBRyxVQUFTO0FBQzFCO0FBQ0E7QUFDQSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO0FBQ3BDLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFDO0FBQ2hCO0FBQ0EsRUFBRSxPQUFPLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDcEMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ2pFLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxLQUFLO0FBQ2Q7O0FDWEEsVUFBYyxHQUFHLEtBQUk7QUFDckI7QUFDQTtBQUNBLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3BDLEVBQUUsT0FBTyxLQUFLLElBQUksS0FBSyxJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0RTs7QUNIQSxXQUFjLEdBQUdHLFFBQUs7QUFDdEI7QUFDQTtBQUNBLFNBQVNBLE9BQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQy9CLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFDO0FBQ2hCO0FBQ0EsRUFBRSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDM0IsSUFBSSxPQUFPLENBQUNDLE1BQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEUsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtBQUNqRCxJQUFJLE9BQU8sRUFBRSxLQUFLLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7QUFDbkQsTUFBTSxJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3BELFFBQVEsT0FBTyxJQUFJO0FBQ25CLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLEtBQUs7QUFDZDs7QUNsQkEsVUFBYyxHQUFHLEtBQUk7QUFDckI7QUFDQTtBQUNBLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO0FBQ25DLEVBQUUsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRTtBQUMzQixFQUFFLElBQUksWUFBVztBQUNqQjtBQUNBLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLElBQUksT0FBTyxJQUFJO0FBQ2YsR0FBRztBQUNIO0FBQ0EsRUFBRSxNQUFNLEdBQUdDLFdBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUM7QUFDbkQ7QUFDQSxFQUFFLElBQUlGLE9BQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUU7QUFDOUIsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJQyxNQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO0FBQzVFLE1BQU0sT0FBTyxJQUFJO0FBQ2pCLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxNQUFNO0FBQ2pCLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRSxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLEVBQUU7QUFDdkMsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRTtBQUNsRTtBQUNBLElBQUksSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQy9ELE1BQU0sT0FBTyxJQUFJO0FBQ2pCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSUQsT0FBSyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsRUFBRTtBQUNyQyxNQUFNLE9BQU8sV0FBVztBQUN4QixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFFO0FBQ3BDO0FBQ0EsRUFBRSxJQUFJLFdBQVcsS0FBSyxNQUFNLEVBQUU7QUFDOUIsSUFBSSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDL0QsTUFBTSxPQUFPLElBQUk7QUFDakIsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJQSxPQUFLLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxFQUFFO0FBQ3JDLE1BQU0sT0FBTyxXQUFXO0FBQ3hCLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sSUFBSTtBQUNiLENBQUM7QUFDRDtBQUNBLFNBQVMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ2xDLEVBQUU7QUFDRixJQUFJQyxNQUFJLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUlBLE1BQUksQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQztBQUM5RSxHQUFHO0FBQ0g7O0FDeERBLGFBQWMsR0FBRyxRQUFPO0FBQ3hCO0FBQ0E7QUFDQSxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDeEIsRUFBRSxPQUFPLE9BQU8sQ0FBQ0UsTUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuQzs7QUNQQSxZQUFjLEdBQUcsT0FBTTtBQUN2QjtBQUNBO0FBQ0EsU0FBUyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ3ZCLEVBQUUsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDbkMsRUFBRSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQztBQUMzQjtBQUNBLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRTtBQUNiLElBQUksT0FBTyxJQUFJO0FBQ2YsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBQztBQUNwQjtBQUNBLEVBQUUsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQ3JCLElBQUksT0FBTyxJQUFJO0FBQ2YsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtBQUNwQyxJQUFJLE9BQU8sR0FBRztBQUNkLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxJQUFJO0FBQ2IsQ0FBQztBQUNEO0FBQ0EsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFO0FBQ3RCLEVBQUUsT0FBTyxLQUFLLEtBQUssS0FBSyxDQUFDLFdBQVcsRUFBRTtBQUN0QyxNQUFNLEdBQUc7QUFDVCxNQUFNLEtBQUssS0FBSyxLQUFLLENBQUMsV0FBVyxFQUFFO0FBQ25DLE1BQU0sR0FBRztBQUNULE1BQU0sSUFBSTtBQUNWOztBQ3pCQSxhQUFjLEdBQUcsUUFBTztBQUN4QjtBQUNBLElBQUlOLE1BQUksR0FBRyxFQUFFLENBQUMsS0FBSTtBQUNsQjtBQUNBO0FBQ0E7QUFDQSxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDeEIsRUFBRSxJQUFJLElBQUksR0FBRyxLQUFJO0FBQ2pCLEVBQUUsSUFBSSxTQUFTLEdBQUcsR0FBRTtBQUNwQixFQUFFLElBQUksV0FBVyxHQUFHLEdBQUU7QUFDdEIsRUFBRSxJQUFJLFFBQVEsR0FBRyxHQUFFO0FBQ25CLEVBQUUsSUFBSSxPQUFNO0FBQ1osRUFBRSxJQUFJLFlBQVc7QUFDakIsRUFBRSxJQUFJLEtBQUssR0FBRyxHQUFFO0FBQ2hCLEVBQUUsSUFBSSxPQUFNO0FBQ1osRUFBRSxJQUFJLE1BQUs7QUFDWCxFQUFFLElBQUksT0FBTTtBQUNaLEVBQUUsSUFBSSxTQUFRO0FBQ2QsRUFBRSxJQUFJLE1BQUs7QUFDWCxFQUFFLElBQUksWUFBVztBQUNqQixFQUFFLElBQUksZUFBYztBQUNwQixFQUFFLElBQUksVUFBUztBQUNmLEVBQUUsSUFBSSxNQUFLO0FBQ1gsRUFBRSxJQUFJLE9BQU07QUFDWixFQUFFLElBQUksTUFBSztBQUNYLEVBQUUsSUFBSSxNQUFLO0FBQ1gsRUFBRSxJQUFJLFlBQVc7QUFDakIsRUFBRSxJQUFJLFdBQVU7QUFDaEIsRUFBRSxJQUFJLFNBQVE7QUFDZCxFQUFFLElBQUksS0FBSTtBQUNWLEVBQUUsSUFBSSxjQUFhO0FBQ25CLEVBQUUsSUFBSSxJQUFHO0FBQ1QsRUFBRSxJQUFJLFNBQVE7QUFDZCxFQUFFLElBQUksS0FBSTtBQUNWLEVBQUUsSUFBSSxXQUFVO0FBQ2hCLEVBQUUsSUFBSSxXQUFVO0FBQ2hCLEVBQUUsSUFBSSxZQUFXO0FBQ2pCO0FBQ0EsRUFBRSxLQUFLLEdBQUdLLFdBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUM7QUFDckQ7QUFDQSxFQUFFLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNyQyxJQUFJLE9BQU8sRUFBRTtBQUNiLEdBQUc7QUFDSDtBQUNBLEVBQUUsV0FBVyxHQUFHRSxRQUFNLENBQUMsS0FBSyxFQUFDO0FBQzdCO0FBQ0E7QUFDQSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUM7QUFDWjtBQUNBLEVBQUUsT0FBTyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO0FBQ2pELElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUM7QUFDOUMsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDMUM7QUFDQSxJQUFJLE9BQU8sTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ3hCLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztBQUMvRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFDO0FBQ3hELEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBQztBQUNaO0FBQ0EsRUFBRSxPQUFPLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDakMsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUM7QUFDbkMsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFDO0FBQ2xDLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBQztBQUNsQyxJQUFJLFdBQVcsR0FBRyxTQUFTLENBQUMsV0FBVyxHQUFFO0FBQ3pDLElBQUksS0FBSyxHQUFHLFdBQVcsS0FBSyxVQUFTO0FBQ3JDLElBQUksU0FBUyxHQUFHLEdBQUU7QUFDbEI7QUFDQSxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUM7QUFDZjtBQUNBLElBQUksT0FBTyxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUU7QUFDN0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFDO0FBQ3BDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFDO0FBQzNDO0FBQ0EsTUFBTSxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7QUFDeEIsUUFBUSxRQUFRO0FBQ2hCLE9BQU87QUFDUDtBQUNBLE1BQU0sV0FBVyxHQUFHLENBQUMsRUFBQztBQUN0QjtBQUNBLE1BQU0sT0FBTyxFQUFFLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQzNDLFFBQVEsSUFBSSxXQUFXLEtBQUssUUFBUSxFQUFFO0FBQ3RDLFVBQVUsY0FBYyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFDO0FBQ3BEO0FBQ0EsVUFBVSxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUN6QyxZQUFZLFFBQVE7QUFDcEIsV0FBVztBQUNYO0FBQ0EsVUFBVSxTQUFTLENBQUMsY0FBYyxDQUFDLEdBQUcsS0FBSTtBQUMxQztBQUNBLFVBQVUsSUFBSSxLQUFLLEVBQUU7QUFDckIsWUFBWSxjQUFjLEdBQUcsY0FBYyxDQUFDLFdBQVcsR0FBRTtBQUN6RCxXQUFXO0FBQ1g7QUFDQSxVQUFVLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLGNBQWMsR0FBRyxLQUFLLEVBQUM7QUFDckQsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFDO0FBQ1osRUFBRSxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUM7QUFDakMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUM7QUFDZixFQUFFLEdBQUcsR0FBRyxFQUFDO0FBQ1QsRUFBRSxRQUFRLEdBQUcsRUFBQztBQUNkO0FBQ0EsRUFBRSxPQUFPLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDakMsSUFBSSxTQUFTLEdBQUcsY0FBYTtBQUM3QixJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUM7QUFDM0MsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFDO0FBQ2xDO0FBQ0EsSUFBSSxXQUFXLEdBQUcsU0FBUyxLQUFLLGFBQWEsR0FBRyxFQUFFLEdBQUcsU0FBUyxHQUFHLFVBQVM7QUFDMUUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFDO0FBQ2YsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU07QUFDekI7QUFDQSxJQUFJLE9BQU8sRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFO0FBQzdCLE1BQU0sSUFBSSxNQUFNLElBQUksR0FBRyxFQUFFO0FBQ3pCLFFBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsV0FBVyxFQUFDO0FBQ2pELE9BQU87QUFDUDtBQUNBLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFVBQVM7QUFDakMsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEVBQUUsUUFBUSxHQUFHLENBQUMsRUFBRTtBQUN4QixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTTtBQUN6QixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsRUFBRVAsTUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFDO0FBQzNCO0FBQ0E7QUFDQSxFQUFFLE1BQU0sR0FBRyxDQUFDLEtBQUssRUFBQztBQUNsQixFQUFFLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxHQUFFO0FBQ25DO0FBQ0EsRUFBRSxJQUFJLEtBQUssS0FBSyxXQUFXLElBQUksV0FBVyxLQUFLLElBQUksRUFBRTtBQUNyRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ3JFLEdBQUc7QUFDSDtBQUNBLEVBQUUsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUU7QUFDbkM7QUFDQSxFQUFFLElBQUksS0FBSyxLQUFLLFdBQVcsRUFBRTtBQUM3QixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFDO0FBQzVCLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRSxNQUFNLEdBQUc7QUFDWCxJQUFJLEtBQUssRUFBRSxFQUFFO0FBQ2IsSUFBSSxRQUFRLEVBQUUsUUFBUTtBQUN0QixJQUFJLFdBQVcsRUFBRSxXQUFXO0FBQzVCLElBQUc7QUFDSDtBQUNBLEVBQUUsVUFBVSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUM7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsUUFBUSxHQUFHLEVBQUM7QUFDZCxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDO0FBQ2hGLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUM7QUFDcEQ7QUFDQSxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFJLFFBQVEsR0FBRyxHQUFHLEVBQUU7QUFDaEQsSUFBSSxJQUFJLEdBQUcsUUFBUSxHQUFHLEtBQUk7QUFDMUIsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBQztBQUM1RCxJQUFJLFFBQVEsR0FBRyxLQUFJO0FBQ25CLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQztBQUN4QjtBQUNBO0FBQ0EsRUFBRSxNQUFNLEdBQUcsR0FBRTtBQUNiLEVBQUUsVUFBVSxHQUFHLEdBQUU7QUFDakIsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFDO0FBQ1o7QUFDQSxFQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRTtBQUN2QyxJQUFJLFVBQVUsR0FBR0ssV0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBQztBQUNuRSxJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsV0FBVyxHQUFFO0FBQzFDO0FBQ0EsSUFBSSxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzdDLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUM7QUFDN0IsTUFBTSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBQztBQUNsQyxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFLE9BQU8sTUFBTTtBQUNmO0FBQ0EsRUFBRSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RCLElBQUksT0FBTyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEUsR0FBRztBQUNIO0FBQ0EsRUFBRSxTQUFTLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzVCLElBQUksT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDL0UsR0FBRztBQUNIO0FBQ0EsRUFBRSxTQUFTLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzVCLElBQUksSUFBSSxVQUFVLEdBQUdFLFFBQU0sQ0FBQyxDQUFDLEVBQUM7QUFDOUIsSUFBSSxJQUFJLFdBQVcsR0FBR0EsUUFBTSxDQUFDLENBQUMsRUFBQztBQUMvQjtBQUNBLElBQUksT0FBTyxVQUFVLEtBQUssV0FBVztBQUNyQyxRQUFRLENBQUM7QUFDVCxRQUFRLFVBQVUsS0FBSyxXQUFXO0FBQ2xDLFFBQVEsQ0FBQyxDQUFDO0FBQ1YsUUFBUSxXQUFXLEtBQUssV0FBVztBQUNuQyxRQUFRLENBQUM7QUFDVCxRQUFRLFNBQVM7QUFDakIsR0FBRztBQUNIO0FBQ0EsRUFBRSxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzNCLElBQUksT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztBQUM3QixHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0E7QUFDQSxTQUFTLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDakQsRUFBRSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUc7QUFDcEMsRUFBRSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSTtBQUN6QixFQUFFLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFLO0FBQzNCLEVBQUUsSUFBSSxNQUFNLEdBQUcsR0FBRTtBQUNqQixFQUFFLElBQUksS0FBSyxHQUFHLENBQUMsRUFBQztBQUNoQixFQUFFLElBQUksS0FBSTtBQUNWLEVBQUUsSUFBSSxPQUFNO0FBQ1osRUFBRSxJQUFJLFVBQVM7QUFDZixFQUFFLElBQUksY0FBYTtBQUNuQixFQUFFLElBQUksVUFBUztBQUNmLEVBQUUsSUFBSSxjQUFhO0FBQ25CLEVBQUUsSUFBSSxVQUFTO0FBQ2YsRUFBRSxJQUFJLFlBQVc7QUFDakIsRUFBRSxJQUFJLFNBQVE7QUFDZCxFQUFFLElBQUksTUFBSztBQUNYLEVBQUUsSUFBSSxNQUFLO0FBQ1gsRUFBRSxJQUFJLE9BQU07QUFDWixFQUFFLElBQUksT0FBTTtBQUNaO0FBQ0E7QUFDQSxFQUFFLElBQUksS0FBSyxFQUFFO0FBQ2IsSUFBSSxPQUFPLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDbkMsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBQztBQUMvQixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUM7QUFDWjtBQUNBLEVBQUUsT0FBTyxFQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ2pDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUM7QUFDdkIsSUFBSSxNQUFNLEdBQUcsR0FBRTtBQUNmLElBQUksU0FBUyxHQUFHLEdBQUU7QUFDbEIsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUM7QUFDbEMsSUFBSSxTQUFTLEdBQUcsS0FBSTtBQUNwQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQztBQUNqQyxJQUFJLFNBQVMsR0FBRyxhQUFhLENBQUMsV0FBVyxFQUFFLEtBQUssY0FBYTtBQUM3RCxJQUFJLFdBQVcsR0FBR0EsUUFBTSxDQUFDLElBQUksRUFBQztBQUM5QixJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUM7QUFDakI7QUFDQTtBQUNBLElBQUksT0FBTyxFQUFFLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3RDLE1BQU0sTUFBTSxJQUFJLFVBQVM7QUFDekIsTUFBTSxLQUFLLEdBQUcsVUFBUztBQUN2QixNQUFNLFNBQVMsR0FBRyxjQUFhO0FBQy9CLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDO0FBQ3hDLE1BQU0sU0FBUyxHQUFHLGNBQWE7QUFDL0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFDO0FBQy9DLE1BQU0sS0FBSyxHQUFHLFVBQVM7QUFDdkI7QUFDQSxNQUFNLElBQUksYUFBYSxFQUFFO0FBQ3pCLFFBQVEsU0FBUyxHQUFHLGFBQWEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxjQUFhO0FBQ2pFLE9BQU87QUFDUDtBQUNBLE1BQU0sSUFBSSxTQUFTLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtBQUM1QztBQUNBLFFBQVEsS0FBSyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUM7QUFDN0M7QUFDQTtBQUNBLFFBQVEsS0FBSztBQUNiLFVBQVUsTUFBTTtBQUNoQixZQUFZLFVBQVUsQ0FBQyxhQUFhLENBQUM7QUFDckMsWUFBWSxVQUFVLENBQUMsU0FBUyxDQUFDO0FBQ2pDLFlBQVksYUFBYTtBQUN6QixVQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQSxNQUFNLEtBQUssQ0FBQyxNQUFNLEdBQUcsU0FBUyxFQUFDO0FBQy9CO0FBQ0E7QUFDQSxNQUFNLElBQUksU0FBUyxFQUFFO0FBQ3JCLFFBQVEsS0FBSyxDQUFDLE1BQU0sR0FBRyxhQUFhLEdBQUcsU0FBUyxHQUFHLGFBQWEsRUFBQztBQUNqRSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU0sTUFBTSxHQUFHLENBQUMsRUFBQztBQUNqQjtBQUNBLE1BQU0sT0FBTyxFQUFFLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFO0FBQzNDLFFBQVEsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUM7QUFDbkM7QUFDQTtBQUNBLFFBQVEsSUFBSSxLQUFLLElBQUksTUFBTSxLQUFLLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN0RCxVQUFVLElBQUksV0FBVyxLQUFLLEdBQUcsRUFBRTtBQUNuQyxZQUFZLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLEtBQUssRUFBQztBQUMxQyxZQUFZLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLFNBQVMsRUFBQztBQUM5QyxXQUFXO0FBQ1g7QUFDQSxVQUFVLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFFO0FBQ3ZDO0FBQ0EsVUFBVSxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxLQUFLLEVBQUM7QUFDeEMsVUFBVSxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxTQUFTLEVBQUM7QUFDNUMsU0FBUyxNQUFNO0FBQ2Y7QUFDQSxVQUFVLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLEtBQUssRUFBQztBQUN4QyxVQUFVLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLFNBQVMsRUFBQztBQUM1QyxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUUsT0FBTyxNQUFNO0FBQ2Y7QUFDQTtBQUNBLEVBQUUsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUNoQyxJQUFJLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDO0FBQ25DLElBQUksSUFBSSxVQUFTO0FBQ2pCO0FBQ0EsSUFBSSxJQUFJLEtBQUssS0FBSyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDbEMsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQztBQUN4QjtBQUNBLE1BQU0sU0FBUyxHQUFHRCxNQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBQztBQUN0QyxNQUFNLEtBQUssR0FBRyxTQUFTLElBQUksQ0FBQ0YsTUFBSSxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDO0FBQ3JFO0FBQ0EsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQUs7QUFDakM7QUFDQSxNQUFNLElBQUksS0FBSyxFQUFFO0FBQ2pCLFFBQVEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLEVBQUM7QUFDaEQsUUFBUSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUM7QUFDdEMsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDZixNQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUU7QUFDOUIsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxVQUFVLENBQUMsUUFBUSxFQUFFO0FBQ2hDLElBQUksSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUM7QUFDbEM7QUFDQSxJQUFJO0FBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxLQUFLO0FBQ3BDLFVBQVUsS0FBSyxDQUFDLFdBQVcsRUFBRTtBQUM3QixVQUFVLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNsRCxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQ3hXQSxXQUFjLEdBQUcsTUFBSztBQUN0QjtBQUNBO0FBQ0EsU0FBUyxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQ3JCLEVBQUUsSUFBSSxJQUFJLEdBQUcsS0FBSTtBQUNqQixFQUFFLElBQUksS0FBSyxHQUFHRSxNQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUM7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsRUFBRSxPQUFPO0FBQ1QsSUFBSSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDL0IsSUFBSSxTQUFTLEVBQUUsT0FBTztBQUN0QixNQUFNLEtBQUssSUFBSUYsTUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEUsS0FBSztBQUNMLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLElBQUlBLE1BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdEUsR0FBRztBQUNIOztBQ25CQSxXQUFjLEdBQUcsTUFBSztBQUN0QjtBQUNBO0FBQ0EsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzFDLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFDO0FBQ2hCLEVBQUUsSUFBSSxNQUFLO0FBQ1gsRUFBRSxJQUFJLEtBQUk7QUFDVixFQUFFLElBQUksaUJBQWdCO0FBQ3RCLEVBQUUsSUFBSSxhQUFZO0FBQ2xCLEVBQUUsSUFBSSxTQUFRO0FBQ2Q7QUFDQSxFQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDeEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUM7QUFDL0IsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLGFBQVk7QUFDckMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFDO0FBQ2pCO0FBQ0EsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNqRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsR0FBRyxNQUFLO0FBQ25FLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSTtBQUN0RSxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDO0FBQ3RCO0FBQ0EsTUFBTSxJQUFJLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTSxFQUFFO0FBQy9DLFFBQVEsT0FBTyxFQUFFLFFBQVEsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFO0FBQ2pELFVBQVUsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFBQztBQUMxRDtBQUNBLFVBQVUsSUFBSSxnQkFBZ0IsRUFBRTtBQUNoQyxZQUFZLEtBQUssQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQztBQUN2RCxXQUFXO0FBQ1gsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLEtBQUs7QUFDZDs7QUNoQ0EsV0FBYyxHQUFHSSxNQUFHO0FBQ3BCO0FBQ0EsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUk7QUFDbEI7QUFDQSxJQUFJLFFBQVEsR0FBRyxHQUFFO0FBQ2pCO0FBQ0E7QUFDQSxTQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNyQyxFQUFFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUM7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsRUFBRSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7QUFDcEIsSUFBSSxJQUFJLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDM0IsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRTtBQUNqQyxLQUFLLE1BQU07QUFDWCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBQztBQUM3QixLQUFLO0FBQ0wsR0FBRyxNQUFNO0FBQ1QsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRTtBQUMvQixHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0EsU0FBU0EsS0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtBQUN6QyxFQUFFLElBQUksUUFBUSxHQUFHLENBQUMsRUFBQztBQUNuQixFQUFFLElBQUksS0FBSTtBQUNWLEVBQUUsSUFBSSxPQUFNO0FBQ1osRUFBRSxJQUFJLFlBQVc7QUFDakIsRUFBRSxJQUFJLFVBQVM7QUFDZixFQUFFLElBQUksU0FBUTtBQUNkLEVBQUUsSUFBSSxTQUFRO0FBQ2QsRUFBRSxJQUFJLGNBQWE7QUFDbkI7QUFDQTtBQUNBLEVBQUU7QUFDRixJQUFJLEVBQUUsV0FBVyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDbkMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztBQUM5QyxJQUFJO0FBQ0osSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7QUFDL0IsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLEVBQUUsUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDcEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUM7QUFDekM7QUFDQSxJQUFJLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtBQUN0RCxNQUFNLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDO0FBQzNELEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxJQUFJLEVBQUU7QUFDZCxNQUFNLFFBQVEsR0FBR0MsT0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUM7QUFDckQsTUFBTSxNQUFNLEdBQUcsQ0FBQyxFQUFDO0FBQ2pCO0FBQ0EsTUFBTSxPQUFPLEVBQUUsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDekMsUUFBUSxJQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFO0FBQ3pDLFVBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFNBQVE7QUFDM0MsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDOUIsVUFBVSxXQUFXLEdBQUcsU0FBUTtBQUNoQztBQUNBLFVBQVUsT0FBTyxFQUFFLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQy9DLFlBQVksUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFDO0FBQ3hEO0FBQ0EsWUFBWTtBQUNaLGNBQWMsUUFBUTtBQUN0QixjQUFjLFFBQVEsQ0FBQyxXQUFXO0FBQ2xDLGNBQWMsSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsSUFBSTtBQUN6QyxjQUFjO0FBQ2QsY0FBYyxhQUFhLEdBQUdBLE9BQUs7QUFDbkMsZ0JBQWdCLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDaEMsZ0JBQWdCLFFBQVE7QUFDeEIsZ0JBQWdCLE9BQU8sQ0FBQyxLQUFLO0FBQzdCLGdCQUFnQixFQUFFO0FBQ2xCLGdCQUFlO0FBQ2YsY0FBYyxTQUFTLEdBQUcsQ0FBQyxFQUFDO0FBQzVCO0FBQ0EsY0FBYyxPQUFPLEVBQUUsU0FBUyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUU7QUFDekQsZ0JBQWdCLElBQUksRUFBRSxhQUFhLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUU7QUFDekQsa0JBQWtCLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxTQUFRO0FBQzNELGlCQUFpQjtBQUNqQixlQUFlO0FBQ2YsYUFBYTtBQUNiLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FDdkZBLFNBQWMsR0FBR0QsTUFBRztBQUNwQjtBQUNBLElBQUksUUFBUSxHQUFHLEdBQUU7QUFDakI7QUFDQTtBQUNBLFNBQVNBLEtBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzNCLEVBQUUsSUFBSSxJQUFJLEdBQUcsS0FBSTtBQUNqQjtBQUNBLEVBQUVSLE9BQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLFFBQVEsRUFBRSxJQUFJLEVBQUM7QUFDNUQ7QUFDQSxFQUFFLE9BQU8sSUFBSTtBQUNiOztBQ2JBLFlBQWMsR0FBRyxPQUFNO0FBQ3ZCO0FBQ0E7QUFDQSxTQUFTLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDdkIsRUFBRSxJQUFJLElBQUksR0FBRyxLQUFJO0FBQ2pCO0FBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDO0FBQ3pCO0FBQ0EsRUFBRSxPQUFPLElBQUk7QUFDYjs7QUNUQSxvQkFBYyxHQUFHLGVBQWM7QUFDL0I7QUFDQTtBQUNBLFNBQVMsY0FBYyxHQUFHO0FBQzFCLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxJQUFJO0FBQ3JDOztBQ0ZBLGdCQUFjLEdBQUcsTUFBSztBQUN0QjtBQUNBO0FBQ0EsSUFBSSxvQkFBb0IsR0FBRyxNQUFLO0FBQ2hDO0FBQ0E7QUFDQSxTQUFTLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtBQUNuQztBQUNBLEVBQUUsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUM7QUFDbEMsRUFBRSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUM7QUFDcEMsRUFBRSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUM7QUFDdkM7QUFDQSxFQUFFLE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ3JCO0FBQ0EsSUFBSSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhO0FBQ2pELE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUM7QUFDeEQsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEdBQUcsS0FBSyxHQUFHLEVBQUM7QUFDcEIsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFDO0FBQ3JDLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQztBQUM3QyxDQUFDO0FBQ0Q7QUFDQTtBQUNBLFNBQVMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQ3hDLEVBQUUsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUM7QUFDckMsRUFBRSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQztBQUNwQyxFQUFFLElBQUksS0FBSyxHQUFHLEdBQUU7QUFDaEIsRUFBRSxJQUFJLEtBQUk7QUFDVixFQUFFLElBQUksT0FBTTtBQUNaO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRTtBQUMzQyxJQUFJO0FBQ0osSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsV0FBVyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFDO0FBQ25FLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBQztBQUNoRCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ3ZCLElBQUksSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLElBQUksV0FBVyxHQUFHLFVBQVUsRUFBRTtBQUN0RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUM7QUFDdkMsTUFBTSxvQkFBb0IsQ0FBQyxTQUFTLEdBQUcsV0FBVyxHQUFHLEVBQUM7QUFDdEQsTUFBTSxNQUFNLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQztBQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsU0FBUyxFQUFDO0FBQzVFLEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBQztBQUN0QyxLQUFLO0FBQ0wsR0FBRyxNQUFNLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQy9CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBQztBQUNyQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUM7QUFDdkMsR0FBRyxNQUFNO0FBQ1QsSUFBSSxJQUFJLEdBQUcsS0FBSTtBQUNmLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUU7QUFDcEI7QUFDQSxFQUFFLElBQUksSUFBSSxFQUFFO0FBQ1osSUFBSVEsT0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUVFLFdBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBQztBQUNyRSxHQUFHO0FBQ0g7O0FDbkVBLGNBQWMsR0FBR0YsTUFBRztBQUNwQjtBQUNBO0FBQ0EsU0FBU0EsS0FBRyxDQUFDLEdBQUcsRUFBRTtBQUNsQixFQUFFLElBQUksSUFBSSxHQUFHLEtBQUk7QUFDakIsRUFBRSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUM7QUFDaEIsRUFBRSxJQUFJLEtBQUk7QUFDVixFQUFFLElBQUksT0FBTTtBQUNaLEVBQUUsSUFBSSxVQUFTO0FBQ2YsRUFBRSxJQUFJLE9BQU07QUFDWjtBQUNBLEVBQUVOLFlBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUM7QUFDN0I7QUFDQTtBQUNBLEVBQUUsT0FBTyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtBQUM5QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBQztBQUNwQyxJQUFJLE1BQU0sR0FBRyxHQUFFO0FBQ2YsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFDO0FBQ2Y7QUFDQSxJQUFJLE9BQU8sRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNuQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBQztBQUNyQyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTTtBQUN4RCxVQUFVLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUc7QUFDbkUsVUFBVSxVQUFTO0FBQ25CLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFDO0FBQ3ZELEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxJQUFJO0FBQ2I7O0FDaENBLFlBQWMsR0FBRyxJQUFHO0FBQ3BCO0FBQ0E7QUFDQSxTQUFTLEdBQUcsQ0FBQyxHQUFHLEVBQUU7QUFDbEIsRUFBRSxJQUFJLElBQUksR0FBRyxLQUFJO0FBQ2pCLEVBQUUsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFDO0FBQzlDLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFDO0FBQ2hCLEVBQUUsSUFBSSxLQUFJO0FBQ1YsRUFBRSxJQUFJLFVBQVM7QUFDZixFQUFFLElBQUksS0FBSTtBQUNWLEVBQUUsSUFBSSxLQUFJO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxLQUFLLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxNQUFLO0FBQzlFLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYTtBQUNqQztBQUNBLEVBQUUsT0FBTyxFQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ2pDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUU7QUFDOUI7QUFDQSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDZixNQUFNLFFBQVE7QUFDZCxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBQztBQUMxQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFDO0FBQ2xCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBRztBQUN0QztBQUNBLElBQUksSUFBSSxTQUFTLEVBQUU7QUFDbkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUM7QUFDMUIsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDM0I7QUFDQSxJQUFJLElBQUksU0FBUyxFQUFFO0FBQ25CLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDO0FBQ2hDLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sSUFBSTtBQUNiOztBQ3JDQSxPQUFjLEdBQUcsT0FBTTtBQUN2QjtBQUNBLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFTO0FBQzVCO0FBQ0EsS0FBSyxDQUFDLE9BQU8sR0FBR1MsVUFBdUI7QUFDdkMsS0FBSyxDQUFDLE9BQU8sR0FBR0MsVUFBdUI7QUFDdkMsS0FBSyxDQUFDLEtBQUssR0FBR0MsUUFBcUI7QUFDbkMsS0FBSyxDQUFDLEdBQUcsR0FBR0MsTUFBbUI7QUFDL0IsS0FBSyxDQUFDLE1BQU0sR0FBR0MsU0FBc0I7QUFDckMsS0FBSyxDQUFDLGNBQWMsR0FBR0MsaUJBQStCO0FBQ3RELEtBQUssQ0FBQyxVQUFVLEdBQUdDLFdBQTBCO0FBQzdDLEtBQUssQ0FBQyxRQUFRLEdBQUdDLFNBQXdCO0FBQ3pDO0FBQ0E7QUFDQSxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQzFCLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFDO0FBQ2hCLEVBQUUsSUFBSSxhQUFZO0FBQ2xCO0FBQ0EsRUFBRSxJQUFJLEVBQUUsSUFBSSxZQUFZLE1BQU0sQ0FBQyxFQUFFO0FBQ2pDLElBQUksT0FBTyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0FBQy9CLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUlDLFFBQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUM5QyxJQUFJLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJQSxRQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDaEQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQztBQUNqQyxLQUFLO0FBQ0wsR0FBRyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQ2xCLElBQUksSUFBSSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQ3pCLE1BQU0sWUFBWSxHQUFHLElBQUc7QUFDeEIsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFHO0FBQ2hDLEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQ25CLFFBQVEsWUFBWSxHQUFHLENBQUMsR0FBRyxFQUFDO0FBQzVCLE9BQU87QUFDUDtBQUNBLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFHO0FBQ25CLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDWixJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUM7QUFDbEQsR0FBRztBQUNIO0FBQ0EsRUFBRSxHQUFHLEdBQUdDLE9BQUssQ0FBQyxHQUFHLEVBQUM7QUFDbEI7QUFDQSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUM7QUFDakMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsR0FBRyxDQUFDLGtCQUFpQjtBQUNoRCxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsaUJBQWdCO0FBQzlDLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsV0FBVTtBQUNsQyxFQUFFLElBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDLGNBQWE7QUFDeEMsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFLO0FBQ3hCLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBSztBQUN4QjtBQUNBLEVBQUUsSUFBSSxZQUFZLEVBQUU7QUFDcEIsSUFBSSxPQUFPLEVBQUUsS0FBSyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUU7QUFDMUMsTUFBTSxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUU7QUFDbkMsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUM7QUFDaEQsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O01DakU4QixZQUFZOzs7TUNFckIsYUFBYyxTQUFRLFlBQVk7SUFHckQsWUFBWSxNQUFjO1FBQ3hCLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7S0FDdEI7SUFFRCxPQUFPLENBQUMsSUFBWTtRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUMxQjtJQUVLLFFBQVEsQ0FBQyxLQUFlOztZQUM1QixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1RDtLQUFBO0lBRUQsVUFBVSxDQUFDLElBQVk7UUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDMUI7SUFFSyxXQUFXLENBQUMsS0FBZTs7WUFDL0IsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0Q7S0FBQTtJQUVELE9BQU8sQ0FBQyxJQUFZO1FBQ2xCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ25EO0lBRUQsT0FBTyxDQUFDLElBQVk7UUFDbEIsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDbkQ7Ozs7TUM1Qm1CLG1CQUFtQjtDQUV4QztNQUlZLG9CQUFxQixTQUFRLG1CQUFtQjtJQU8zRCxZQUFZLE9BQWlCLEVBQUUsT0FBaUIsRUFBRSxjQUFnQztRQUNoRixLQUFLLEVBQUUsQ0FBQztRQVBWLGdEQUFtQjtRQUVuQixnREFBbUI7UUFPakIsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDckMsTUFBTSxJQUFJQyxxQkFBYyxFQUFFLENBQUM7U0FDNUI7UUFFRCx1QkFBQSxJQUFJLGlDQUFZLE9BQU8sTUFBQSxDQUFDO1FBQ3hCLHVCQUFBLElBQUksaUNBQVksT0FBTyxNQUFBLENBQUM7UUFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7S0FDdEM7SUFFSyxlQUFlOztZQUNuQixNQUFNLFFBQVEsR0FBaUMsRUFBRSxDQUFDO1lBRWxELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyx1QkFBQSxJQUFJLHFDQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2hELE1BQU0sTUFBTSxHQUFHLHVCQUFBLElBQUkscUNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxNQUFNLEdBQUcsdUJBQUEsSUFBSSxxQ0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDcEQ7WUFDRCxNQUFNLFlBQVksR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakQsTUFBTSxjQUFjLEdBQUdDLEdBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM1QyxPQUFPLElBQUksYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQzFDO0tBQUE7Q0FDRjs7O1NDM0NlLFFBQVEsQ0FBQyxJQUEwQixFQUFFLElBQVksRUFBRSxTQUFrQjtJQUNuRixJQUFJLE9BQXVCLENBQUM7SUFFNUIsT0FBTyxTQUFTLFNBQVMsQ0FBQyxHQUFHLElBQVc7UUFDdEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQztZQUN0QixPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ2YsSUFBSSxDQUFDLFNBQVM7Z0JBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDM0MsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLFNBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEIsT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxPQUFPO1lBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDeEMsQ0FBQztBQUNKOztBQ1pBLFNBQWUsUUFBUSxDQUFDLEdBQVc7O1FBQ2pDLE1BQU0sR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMxQjtDQUFBO1NBRTZCLElBQUksQ0FBQyxNQUFjLEVBQUUsTUFBYzs7UUFDL0QsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzRSxNQUFNLE1BQU0sR0FBc0I7WUFDaEMsR0FBRztZQUNILEdBQUc7U0FDSixDQUFDO1FBQ0YsT0FBTyxNQUFNLENBQUM7S0FDZjs7O1NDaEJlLGlCQUFpQixDQUFDLEtBQWE7SUFDN0MsT0FBTyxLQUFLO1NBQ1QsS0FBSyxDQUFDLEdBQUcsQ0FBQztTQUNWLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDcEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RCOzs7QUNZQSxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUM7TUFFVixpQkFBa0IsU0FBUUMsZUFBTTtJQVduRCxZQUFZLEdBQVEsRUFBRSxRQUF3QjtRQUM1QyxLQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBVHZCLHdDQUF1QjtRQUV2QixxQ0FBa0IsRUFBRSxFQUFDO1FBRXJCLGtEQUE0QjtRQUU1Qix5REFBMEM7UUEyQjFDLHFCQUFnQixHQUFHLENBQUMsRUFBcUI7WUFDdkMsSUFBSSx1QkFBQSxJQUFJLDZCQUFJLElBQUksSUFBSSxFQUFFO2dCQUNwQix1QkFBQSxJQUFJLDZCQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzthQUMvRDtZQUVELHVCQUFBLElBQUkseUJBQU8sRUFBRSxNQUFBLENBQUM7WUFDZCx1QkFBQSxJQUFJLDZCQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsZ0NBQWdDLEVBQUUsQ0FBQztTQUN6QyxDQUFDO1FBVUYsNEJBQXVCLEdBQUcsQ0FBTyxTQUFpQixFQUFFLFFBQWdCO1lBQ2xFLE1BQU0sdUJBQUEsSUFBSSx1Q0FBYyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ25FLE1BQU0sdUJBQUEsSUFBSSx1Q0FBYyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDO1NBQ3pDLENBQUEsQ0FBQztRQUVGLDRCQUF1QixHQUFHO1lBQ3hCLElBQUksdUJBQUEsSUFBSSw2QkFBSSxJQUFJLElBQUksRUFBRTtnQkFDcEIsT0FBTzthQUNSO1lBRUQsdUJBQUEsSUFBSSxrQ0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQU07Z0JBQzNCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNYLENBQUMsQ0FBQztZQUVILHVCQUFBLElBQUksOEJBQVksRUFBRSxNQUFBLENBQUM7WUFFbkIsTUFBTSxJQUFJLEdBQUcsdUJBQUEsSUFBSSw2QkFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pDLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUVyQixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7WUFDYixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFFaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVyQixJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3pCLFdBQVcsSUFBSSxJQUFJLENBQUM7b0JBQ3BCLE9BQU8sSUFBSSxDQUFDLENBQUM7b0JBQ2IsU0FBUztpQkFDVjtnQkFFRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTs7b0JBRTFELE1BQU0sT0FBTyxHQUFHLE1BQU0sdUJBQUEsSUFBSSx1Q0FBYyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFFOUQsSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDWixNQUFNLFFBQVEsR0FBRyxPQUFPLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ2xELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQzt3QkFDdkIsTUFBTSxDQUFDLEdBQUcsdUJBQUEsSUFBSSw2QkFBSSxDQUFDLFFBQVEsQ0FDekIsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUN0QixFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQ3BCLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLENBQ2hDLENBQUM7d0JBQ0YsdUJBQUEsSUFBSSxrQ0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkI7aUJBQ0Y7Z0JBRUQsT0FBTyxJQUFJLENBQUMsQ0FBQztnQkFFYixJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7b0JBQ2pCLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQ1osSUFBSSxJQUFJLENBQUMsQ0FBQztpQkFDWDtnQkFFRCxXQUFXLEdBQUcsRUFBRSxDQUFDO2FBQ2xCO1NBQ0YsQ0FBQSxDQUFDO1FBRUYscUNBQWdDLEdBQUcsUUFBUSxDQUN6QyxJQUFJLENBQUMsdUJBQXVCLEVBQzVCLElBQUksRUFDSixLQUFLLENBQ04sQ0FBQztRQXhHQSx1QkFBQSxJQUFJLDBDQUF3QixJQUFJLG9CQUFvQixDQUNsRDtZQUNFLHNGQUFzRjtTQUN2RixFQUNEO1lBQ0Usc0ZBQXNGO1NBQ3ZGLEVBQ0RDLElBQWMsQ0FDZixNQUFBLENBQUM7S0FDSDtJQUVLLE1BQU07O1lBQ1YsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDO2dCQUNoQixNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUU7aUJBQ3hCLHVCQUFBLElBQUksbUNBQWlCLE1BQU0sdUJBQUEsSUFBSSw4Q0FBcUIsQ0FBQyxlQUFlLEVBQUUsTUFBQTthQUN4RSxDQUFDLENBQUM7WUFDSCxNQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sdUJBQUEsSUFBSSx1Q0FBYyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUvQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUMvRDtLQUFBO0lBWUssWUFBWTs7WUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUM1RTtLQUFBO0lBRUssWUFBWTs7WUFDaEIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNwQztLQUFBO0NBa0VGOzs7OzsifQ==
