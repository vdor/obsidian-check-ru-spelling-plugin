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

class SpellChekerSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Settings for checker of spellings." });
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

const DEFAULT_SETTINGS = {
    customWords: "",
};
const textRegexp = /^[А-я-]+$/;
class SpellChekerPlugin extends obsidian.Plugin {
    constructor(app, manifest) {
        super(app, manifest);
        this.markers = [];
        this.attachCodeMirror = (cm) => {
            if (this.cm != null) {
                this.cm.off('change', this.checkSpellingOverEditorDebounced);
            }
            this.cm = cm;
            this.cm.on("change", this.checkSpellingOverEditorDebounced);
            this.checkSpellingOverEditorDebounced();
        };
        this.handleChangeCustomWords = (prevWords, newWords) => __awaiter(this, void 0, void 0, function* () {
            yield this.spellChecker.removeWords(stOfrWordsToArray(prevWords));
            yield this.spellChecker.addWords(stOfrWordsToArray(newWords));
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
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}

module.exports = SpellChekerPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9jb3JlL3NldHRpbmdUYWIudHMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9ydWxlLWNvZGVzLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9hZmZpeC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3V0aWwvbm9ybWFsaXplLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9mbGFnLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9leGFjdC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3V0aWwvZm9ybS5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL2NvcnJlY3QuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi91dGlsL2Nhc2luZy5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3N1Z2dlc3QuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi9zcGVsbC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3V0aWwvYXBwbHkuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi91dGlsL2FkZC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL2FkZC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3JlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3dvcmQtY2hhcmFjdGVycy5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3V0aWwvZGljdGlvbmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL2RpY3Rpb25hcnkuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi9wZXJzb25hbC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL2luZGV4LmpzIiwic3JjL3NwZWxsQ2hlY2tlci9hYnN0cmFjdC50cyIsInNyYy9zcGVsbENoZWNrZXIvblNwZWxsQ2hlY2tlci50cyIsInNyYy9zcGVsbENoZWNrZXIvZmFjdG9yeS50cyIsInNyYy91dGlscy9kZWJvdW5jZS50cyIsInNyYy91dGlscy9kaWN0aW9uYXJpZXMudHMiLCJzcmMvdXRpbHMvd29yZHMudHMiLCJzcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IGZyb20pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHtcbiAgQXBwLFxuICBQbHVnaW5TZXR0aW5nVGFiLFxuICBTZXR0aW5nLFxuICBQbHVnaW5cbn0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBTcGVsbENoZWtlclBsdWdpblNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncyc7XG5cbmludGVyZmFjZSBDdXN0b21QbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5nczogU3BlbGxDaGVrZXJQbHVnaW5TZXR0aW5ncztcbiAgaGFuZGxlQ2hhbmdlQ3VzdG9tV29yZHM6IChwcmV2V29yZHM6IHN0cmluZywgbmV3V29yZHM6IHN0cmluZykgPT4gdm9pZDtcbiAgc2F2ZVNldHRpbmdzOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGVsbENoZWtlclNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgcGx1Z2luOiBDdXN0b21QbHVnaW47XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogQ3VzdG9tUGx1Z2luKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcblxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJTZXR0aW5ncyBmb3IgY2hlY2tlciBvZiBzcGVsbGluZ3MuXCIgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ3VzdG9tIHdvcmRzXCIpXG4gICAgICAuc2V0RGVzYyhcIkN1c3RvbSBzcGVsbGluZyB3b3Jkc1wiKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFbnRlciB3b3JkcyBzZXBhcmF0ZWQgYnkgY29tbWFcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuY3VzdG9tV29yZHMpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJldiA9IHRoaXMucGx1Z2luLnNldHRpbmdzLmN1c3RvbVdvcmRzO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY3VzdG9tV29yZHMgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmhhbmRsZUNoYW5nZUN1c3RvbVdvcmRzKHByZXYsIHZhbHVlKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuICB9XG59XG4iLCIvKiFcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqLmNvbnN0cnVjdG9yICE9IG51bGwgJiZcbiAgICB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBydWxlQ29kZXNcblxudmFyIE5PX0NPREVTID0gW11cblxuLy8gUGFyc2UgcnVsZSBjb2Rlcy5cbmZ1bmN0aW9uIHJ1bGVDb2RlcyhmbGFncywgdmFsdWUpIHtcbiAgdmFyIGluZGV4ID0gMFxuICB2YXIgcmVzdWx0XG5cbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIE5PX0NPREVTXG5cbiAgaWYgKGZsYWdzLkZMQUcgPT09ICdsb25nJykge1xuICAgIC8vIENyZWF0aW5nIGFuIGFycmF5IG9mIHRoZSByaWdodCBsZW5ndGggaW1tZWRpYXRlbHlcbiAgICAvLyBhdm9pZGluZyByZXNpemVzIGFuZCB1c2luZyBtZW1vcnkgbW9yZSBlZmZpY2llbnRseVxuICAgIHJlc3VsdCA9IG5ldyBBcnJheShNYXRoLmNlaWwodmFsdWUubGVuZ3RoIC8gMikpXG5cbiAgICB3aGlsZSAoaW5kZXggPCB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtpbmRleCAvIDJdID0gdmFsdWUuc2xpY2UoaW5kZXgsIGluZGV4ICsgMilcbiAgICAgIGluZGV4ICs9IDJcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICByZXR1cm4gdmFsdWUuc3BsaXQoZmxhZ3MuRkxBRyA9PT0gJ251bScgPyAnLCcgOiAnJylcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgcGFyc2UgPSByZXF1aXJlKCcuL3J1bGUtY29kZXMuanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFmZml4XG5cbnZhciBwdXNoID0gW10ucHVzaFxuXG4vLyBSZWxhdGl2ZSBmcmVxdWVuY2llcyBvZiBsZXR0ZXJzIGluIHRoZSBFbmdsaXNoIGxhbmd1YWdlLlxudmFyIGFscGhhYmV0ID0gJ2V0YW9pbnNocmRsY3Vtd2ZneXBidmtqeHF6Jy5zcGxpdCgnJylcblxuLy8gRXhwcmVzc2lvbnMuXG52YXIgd2hpdGVTcGFjZUV4cHJlc3Npb24gPSAvXFxzKy9cblxuLy8gRGVmYXVsdHMuXG52YXIgZGVmYXVsdEtleWJvYXJkTGF5b3V0ID0gW1xuICAncXdlcnR6dW9wJyxcbiAgJ3l4Y3Zibm0nLFxuICAncWF3JyxcbiAgJ3NheScsXG4gICd3c2UnLFxuICAnZHN4JyxcbiAgJ3N5JyxcbiAgJ2VkcicsXG4gICdmZGMnLFxuICAnZHgnLFxuICAncmZ0JyxcbiAgJ2dmdicsXG4gICdmYycsXG4gICd0Z3onLFxuICAnaGdiJyxcbiAgJ2d2JyxcbiAgJ3podScsXG4gICdqaG4nLFxuICAnaGInLFxuICAndWppJyxcbiAgJ2tqbScsXG4gICdqbicsXG4gICdpa28nLFxuICAnbGttJ1xuXVxuXG4vLyBQYXJzZSBhbiBhZmZpeCBmaWxlLlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHlcbmZ1bmN0aW9uIGFmZml4KGRvYykge1xuICB2YXIgcnVsZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIHZhciBjb21wb3VuZFJ1bGVDb2RlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgdmFyIGZsYWdzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICB2YXIgcmVwbGFjZW1lbnRUYWJsZSA9IFtdXG4gIHZhciBjb252ZXJzaW9uID0ge2luOiBbXSwgb3V0OiBbXX1cbiAgdmFyIGNvbXBvdW5kUnVsZXMgPSBbXVxuICB2YXIgYWZmID0gZG9jLnRvU3RyaW5nKCd1dGY4JylcbiAgdmFyIGxpbmVzID0gW11cbiAgdmFyIGxhc3QgPSAwXG4gIHZhciBpbmRleCA9IGFmZi5pbmRleE9mKCdcXG4nKVxuICB2YXIgcGFydHNcbiAgdmFyIGxpbmVcbiAgdmFyIHJ1bGVUeXBlXG4gIHZhciBjb3VudFxuICB2YXIgcmVtb3ZlXG4gIHZhciBhZGRcbiAgdmFyIHNvdXJjZVxuICB2YXIgZW50cnlcbiAgdmFyIHBvc2l0aW9uXG4gIHZhciBydWxlXG4gIHZhciB2YWx1ZVxuICB2YXIgb2Zmc2V0XG4gIHZhciBjaGFyYWN0ZXJcblxuICBmbGFncy5LRVkgPSBbXVxuXG4gIC8vIFByb2Nlc3MgdGhlIGFmZml4IGJ1ZmZlciBpbnRvIGEgbGlzdCBvZiBhcHBsaWNhYmxlIGxpbmVzLlxuICB3aGlsZSAoaW5kZXggPiAtMSkge1xuICAgIHB1c2hMaW5lKGFmZi5zbGljZShsYXN0LCBpbmRleCkpXG4gICAgbGFzdCA9IGluZGV4ICsgMVxuICAgIGluZGV4ID0gYWZmLmluZGV4T2YoJ1xcbicsIGxhc3QpXG4gIH1cblxuICBwdXNoTGluZShhZmYuc2xpY2UobGFzdCkpXG5cbiAgLy8gUHJvY2VzcyBlYWNoIGxpbmUuXG4gIGluZGV4ID0gLTFcblxuICB3aGlsZSAoKytpbmRleCA8IGxpbmVzLmxlbmd0aCkge1xuICAgIGxpbmUgPSBsaW5lc1tpbmRleF1cbiAgICBwYXJ0cyA9IGxpbmUuc3BsaXQod2hpdGVTcGFjZUV4cHJlc3Npb24pXG4gICAgcnVsZVR5cGUgPSBwYXJ0c1swXVxuXG4gICAgaWYgKHJ1bGVUeXBlID09PSAnUkVQJykge1xuICAgICAgY291bnQgPSBpbmRleCArIHBhcnNlSW50KHBhcnRzWzFdLCAxMClcblxuICAgICAgd2hpbGUgKCsraW5kZXggPD0gY291bnQpIHtcbiAgICAgICAgcGFydHMgPSBsaW5lc1tpbmRleF0uc3BsaXQod2hpdGVTcGFjZUV4cHJlc3Npb24pXG4gICAgICAgIHJlcGxhY2VtZW50VGFibGUucHVzaChbcGFydHNbMV0sIHBhcnRzWzJdXSlcbiAgICAgIH1cblxuICAgICAgaW5kZXgtLVxuICAgIH0gZWxzZSBpZiAocnVsZVR5cGUgPT09ICdJQ09OVicgfHwgcnVsZVR5cGUgPT09ICdPQ09OVicpIHtcbiAgICAgIGNvdW50ID0gaW5kZXggKyBwYXJzZUludChwYXJ0c1sxXSwgMTApXG4gICAgICBlbnRyeSA9IGNvbnZlcnNpb25bcnVsZVR5cGUgPT09ICdJQ09OVicgPyAnaW4nIDogJ291dCddXG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDw9IGNvdW50KSB7XG4gICAgICAgIHBhcnRzID0gbGluZXNbaW5kZXhdLnNwbGl0KHdoaXRlU3BhY2VFeHByZXNzaW9uKVxuICAgICAgICBlbnRyeS5wdXNoKFtuZXcgUmVnRXhwKHBhcnRzWzFdLCAnZycpLCBwYXJ0c1syXV0pXG4gICAgICB9XG5cbiAgICAgIGluZGV4LS1cbiAgICB9IGVsc2UgaWYgKHJ1bGVUeXBlID09PSAnQ09NUE9VTkRSVUxFJykge1xuICAgICAgY291bnQgPSBpbmRleCArIHBhcnNlSW50KHBhcnRzWzFdLCAxMClcblxuICAgICAgd2hpbGUgKCsraW5kZXggPD0gY291bnQpIHtcbiAgICAgICAgcnVsZSA9IGxpbmVzW2luZGV4XS5zcGxpdCh3aGl0ZVNwYWNlRXhwcmVzc2lvbilbMV1cbiAgICAgICAgcG9zaXRpb24gPSAtMVxuXG4gICAgICAgIGNvbXBvdW5kUnVsZXMucHVzaChydWxlKVxuXG4gICAgICAgIHdoaWxlICgrK3Bvc2l0aW9uIDwgcnVsZS5sZW5ndGgpIHtcbiAgICAgICAgICBjb21wb3VuZFJ1bGVDb2Rlc1tydWxlLmNoYXJBdChwb3NpdGlvbildID0gW11cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpbmRleC0tXG4gICAgfSBlbHNlIGlmIChydWxlVHlwZSA9PT0gJ1BGWCcgfHwgcnVsZVR5cGUgPT09ICdTRlgnKSB7XG4gICAgICBjb3VudCA9IGluZGV4ICsgcGFyc2VJbnQocGFydHNbM10sIDEwKVxuXG4gICAgICBydWxlID0ge1xuICAgICAgICB0eXBlOiBydWxlVHlwZSxcbiAgICAgICAgY29tYmluZWFibGU6IHBhcnRzWzJdID09PSAnWScsXG4gICAgICAgIGVudHJpZXM6IFtdXG4gICAgICB9XG5cbiAgICAgIHJ1bGVzW3BhcnRzWzFdXSA9IHJ1bGVcblxuICAgICAgd2hpbGUgKCsraW5kZXggPD0gY291bnQpIHtcbiAgICAgICAgcGFydHMgPSBsaW5lc1tpbmRleF0uc3BsaXQod2hpdGVTcGFjZUV4cHJlc3Npb24pXG4gICAgICAgIHJlbW92ZSA9IHBhcnRzWzJdXG4gICAgICAgIGFkZCA9IHBhcnRzWzNdLnNwbGl0KCcvJylcbiAgICAgICAgc291cmNlID0gcGFydHNbNF1cblxuICAgICAgICBlbnRyeSA9IHtcbiAgICAgICAgICBhZGQ6ICcnLFxuICAgICAgICAgIHJlbW92ZTogJycsXG4gICAgICAgICAgbWF0Y2g6ICcnLFxuICAgICAgICAgIGNvbnRpbnVhdGlvbjogcGFyc2UoZmxhZ3MsIGFkZFsxXSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhZGQgJiYgYWRkWzBdICE9PSAnMCcpIHtcbiAgICAgICAgICBlbnRyeS5hZGQgPSBhZGRbMF1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHJlbW92ZSAhPT0gJzAnKSB7XG4gICAgICAgICAgICBlbnRyeS5yZW1vdmUgPSBydWxlVHlwZSA9PT0gJ1NGWCcgPyBlbmQocmVtb3ZlKSA6IHJlbW92ZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzb3VyY2UgJiYgc291cmNlICE9PSAnLicpIHtcbiAgICAgICAgICAgIGVudHJ5Lm1hdGNoID0gcnVsZVR5cGUgPT09ICdTRlgnID8gZW5kKHNvdXJjZSkgOiBzdGFydChzb3VyY2UpXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgLy8gSWdub3JlIGludmFsaWQgcmVnZXggcGF0dGVybnMuXG4gICAgICAgICAgZW50cnkgPSBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICBydWxlLmVudHJpZXMucHVzaChlbnRyeSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpbmRleC0tXG4gICAgfSBlbHNlIGlmIChydWxlVHlwZSA9PT0gJ1RSWScpIHtcbiAgICAgIHNvdXJjZSA9IHBhcnRzWzFdXG4gICAgICBvZmZzZXQgPSAtMVxuICAgICAgdmFsdWUgPSBbXVxuXG4gICAgICB3aGlsZSAoKytvZmZzZXQgPCBzb3VyY2UubGVuZ3RoKSB7XG4gICAgICAgIGNoYXJhY3RlciA9IHNvdXJjZS5jaGFyQXQob2Zmc2V0KVxuXG4gICAgICAgIGlmIChjaGFyYWN0ZXIudG9Mb3dlckNhc2UoKSA9PT0gY2hhcmFjdGVyKSB7XG4gICAgICAgICAgdmFsdWUucHVzaChjaGFyYWN0ZXIpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU29tZSBkaWN0aW9uYXJpZXMgbWF5IGZvcmdldCBhIGNoYXJhY3Rlci5cbiAgICAgIC8vIE5vdGFibHkgYGVuYCBmb3JnZXRzIGBqYCwgYHhgLCBhbmQgYHlgLlxuICAgICAgb2Zmc2V0ID0gLTFcblxuICAgICAgd2hpbGUgKCsrb2Zmc2V0IDwgYWxwaGFiZXQubGVuZ3RoKSB7XG4gICAgICAgIGlmIChzb3VyY2UuaW5kZXhPZihhbHBoYWJldFtvZmZzZXRdKSA8IDApIHtcbiAgICAgICAgICB2YWx1ZS5wdXNoKGFscGhhYmV0W29mZnNldF0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZmxhZ3NbcnVsZVR5cGVdID0gdmFsdWVcbiAgICB9IGVsc2UgaWYgKHJ1bGVUeXBlID09PSAnS0VZJykge1xuICAgICAgcHVzaC5hcHBseShmbGFnc1tydWxlVHlwZV0sIHBhcnRzWzFdLnNwbGl0KCd8JykpXG4gICAgfSBlbHNlIGlmIChydWxlVHlwZSA9PT0gJ0NPTVBPVU5ETUlOJykge1xuICAgICAgZmxhZ3NbcnVsZVR5cGVdID0gTnVtYmVyKHBhcnRzWzFdKVxuICAgIH0gZWxzZSBpZiAocnVsZVR5cGUgPT09ICdPTkxZSU5DT01QT1VORCcpIHtcbiAgICAgIC8vIElmIHdlIGFkZCB0aGlzIE9OTFlJTkNPTVBPVU5EIGZsYWcgdG8gYGNvbXBvdW5kUnVsZUNvZGVzYCwgdGhlblxuICAgICAgLy8gYHBhcnNlRGljYCB3aWxsIGRvIHRoZSB3b3JrIG9mIHNhdmluZyB0aGUgbGlzdCBvZiB3b3JkcyB0aGF0IGFyZVxuICAgICAgLy8gY29tcG91bmQtb25seS5cbiAgICAgIGZsYWdzW3J1bGVUeXBlXSA9IHBhcnRzWzFdXG4gICAgICBjb21wb3VuZFJ1bGVDb2Rlc1twYXJ0c1sxXV0gPSBbXVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBydWxlVHlwZSA9PT0gJ0ZMQUcnIHx8XG4gICAgICBydWxlVHlwZSA9PT0gJ0tFRVBDQVNFJyB8fFxuICAgICAgcnVsZVR5cGUgPT09ICdOT1NVR0dFU1QnIHx8XG4gICAgICBydWxlVHlwZSA9PT0gJ1dPUkRDSEFSUydcbiAgICApIHtcbiAgICAgIGZsYWdzW3J1bGVUeXBlXSA9IHBhcnRzWzFdXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZmF1bHQgaGFuZGxpbmc6IHNldCB0aGVtIGZvciBub3cuXG4gICAgICBmbGFnc1tydWxlVHlwZV0gPSBwYXJ0c1sxXVxuICAgIH1cbiAgfVxuXG4gIC8vIERlZmF1bHQgZm9yIGBDT01QT1VORE1JTmAgaXMgYDNgLlxuICAvLyBTZWUgYG1hbiA0IGh1bnNwZWxsYC5cbiAgaWYgKGlzTmFOKGZsYWdzLkNPTVBPVU5ETUlOKSkge1xuICAgIGZsYWdzLkNPTVBPVU5ETUlOID0gM1xuICB9XG5cbiAgaWYgKCFmbGFncy5LRVkubGVuZ3RoKSB7XG4gICAgZmxhZ3MuS0VZID0gZGVmYXVsdEtleWJvYXJkTGF5b3V0XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgLSBEaWN0aW9uYXJpZXMgc2VlbSB0byBhbHdheXMgaGF2ZSB0aGlzLiAqL1xuICBpZiAoIWZsYWdzLlRSWSkge1xuICAgIGZsYWdzLlRSWSA9IGFscGhhYmV0LmNvbmNhdCgpXG4gIH1cblxuICBpZiAoIWZsYWdzLktFRVBDQVNFKSB7XG4gICAgZmxhZ3MuS0VFUENBU0UgPSBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjb21wb3VuZFJ1bGVDb2RlczogY29tcG91bmRSdWxlQ29kZXMsXG4gICAgcmVwbGFjZW1lbnRUYWJsZTogcmVwbGFjZW1lbnRUYWJsZSxcbiAgICBjb252ZXJzaW9uOiBjb252ZXJzaW9uLFxuICAgIGNvbXBvdW5kUnVsZXM6IGNvbXBvdW5kUnVsZXMsXG4gICAgcnVsZXM6IHJ1bGVzLFxuICAgIGZsYWdzOiBmbGFnc1xuICB9XG5cbiAgZnVuY3Rpb24gcHVzaExpbmUobGluZSkge1xuICAgIGxpbmUgPSBsaW5lLnRyaW0oKVxuXG4gICAgLy8gSGFzaCBjYW4gYmUgYSB2YWxpZCBmbGFnLCBzbyB3ZSBvbmx5IGRpc2NhcmQgbGluZSB0aGF0IHN0YXJ0cyB3aXRoIGl0LlxuICAgIGlmIChsaW5lICYmIGxpbmUuY2hhckNvZGVBdCgwKSAhPT0gMzUgLyogYCNgICovKSB7XG4gICAgICBsaW5lcy5wdXNoKGxpbmUpXG4gICAgfVxuICB9XG59XG5cbi8vIFdyYXAgdGhlIGBzb3VyY2VgIG9mIGFuIGV4cHJlc3Npb24tbGlrZSBzdHJpbmcgc28gdGhhdCBpdCBtYXRjaGVzIG9ubHkgYXRcbi8vIHRoZSBlbmQgb2YgYSB2YWx1ZS5cbmZ1bmN0aW9uIGVuZChzb3VyY2UpIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoc291cmNlICsgJyQnKVxufVxuXG4vLyBXcmFwIHRoZSBgc291cmNlYCBvZiBhbiBleHByZXNzaW9uLWxpa2Ugc3RyaW5nIHNvIHRoYXQgaXQgbWF0Y2hlcyBvbmx5IGF0XG4vLyB0aGUgc3RhcnQgb2YgYSB2YWx1ZS5cbmZ1bmN0aW9uIHN0YXJ0KHNvdXJjZSkge1xuICByZXR1cm4gbmV3IFJlZ0V4cCgnXicgKyBzb3VyY2UpXG59XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBub3JtYWxpemVcblxuLy8gTm9ybWFsaXplIGB2YWx1ZWAgd2l0aCBwYXR0ZXJucy5cbmZ1bmN0aW9uIG5vcm1hbGl6ZSh2YWx1ZSwgcGF0dGVybnMpIHtcbiAgdmFyIGluZGV4ID0gLTFcblxuICB3aGlsZSAoKytpbmRleCA8IHBhdHRlcm5zLmxlbmd0aCkge1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShwYXR0ZXJuc1tpbmRleF1bMF0sIHBhdHRlcm5zW2luZGV4XVsxXSlcbiAgfVxuXG4gIHJldHVybiB2YWx1ZVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gZmxhZ1xuXG4vLyBDaGVjayB3aGV0aGVyIGEgd29yZCBoYXMgYSBmbGFnLlxuZnVuY3Rpb24gZmxhZyh2YWx1ZXMsIHZhbHVlLCBmbGFncykge1xuICByZXR1cm4gZmxhZ3MgJiYgdmFsdWUgaW4gdmFsdWVzICYmIGZsYWdzLmluZGV4T2YodmFsdWVzW3ZhbHVlXSkgPiAtMVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBmbGFnID0gcmVxdWlyZSgnLi9mbGFnLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSBleGFjdFxuXG4vLyBDaGVjayBzcGVsbGluZyBvZiBgdmFsdWVgLCBleGFjdGx5LlxuZnVuY3Rpb24gZXhhY3QoY29udGV4dCwgdmFsdWUpIHtcbiAgdmFyIGluZGV4ID0gLTFcblxuICBpZiAoY29udGV4dC5kYXRhW3ZhbHVlXSkge1xuICAgIHJldHVybiAhZmxhZyhjb250ZXh0LmZsYWdzLCAnT05MWUlOQ09NUE9VTkQnLCBjb250ZXh0LmRhdGFbdmFsdWVdKVxuICB9XG5cbiAgLy8gQ2hlY2sgaWYgdGhpcyBtaWdodCBiZSBhIGNvbXBvdW5kIHdvcmQuXG4gIGlmICh2YWx1ZS5sZW5ndGggPj0gY29udGV4dC5mbGFncy5DT01QT1VORE1JTikge1xuICAgIHdoaWxlICgrK2luZGV4IDwgY29udGV4dC5jb21wb3VuZFJ1bGVzLmxlbmd0aCkge1xuICAgICAgaWYgKGNvbnRleHQuY29tcG91bmRSdWxlc1tpbmRleF0udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2Vcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgbm9ybWFsaXplID0gcmVxdWlyZSgnLi9ub3JtYWxpemUuanMnKVxudmFyIGV4YWN0ID0gcmVxdWlyZSgnLi9leGFjdC5qcycpXG52YXIgZmxhZyA9IHJlcXVpcmUoJy4vZmxhZy5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gZm9ybVxuXG4vLyBGaW5kIGEga25vd24gZm9ybSBvZiBgdmFsdWVgLlxuZnVuY3Rpb24gZm9ybShjb250ZXh0LCB2YWx1ZSwgYWxsKSB7XG4gIHZhciBub3JtYWwgPSB2YWx1ZS50cmltKClcbiAgdmFyIGFsdGVybmF0aXZlXG5cbiAgaWYgKCFub3JtYWwpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgbm9ybWFsID0gbm9ybWFsaXplKG5vcm1hbCwgY29udGV4dC5jb252ZXJzaW9uLmluKVxuXG4gIGlmIChleGFjdChjb250ZXh0LCBub3JtYWwpKSB7XG4gICAgaWYgKCFhbGwgJiYgZmxhZyhjb250ZXh0LmZsYWdzLCAnRk9SQklEREVOV09SRCcsIGNvbnRleHQuZGF0YVtub3JtYWxdKSkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICByZXR1cm4gbm9ybWFsXG4gIH1cblxuICAvLyBUcnkgc2VudGVuY2UgY2FzZSBpZiB0aGUgdmFsdWUgaXMgdXBwZXJjYXNlLlxuICBpZiAobm9ybWFsLnRvVXBwZXJDYXNlKCkgPT09IG5vcm1hbCkge1xuICAgIGFsdGVybmF0aXZlID0gbm9ybWFsLmNoYXJBdCgwKSArIG5vcm1hbC5zbGljZSgxKS50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiAoaWdub3JlKGNvbnRleHQuZmxhZ3MsIGNvbnRleHQuZGF0YVthbHRlcm5hdGl2ZV0sIGFsbCkpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgaWYgKGV4YWN0KGNvbnRleHQsIGFsdGVybmF0aXZlKSkge1xuICAgICAgcmV0dXJuIGFsdGVybmF0aXZlXG4gICAgfVxuICB9XG5cbiAgLy8gVHJ5IGxvd2VyY2FzZS5cbiAgYWx0ZXJuYXRpdmUgPSBub3JtYWwudG9Mb3dlckNhc2UoKVxuXG4gIGlmIChhbHRlcm5hdGl2ZSAhPT0gbm9ybWFsKSB7XG4gICAgaWYgKGlnbm9yZShjb250ZXh0LmZsYWdzLCBjb250ZXh0LmRhdGFbYWx0ZXJuYXRpdmVdLCBhbGwpKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGlmIChleGFjdChjb250ZXh0LCBhbHRlcm5hdGl2ZSkpIHtcbiAgICAgIHJldHVybiBhbHRlcm5hdGl2ZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbmZ1bmN0aW9uIGlnbm9yZShmbGFncywgZGljdCwgYWxsKSB7XG4gIHJldHVybiAoXG4gICAgZmxhZyhmbGFncywgJ0tFRVBDQVNFJywgZGljdCkgfHwgYWxsIHx8IGZsYWcoZmxhZ3MsICdGT1JCSURERU5XT1JEJywgZGljdClcbiAgKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBmb3JtID0gcmVxdWlyZSgnLi91dGlsL2Zvcm0uanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcnJlY3RcblxuLy8gQ2hlY2sgc3BlbGxpbmcgb2YgYHZhbHVlYC5cbmZ1bmN0aW9uIGNvcnJlY3QodmFsdWUpIHtcbiAgcmV0dXJuIEJvb2xlYW4oZm9ybSh0aGlzLCB2YWx1ZSkpXG59XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBjYXNpbmdcblxuLy8gR2V0IHRoZSBjYXNpbmcgb2YgYHZhbHVlYC5cbmZ1bmN0aW9uIGNhc2luZyh2YWx1ZSkge1xuICB2YXIgaGVhZCA9IGV4YWN0KHZhbHVlLmNoYXJBdCgwKSlcbiAgdmFyIHJlc3QgPSB2YWx1ZS5zbGljZSgxKVxuXG4gIGlmICghcmVzdCkge1xuICAgIHJldHVybiBoZWFkXG4gIH1cblxuICByZXN0ID0gZXhhY3QocmVzdClcblxuICBpZiAoaGVhZCA9PT0gcmVzdCkge1xuICAgIHJldHVybiBoZWFkXG4gIH1cblxuICBpZiAoaGVhZCA9PT0gJ3UnICYmIHJlc3QgPT09ICdsJykge1xuICAgIHJldHVybiAncydcbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbmZ1bmN0aW9uIGV4YWN0KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUudG9Mb3dlckNhc2UoKVxuICAgID8gJ2wnXG4gICAgOiB2YWx1ZSA9PT0gdmFsdWUudG9VcHBlckNhc2UoKVxuICAgID8gJ3UnXG4gICAgOiBudWxsXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIGNhc2luZyA9IHJlcXVpcmUoJy4vdXRpbC9jYXNpbmcuanMnKVxudmFyIG5vcm1hbGl6ZSA9IHJlcXVpcmUoJy4vdXRpbC9ub3JtYWxpemUuanMnKVxudmFyIGZsYWcgPSByZXF1aXJlKCcuL3V0aWwvZmxhZy5qcycpXG52YXIgZm9ybSA9IHJlcXVpcmUoJy4vdXRpbC9mb3JtLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSBzdWdnZXN0XG5cbnZhciBwdXNoID0gW10ucHVzaFxuXG4vLyBTdWdnZXN0IHNwZWxsaW5nIGZvciBgdmFsdWVgLlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHlcbmZ1bmN0aW9uIHN1Z2dlc3QodmFsdWUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHZhciBjaGFyQWRkZWQgPSB7fVxuICB2YXIgc3VnZ2VzdGlvbnMgPSBbXVxuICB2YXIgd2VpZ2h0ZWQgPSB7fVxuICB2YXIgbWVtb3J5XG4gIHZhciByZXBsYWNlbWVudFxuICB2YXIgZWRpdHMgPSBbXVxuICB2YXIgdmFsdWVzXG4gIHZhciBpbmRleFxuICB2YXIgb2Zmc2V0XG4gIHZhciBwb3NpdGlvblxuICB2YXIgY291bnRcbiAgdmFyIG90aGVyT2Zmc2V0XG4gIHZhciBvdGhlckNoYXJhY3RlclxuICB2YXIgY2hhcmFjdGVyXG4gIHZhciBncm91cFxuICB2YXIgYmVmb3JlXG4gIHZhciBhZnRlclxuICB2YXIgdXBwZXJcbiAgdmFyIGluc2Vuc2l0aXZlXG4gIHZhciBmaXJzdExldmVsXG4gIHZhciBwcmV2aW91c1xuICB2YXIgbmV4dFxuICB2YXIgbmV4dENoYXJhY3RlclxuICB2YXIgbWF4XG4gIHZhciBkaXN0YW5jZVxuICB2YXIgc2l6ZVxuICB2YXIgbm9ybWFsaXplZFxuICB2YXIgc3VnZ2VzdGlvblxuICB2YXIgY3VycmVudENhc2VcblxuICB2YWx1ZSA9IG5vcm1hbGl6ZSh2YWx1ZS50cmltKCksIHNlbGYuY29udmVyc2lvbi5pbilcblxuICBpZiAoIXZhbHVlIHx8IHNlbGYuY29ycmVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGN1cnJlbnRDYXNlID0gY2FzaW5nKHZhbHVlKVxuXG4gIC8vIENoZWNrIHRoZSByZXBsYWNlbWVudCB0YWJsZS5cbiAgaW5kZXggPSAtMVxuXG4gIHdoaWxlICgrK2luZGV4IDwgc2VsZi5yZXBsYWNlbWVudFRhYmxlLmxlbmd0aCkge1xuICAgIHJlcGxhY2VtZW50ID0gc2VsZi5yZXBsYWNlbWVudFRhYmxlW2luZGV4XVxuICAgIG9mZnNldCA9IHZhbHVlLmluZGV4T2YocmVwbGFjZW1lbnRbMF0pXG5cbiAgICB3aGlsZSAob2Zmc2V0ID4gLTEpIHtcbiAgICAgIGVkaXRzLnB1c2godmFsdWUucmVwbGFjZShyZXBsYWNlbWVudFswXSwgcmVwbGFjZW1lbnRbMV0pKVxuICAgICAgb2Zmc2V0ID0gdmFsdWUuaW5kZXhPZihyZXBsYWNlbWVudFswXSwgb2Zmc2V0ICsgMSlcbiAgICB9XG4gIH1cblxuICAvLyBDaGVjayB0aGUga2V5Ym9hcmQuXG4gIGluZGV4ID0gLTFcblxuICB3aGlsZSAoKytpbmRleCA8IHZhbHVlLmxlbmd0aCkge1xuICAgIGNoYXJhY3RlciA9IHZhbHVlLmNoYXJBdChpbmRleClcbiAgICBiZWZvcmUgPSB2YWx1ZS5zbGljZSgwLCBpbmRleClcbiAgICBhZnRlciA9IHZhbHVlLnNsaWNlKGluZGV4ICsgMSlcbiAgICBpbnNlbnNpdGl2ZSA9IGNoYXJhY3Rlci50b0xvd2VyQ2FzZSgpXG4gICAgdXBwZXIgPSBpbnNlbnNpdGl2ZSAhPT0gY2hhcmFjdGVyXG4gICAgY2hhckFkZGVkID0ge31cblxuICAgIG9mZnNldCA9IC0xXG5cbiAgICB3aGlsZSAoKytvZmZzZXQgPCBzZWxmLmZsYWdzLktFWS5sZW5ndGgpIHtcbiAgICAgIGdyb3VwID0gc2VsZi5mbGFncy5LRVlbb2Zmc2V0XVxuICAgICAgcG9zaXRpb24gPSBncm91cC5pbmRleE9mKGluc2Vuc2l0aXZlKVxuXG4gICAgICBpZiAocG9zaXRpb24gPCAwKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIG90aGVyT2Zmc2V0ID0gLTFcblxuICAgICAgd2hpbGUgKCsrb3RoZXJPZmZzZXQgPCBncm91cC5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG90aGVyT2Zmc2V0ICE9PSBwb3NpdGlvbikge1xuICAgICAgICAgIG90aGVyQ2hhcmFjdGVyID0gZ3JvdXAuY2hhckF0KG90aGVyT2Zmc2V0KVxuXG4gICAgICAgICAgaWYgKGNoYXJBZGRlZFtvdGhlckNoYXJhY3Rlcl0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2hhckFkZGVkW290aGVyQ2hhcmFjdGVyXSA9IHRydWVcblxuICAgICAgICAgIGlmICh1cHBlcikge1xuICAgICAgICAgICAgb3RoZXJDaGFyYWN0ZXIgPSBvdGhlckNoYXJhY3Rlci50b1VwcGVyQ2FzZSgpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZWRpdHMucHVzaChiZWZvcmUgKyBvdGhlckNoYXJhY3RlciArIGFmdGVyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2sgY2FzZXMgd2hlcmUgb25lIG9mIGEgZG91YmxlIGNoYXJhY3RlciB3YXMgZm9yZ290dGVuLCBvciBvbmUgdG9vIG1hbnlcbiAgLy8gd2VyZSBhZGRlZCwgdXAgdG8gdGhyZWUg4oCcZGlzdGFuY2Vz4oCdLiAgVGhpcyBpbmNyZWFzZXMgdGhlIHN1Y2Nlc3MtcmF0ZSBieSAyJVxuICAvLyBhbmQgc3BlZWRzIHRoZSBwcm9jZXNzIHVwIGJ5IDEzJS5cbiAgaW5kZXggPSAtMVxuICBuZXh0Q2hhcmFjdGVyID0gdmFsdWUuY2hhckF0KDApXG4gIHZhbHVlcyA9IFsnJ11cbiAgbWF4ID0gMVxuICBkaXN0YW5jZSA9IDBcblxuICB3aGlsZSAoKytpbmRleCA8IHZhbHVlLmxlbmd0aCkge1xuICAgIGNoYXJhY3RlciA9IG5leHRDaGFyYWN0ZXJcbiAgICBuZXh0Q2hhcmFjdGVyID0gdmFsdWUuY2hhckF0KGluZGV4ICsgMSlcbiAgICBiZWZvcmUgPSB2YWx1ZS5zbGljZSgwLCBpbmRleClcblxuICAgIHJlcGxhY2VtZW50ID0gY2hhcmFjdGVyID09PSBuZXh0Q2hhcmFjdGVyID8gJycgOiBjaGFyYWN0ZXIgKyBjaGFyYWN0ZXJcbiAgICBvZmZzZXQgPSAtMVxuICAgIGNvdW50ID0gdmFsdWVzLmxlbmd0aFxuXG4gICAgd2hpbGUgKCsrb2Zmc2V0IDwgY291bnQpIHtcbiAgICAgIGlmIChvZmZzZXQgPD0gbWF4KSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlc1tvZmZzZXRdICsgcmVwbGFjZW1lbnQpXG4gICAgICB9XG5cbiAgICAgIHZhbHVlc1tvZmZzZXRdICs9IGNoYXJhY3RlclxuICAgIH1cblxuICAgIGlmICgrK2Rpc3RhbmNlIDwgMykge1xuICAgICAgbWF4ID0gdmFsdWVzLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHB1c2guYXBwbHkoZWRpdHMsIHZhbHVlcylcblxuICAvLyBFbnN1cmUgdGhlIGNhcGl0YWxpc2VkIGFuZCB1cHBlcmNhc2UgdmFsdWVzIGFyZSBpbmNsdWRlZC5cbiAgdmFsdWVzID0gW3ZhbHVlXVxuICByZXBsYWNlbWVudCA9IHZhbHVlLnRvTG93ZXJDYXNlKClcblxuICBpZiAodmFsdWUgPT09IHJlcGxhY2VtZW50IHx8IGN1cnJlbnRDYXNlID09PSBudWxsKSB7XG4gICAgdmFsdWVzLnB1c2godmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyByZXBsYWNlbWVudC5zbGljZSgxKSlcbiAgfVxuXG4gIHJlcGxhY2VtZW50ID0gdmFsdWUudG9VcHBlckNhc2UoKVxuXG4gIGlmICh2YWx1ZSAhPT0gcmVwbGFjZW1lbnQpIHtcbiAgICB2YWx1ZXMucHVzaChyZXBsYWNlbWVudClcbiAgfVxuXG4gIC8vIENvbnN0cnVjdCBhIG1lbW9yeSBvYmplY3QgZm9yIGBnZW5lcmF0ZWAuXG4gIG1lbW9yeSA9IHtcbiAgICBzdGF0ZToge30sXG4gICAgd2VpZ2h0ZWQ6IHdlaWdodGVkLFxuICAgIHN1Z2dlc3Rpb25zOiBzdWdnZXN0aW9uc1xuICB9XG5cbiAgZmlyc3RMZXZlbCA9IGdlbmVyYXRlKHNlbGYsIG1lbW9yeSwgdmFsdWVzLCBlZGl0cylcblxuICAvLyBXaGlsZSB0aGVyZSBhcmUgbm8gc3VnZ2VzdGlvbnMgYmFzZWQgb24gZ2VuZXJhdGVkIHZhbHVlcyB3aXRoIGFuXG4gIC8vIGVkaXQtZGlzdGFuY2Ugb2YgYDFgLCBjaGVjayB0aGUgZ2VuZXJhdGVkIHZhbHVlcywgYFNJWkVgIGF0IGEgdGltZS5cbiAgLy8gQmFzaWNhbGx5LCB3ZeKAmXJlIGdlbmVyYXRpbmcgdmFsdWVzIHdpdGggYW4gZWRpdC1kaXN0YW5jZSBvZiBgMmAsIGJ1dCB3ZXJlXG4gIC8vIGRvaW5nIGl0IGluIHNtYWxsIGJhdGNoZXMgYmVjYXVzZSBpdOKAmXMgc3VjaCBhbiBleHBlbnNpdmUgb3BlcmF0aW9uLlxuICBwcmV2aW91cyA9IDBcbiAgbWF4ID0gTWF0aC5taW4oZmlyc3RMZXZlbC5sZW5ndGgsIE1hdGgucG93KE1hdGgubWF4KDE1IC0gdmFsdWUubGVuZ3RoLCAzKSwgMykpXG4gIHNpemUgPSBNYXRoLm1heChNYXRoLnBvdygxMCAtIHZhbHVlLmxlbmd0aCwgMyksIDEpXG5cbiAgd2hpbGUgKCFzdWdnZXN0aW9ucy5sZW5ndGggJiYgcHJldmlvdXMgPCBtYXgpIHtcbiAgICBuZXh0ID0gcHJldmlvdXMgKyBzaXplXG4gICAgZ2VuZXJhdGUoc2VsZiwgbWVtb3J5LCBmaXJzdExldmVsLnNsaWNlKHByZXZpb3VzLCBuZXh0KSlcbiAgICBwcmV2aW91cyA9IG5leHRcbiAgfVxuXG4gIC8vIFNvcnQgdGhlIHN1Z2dlc3Rpb25zIGJhc2VkIG9uIHRoZWlyIHdlaWdodC5cbiAgc3VnZ2VzdGlvbnMuc29ydChzb3J0KVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgb3V0cHV0LlxuICB2YWx1ZXMgPSBbXVxuICBub3JtYWxpemVkID0gW11cbiAgaW5kZXggPSAtMVxuXG4gIHdoaWxlICgrK2luZGV4IDwgc3VnZ2VzdGlvbnMubGVuZ3RoKSB7XG4gICAgc3VnZ2VzdGlvbiA9IG5vcm1hbGl6ZShzdWdnZXN0aW9uc1tpbmRleF0sIHNlbGYuY29udmVyc2lvbi5vdXQpXG4gICAgcmVwbGFjZW1lbnQgPSBzdWdnZXN0aW9uLnRvTG93ZXJDYXNlKClcblxuICAgIGlmIChub3JtYWxpemVkLmluZGV4T2YocmVwbGFjZW1lbnQpIDwgMCkge1xuICAgICAgdmFsdWVzLnB1c2goc3VnZ2VzdGlvbilcbiAgICAgIG5vcm1hbGl6ZWQucHVzaChyZXBsYWNlbWVudClcbiAgICB9XG4gIH1cblxuICAvLyBCT09NISBBbGwgZG9uZSFcbiAgcmV0dXJuIHZhbHVlc1xuXG4gIGZ1bmN0aW9uIHNvcnQoYSwgYikge1xuICAgIHJldHVybiBzb3J0V2VpZ2h0KGEsIGIpIHx8IHNvcnRDYXNpbmcoYSwgYikgfHwgc29ydEFscGhhKGEsIGIpXG4gIH1cblxuICBmdW5jdGlvbiBzb3J0V2VpZ2h0KGEsIGIpIHtcbiAgICByZXR1cm4gd2VpZ2h0ZWRbYV0gPT09IHdlaWdodGVkW2JdID8gMCA6IHdlaWdodGVkW2FdID4gd2VpZ2h0ZWRbYl0gPyAtMSA6IDFcbiAgfVxuXG4gIGZ1bmN0aW9uIHNvcnRDYXNpbmcoYSwgYikge1xuICAgIHZhciBsZWZ0Q2FzaW5nID0gY2FzaW5nKGEpXG4gICAgdmFyIHJpZ2h0Q2FzaW5nID0gY2FzaW5nKGIpXG5cbiAgICByZXR1cm4gbGVmdENhc2luZyA9PT0gcmlnaHRDYXNpbmdcbiAgICAgID8gMFxuICAgICAgOiBsZWZ0Q2FzaW5nID09PSBjdXJyZW50Q2FzZVxuICAgICAgPyAtMVxuICAgICAgOiByaWdodENhc2luZyA9PT0gY3VycmVudENhc2VcbiAgICAgID8gMVxuICAgICAgOiB1bmRlZmluZWRcbiAgfVxuXG4gIGZ1bmN0aW9uIHNvcnRBbHBoYShhLCBiKSB7XG4gICAgcmV0dXJuIGEubG9jYWxlQ29tcGFyZShiKVxuICB9XG59XG5cbi8vIEdldCBhIGxpc3Qgb2YgdmFsdWVzIGNsb3NlIGluIGVkaXQgZGlzdGFuY2UgdG8gYHdvcmRzYC5cbmZ1bmN0aW9uIGdlbmVyYXRlKGNvbnRleHQsIG1lbW9yeSwgd29yZHMsIGVkaXRzKSB7XG4gIHZhciBjaGFyYWN0ZXJzID0gY29udGV4dC5mbGFncy5UUllcbiAgdmFyIGRhdGEgPSBjb250ZXh0LmRhdGFcbiAgdmFyIGZsYWdzID0gY29udGV4dC5mbGFnc1xuICB2YXIgcmVzdWx0ID0gW11cbiAgdmFyIGluZGV4ID0gLTFcbiAgdmFyIHdvcmRcbiAgdmFyIGJlZm9yZVxuICB2YXIgY2hhcmFjdGVyXG4gIHZhciBuZXh0Q2hhcmFjdGVyXG4gIHZhciBuZXh0QWZ0ZXJcbiAgdmFyIG5leHROZXh0QWZ0ZXJcbiAgdmFyIG5leHRVcHBlclxuICB2YXIgY3VycmVudENhc2VcbiAgdmFyIHBvc2l0aW9uXG4gIHZhciBhZnRlclxuICB2YXIgdXBwZXJcbiAgdmFyIGluamVjdFxuICB2YXIgb2Zmc2V0XG5cbiAgLy8gQ2hlY2sgdGhlIHByZS1nZW5lcmF0ZWQgZWRpdHMuXG4gIGlmIChlZGl0cykge1xuICAgIHdoaWxlICgrK2luZGV4IDwgZWRpdHMubGVuZ3RoKSB7XG4gICAgICBjaGVjayhlZGl0c1tpbmRleF0sIHRydWUpXG4gICAgfVxuICB9XG5cbiAgLy8gSXRlcmF0ZSBvdmVyIGdpdmVuIHdvcmQuXG4gIGluZGV4ID0gLTFcblxuICB3aGlsZSAoKytpbmRleCA8IHdvcmRzLmxlbmd0aCkge1xuICAgIHdvcmQgPSB3b3Jkc1tpbmRleF1cbiAgICBiZWZvcmUgPSAnJ1xuICAgIGNoYXJhY3RlciA9ICcnXG4gICAgbmV4dENoYXJhY3RlciA9IHdvcmQuY2hhckF0KDApXG4gICAgbmV4dEFmdGVyID0gd29yZFxuICAgIG5leHROZXh0QWZ0ZXIgPSB3b3JkLnNsaWNlKDEpXG4gICAgbmV4dFVwcGVyID0gbmV4dENoYXJhY3Rlci50b0xvd2VyQ2FzZSgpICE9PSBuZXh0Q2hhcmFjdGVyXG4gICAgY3VycmVudENhc2UgPSBjYXNpbmcod29yZClcbiAgICBwb3NpdGlvbiA9IC0xXG5cbiAgICAvLyBJdGVyYXRlIG92ZXIgZXZlcnkgY2hhcmFjdGVyIChpbmNsdWRpbmcgdGhlIGVuZCkuXG4gICAgd2hpbGUgKCsrcG9zaXRpb24gPD0gd29yZC5sZW5ndGgpIHtcbiAgICAgIGJlZm9yZSArPSBjaGFyYWN0ZXJcbiAgICAgIGFmdGVyID0gbmV4dEFmdGVyXG4gICAgICBuZXh0QWZ0ZXIgPSBuZXh0TmV4dEFmdGVyXG4gICAgICBuZXh0TmV4dEFmdGVyID0gbmV4dEFmdGVyLnNsaWNlKDEpXG4gICAgICBjaGFyYWN0ZXIgPSBuZXh0Q2hhcmFjdGVyXG4gICAgICBuZXh0Q2hhcmFjdGVyID0gd29yZC5jaGFyQXQocG9zaXRpb24gKyAxKVxuICAgICAgdXBwZXIgPSBuZXh0VXBwZXJcblxuICAgICAgaWYgKG5leHRDaGFyYWN0ZXIpIHtcbiAgICAgICAgbmV4dFVwcGVyID0gbmV4dENoYXJhY3Rlci50b0xvd2VyQ2FzZSgpICE9PSBuZXh0Q2hhcmFjdGVyXG4gICAgICB9XG5cbiAgICAgIGlmIChuZXh0QWZ0ZXIgJiYgdXBwZXIgIT09IG5leHRVcHBlcikge1xuICAgICAgICAvLyBSZW1vdmUuXG4gICAgICAgIGNoZWNrKGJlZm9yZSArIHN3aXRjaENhc2UobmV4dEFmdGVyKSlcblxuICAgICAgICAvLyBTd2l0Y2guXG4gICAgICAgIGNoZWNrKFxuICAgICAgICAgIGJlZm9yZSArXG4gICAgICAgICAgICBzd2l0Y2hDYXNlKG5leHRDaGFyYWN0ZXIpICtcbiAgICAgICAgICAgIHN3aXRjaENhc2UoY2hhcmFjdGVyKSArXG4gICAgICAgICAgICBuZXh0TmV4dEFmdGVyXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlLlxuICAgICAgY2hlY2soYmVmb3JlICsgbmV4dEFmdGVyKVxuXG4gICAgICAvLyBTd2l0Y2guXG4gICAgICBpZiAobmV4dEFmdGVyKSB7XG4gICAgICAgIGNoZWNrKGJlZm9yZSArIG5leHRDaGFyYWN0ZXIgKyBjaGFyYWN0ZXIgKyBuZXh0TmV4dEFmdGVyKVxuICAgICAgfVxuXG4gICAgICAvLyBJdGVyYXRlIG92ZXIgYWxsIHBvc3NpYmxlIGxldHRlcnMuXG4gICAgICBvZmZzZXQgPSAtMVxuXG4gICAgICB3aGlsZSAoKytvZmZzZXQgPCBjaGFyYWN0ZXJzLmxlbmd0aCkge1xuICAgICAgICBpbmplY3QgPSBjaGFyYWN0ZXJzW29mZnNldF1cblxuICAgICAgICAvLyBUcnkgdXBwZXJjYXNlIGlmIHRoZSBvcmlnaW5hbCBjaGFyYWN0ZXIgd2FzIHVwcGVyY2FzZWQuXG4gICAgICAgIGlmICh1cHBlciAmJiBpbmplY3QgIT09IGluamVjdC50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRDYXNlICE9PSAncycpIHtcbiAgICAgICAgICAgIGNoZWNrKGJlZm9yZSArIGluamVjdCArIGFmdGVyKVxuICAgICAgICAgICAgY2hlY2soYmVmb3JlICsgaW5qZWN0ICsgbmV4dEFmdGVyKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGluamVjdCA9IGluamVjdC50b1VwcGVyQ2FzZSgpXG5cbiAgICAgICAgICBjaGVjayhiZWZvcmUgKyBpbmplY3QgKyBhZnRlcilcbiAgICAgICAgICBjaGVjayhiZWZvcmUgKyBpbmplY3QgKyBuZXh0QWZ0ZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQWRkIGFuZCByZXBsYWNlLlxuICAgICAgICAgIGNoZWNrKGJlZm9yZSArIGluamVjdCArIGFmdGVyKVxuICAgICAgICAgIGNoZWNrKGJlZm9yZSArIGluamVjdCArIG5leHRBZnRlcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgbGlzdCBvZiBnZW5lcmF0ZWQgd29yZHMuXG4gIHJldHVybiByZXN1bHRcblxuICAvLyBDaGVjayBhbmQgaGFuZGxlIGEgZ2VuZXJhdGVkIHZhbHVlLlxuICBmdW5jdGlvbiBjaGVjayh2YWx1ZSwgZG91YmxlKSB7XG4gICAgdmFyIHN0YXRlID0gbWVtb3J5LnN0YXRlW3ZhbHVlXVxuICAgIHZhciBjb3JyZWN0ZWRcblxuICAgIGlmIChzdGF0ZSAhPT0gQm9vbGVhbihzdGF0ZSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKVxuXG4gICAgICBjb3JyZWN0ZWQgPSBmb3JtKGNvbnRleHQsIHZhbHVlKVxuICAgICAgc3RhdGUgPSBjb3JyZWN0ZWQgJiYgIWZsYWcoZmxhZ3MsICdOT1NVR0dFU1QnLCBkYXRhW2NvcnJlY3RlZF0pXG5cbiAgICAgIG1lbW9yeS5zdGF0ZVt2YWx1ZV0gPSBzdGF0ZVxuXG4gICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgbWVtb3J5LndlaWdodGVkW3ZhbHVlXSA9IGRvdWJsZSA/IDEwIDogMFxuICAgICAgICBtZW1vcnkuc3VnZ2VzdGlvbnMucHVzaCh2YWx1ZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RhdGUpIHtcbiAgICAgIG1lbW9yeS53ZWlnaHRlZFt2YWx1ZV0rK1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN3aXRjaENhc2UoZnJhZ21lbnQpIHtcbiAgICB2YXIgZmlyc3QgPSBmcmFnbWVudC5jaGFyQXQoMClcblxuICAgIHJldHVybiAoXG4gICAgICAoZmlyc3QudG9Mb3dlckNhc2UoKSA9PT0gZmlyc3RcbiAgICAgICAgPyBmaXJzdC50b1VwcGVyQ2FzZSgpXG4gICAgICAgIDogZmlyc3QudG9Mb3dlckNhc2UoKSkgKyBmcmFnbWVudC5zbGljZSgxKVxuICAgIClcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBmb3JtID0gcmVxdWlyZSgnLi91dGlsL2Zvcm0uanMnKVxudmFyIGZsYWcgPSByZXF1aXJlKCcuL3V0aWwvZmxhZy5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gc3BlbGxcblxuLy8gQ2hlY2sgc3BlbGxpbmcgb2YgYHdvcmRgLlxuZnVuY3Rpb24gc3BlbGwod29yZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIHZhbHVlID0gZm9ybShzZWxmLCB3b3JkLCB0cnVlKVxuXG4gIC8vIEh1bnNwZWxsIGFsc28gcHJvdmlkZXMgYHJvb3RgIChyb290IHdvcmQgb2YgdGhlIGlucHV0IHdvcmQpLCBhbmQgYGNvbXBvdW5kYFxuICAvLyAod2hldGhlciBgd29yZGAgd2FzIGNvbXBvdW5kKS5cbiAgcmV0dXJuIHtcbiAgICBjb3JyZWN0OiBzZWxmLmNvcnJlY3Qod29yZCksXG4gICAgZm9yYmlkZGVuOiBCb29sZWFuKFxuICAgICAgdmFsdWUgJiYgZmxhZyhzZWxmLmZsYWdzLCAnRk9SQklEREVOV09SRCcsIHNlbGYuZGF0YVt2YWx1ZV0pXG4gICAgKSxcbiAgICB3YXJuOiBCb29sZWFuKHZhbHVlICYmIGZsYWcoc2VsZi5mbGFncywgJ1dBUk4nLCBzZWxmLmRhdGFbdmFsdWVdKSlcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHlcblxuLy8gQXBwbHkgYSBydWxlLlxuZnVuY3Rpb24gYXBwbHkodmFsdWUsIHJ1bGUsIHJ1bGVzLCB3b3Jkcykge1xuICB2YXIgaW5kZXggPSAtMVxuICB2YXIgZW50cnlcbiAgdmFyIG5leHRcbiAgdmFyIGNvbnRpbnVhdGlvblJ1bGVcbiAgdmFyIGNvbnRpbnVhdGlvblxuICB2YXIgcG9zaXRpb25cblxuICB3aGlsZSAoKytpbmRleCA8IHJ1bGUuZW50cmllcy5sZW5ndGgpIHtcbiAgICBlbnRyeSA9IHJ1bGUuZW50cmllc1tpbmRleF1cbiAgICBjb250aW51YXRpb24gPSBlbnRyeS5jb250aW51YXRpb25cbiAgICBwb3NpdGlvbiA9IC0xXG5cbiAgICBpZiAoIWVudHJ5Lm1hdGNoIHx8IGVudHJ5Lm1hdGNoLnRlc3QodmFsdWUpKSB7XG4gICAgICBuZXh0ID0gZW50cnkucmVtb3ZlID8gdmFsdWUucmVwbGFjZShlbnRyeS5yZW1vdmUsICcnKSA6IHZhbHVlXG4gICAgICBuZXh0ID0gcnVsZS50eXBlID09PSAnU0ZYJyA/IG5leHQgKyBlbnRyeS5hZGQgOiBlbnRyeS5hZGQgKyBuZXh0XG4gICAgICB3b3Jkcy5wdXNoKG5leHQpXG5cbiAgICAgIGlmIChjb250aW51YXRpb24gJiYgY29udGludWF0aW9uLmxlbmd0aCkge1xuICAgICAgICB3aGlsZSAoKytwb3NpdGlvbiA8IGNvbnRpbnVhdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgICBjb250aW51YXRpb25SdWxlID0gcnVsZXNbY29udGludWF0aW9uW3Bvc2l0aW9uXV1cblxuICAgICAgICAgIGlmIChjb250aW51YXRpb25SdWxlKSB7XG4gICAgICAgICAgICBhcHBseShuZXh0LCBjb250aW51YXRpb25SdWxlLCBydWxlcywgd29yZHMpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHdvcmRzXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIGFwcGx5ID0gcmVxdWlyZSgnLi9hcHBseS5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gYWRkXG5cbnZhciBwdXNoID0gW10ucHVzaFxuXG52YXIgTk9fUlVMRVMgPSBbXVxuXG4vLyBBZGQgYHJ1bGVzYCBmb3IgYHdvcmRgIHRvIHRoZSB0YWJsZS5cbmZ1bmN0aW9uIGFkZFJ1bGVzKGRpY3QsIHdvcmQsIHJ1bGVzKSB7XG4gIHZhciBjdXJyID0gZGljdFt3b3JkXVxuXG4gIC8vIFNvbWUgZGljdGlvbmFyaWVzIHdpbGwgbGlzdCB0aGUgc2FtZSB3b3JkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50XG4gIC8vIHJ1bGUgc2V0cy5cbiAgaWYgKHdvcmQgaW4gZGljdCkge1xuICAgIGlmIChjdXJyID09PSBOT19SVUxFUykge1xuICAgICAgZGljdFt3b3JkXSA9IHJ1bGVzLmNvbmNhdCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHB1c2guYXBwbHkoY3VyciwgcnVsZXMpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGRpY3Rbd29yZF0gPSBydWxlcy5jb25jYXQoKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFkZChkaWN0LCB3b3JkLCBjb2Rlcywgb3B0aW9ucykge1xuICB2YXIgcG9zaXRpb24gPSAtMVxuICB2YXIgcnVsZVxuICB2YXIgb2Zmc2V0XG4gIHZhciBzdWJwb3NpdGlvblxuICB2YXIgc3Vib2Zmc2V0XG4gIHZhciBjb21iaW5lZFxuICB2YXIgbmV3V29yZHNcbiAgdmFyIG90aGVyTmV3V29yZHNcblxuICAvLyBDb21wb3VuZCB3b3Jkcy5cbiAgaWYgKFxuICAgICEoJ05FRURBRkZJWCcgaW4gb3B0aW9ucy5mbGFncykgfHxcbiAgICBjb2Rlcy5pbmRleE9mKG9wdGlvbnMuZmxhZ3MuTkVFREFGRklYKSA8IDBcbiAgKSB7XG4gICAgYWRkUnVsZXMoZGljdCwgd29yZCwgY29kZXMpXG4gIH1cblxuICB3aGlsZSAoKytwb3NpdGlvbiA8IGNvZGVzLmxlbmd0aCkge1xuICAgIHJ1bGUgPSBvcHRpb25zLnJ1bGVzW2NvZGVzW3Bvc2l0aW9uXV1cblxuICAgIGlmIChjb2Rlc1twb3NpdGlvbl0gaW4gb3B0aW9ucy5jb21wb3VuZFJ1bGVDb2Rlcykge1xuICAgICAgb3B0aW9ucy5jb21wb3VuZFJ1bGVDb2Rlc1tjb2Rlc1twb3NpdGlvbl1dLnB1c2god29yZClcbiAgICB9XG5cbiAgICBpZiAocnVsZSkge1xuICAgICAgbmV3V29yZHMgPSBhcHBseSh3b3JkLCBydWxlLCBvcHRpb25zLnJ1bGVzLCBbXSlcbiAgICAgIG9mZnNldCA9IC0xXG5cbiAgICAgIHdoaWxlICgrK29mZnNldCA8IG5ld1dvcmRzLmxlbmd0aCkge1xuICAgICAgICBpZiAoIShuZXdXb3Jkc1tvZmZzZXRdIGluIGRpY3QpKSB7XG4gICAgICAgICAgZGljdFtuZXdXb3Jkc1tvZmZzZXRdXSA9IE5PX1JVTEVTXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocnVsZS5jb21iaW5lYWJsZSkge1xuICAgICAgICAgIHN1YnBvc2l0aW9uID0gcG9zaXRpb25cblxuICAgICAgICAgIHdoaWxlICgrK3N1YnBvc2l0aW9uIDwgY29kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21iaW5lZCA9IG9wdGlvbnMucnVsZXNbY29kZXNbc3VicG9zaXRpb25dXVxuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGNvbWJpbmVkICYmXG4gICAgICAgICAgICAgIGNvbWJpbmVkLmNvbWJpbmVhYmxlICYmXG4gICAgICAgICAgICAgIHJ1bGUudHlwZSAhPT0gY29tYmluZWQudHlwZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIG90aGVyTmV3V29yZHMgPSBhcHBseShcbiAgICAgICAgICAgICAgICBuZXdXb3Jkc1tvZmZzZXRdLFxuICAgICAgICAgICAgICAgIGNvbWJpbmVkLFxuICAgICAgICAgICAgICAgIG9wdGlvbnMucnVsZXMsXG4gICAgICAgICAgICAgICAgW11cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBzdWJvZmZzZXQgPSAtMVxuXG4gICAgICAgICAgICAgIHdoaWxlICgrK3N1Ym9mZnNldCA8IG90aGVyTmV3V29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEob3RoZXJOZXdXb3Jkc1tzdWJvZmZzZXRdIGluIGRpY3QpKSB7XG4gICAgICAgICAgICAgICAgICBkaWN0W290aGVyTmV3V29yZHNbc3Vib2Zmc2V0XV0gPSBOT19SVUxFU1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBwdXNoID0gcmVxdWlyZSgnLi91dGlsL2FkZC5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gYWRkXG5cbnZhciBOT19DT0RFUyA9IFtdXG5cbi8vIEFkZCBgdmFsdWVgIHRvIHRoZSBjaGVja2VyLlxuZnVuY3Rpb24gYWRkKHZhbHVlLCBtb2RlbCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBwdXNoKHNlbGYuZGF0YSwgdmFsdWUsIHNlbGYuZGF0YVttb2RlbF0gfHwgTk9fQ09ERVMsIHNlbGYpXG5cbiAgcmV0dXJuIHNlbGZcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbW92ZVxuXG4vLyBSZW1vdmUgYHZhbHVlYCBmcm9tIHRoZSBjaGVja2VyLlxuZnVuY3Rpb24gcmVtb3ZlKHZhbHVlKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGRlbGV0ZSBzZWxmLmRhdGFbdmFsdWVdXG5cbiAgcmV0dXJuIHNlbGZcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdvcmRDaGFyYWN0ZXJzXG5cbi8vIEdldCB0aGUgd29yZCBjaGFyYWN0ZXJzIGRlZmluZWQgaW4gYWZmaXguXG5mdW5jdGlvbiB3b3JkQ2hhcmFjdGVycygpIHtcbiAgcmV0dXJuIHRoaXMuZmxhZ3MuV09SRENIQVJTIHx8IG51bGxcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgcGFyc2VDb2RlcyA9IHJlcXVpcmUoJy4vcnVsZS1jb2Rlcy5qcycpXG52YXIgYWRkID0gcmVxdWlyZSgnLi9hZGQuanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlXG5cbi8vIEV4cHJlc3Npb25zLlxudmFyIHdoaXRlU3BhY2VFeHByZXNzaW9uID0gL1xccy9nXG5cbi8vIFBhcnNlIGEgZGljdGlvbmFyeS5cbmZ1bmN0aW9uIHBhcnNlKGJ1Ziwgb3B0aW9ucywgZGljdCkge1xuICAvLyBQYXJzZSBhcyBsaW5lcyAoaWdub3JpbmcgdGhlIGZpcnN0IGxpbmUpLlxuICB2YXIgdmFsdWUgPSBidWYudG9TdHJpbmcoJ3V0ZjgnKVxuICB2YXIgbGFzdCA9IHZhbHVlLmluZGV4T2YoJ1xcbicpICsgMVxuICB2YXIgaW5kZXggPSB2YWx1ZS5pbmRleE9mKCdcXG4nLCBsYXN0KVxuXG4gIHdoaWxlIChpbmRleCA+IC0xKSB7XG4gICAgLy8gU29tZSBkaWN0aW9uYXJpZXMgdXNlIHRhYnMgYXMgY29tbWVudHMuXG4gICAgaWYgKHZhbHVlLmNoYXJDb2RlQXQobGFzdCkgIT09IDkgLyogYFxcdGAgKi8pIHtcbiAgICAgIHBhcnNlTGluZSh2YWx1ZS5zbGljZShsYXN0LCBpbmRleCksIG9wdGlvbnMsIGRpY3QpXG4gICAgfVxuXG4gICAgbGFzdCA9IGluZGV4ICsgMVxuICAgIGluZGV4ID0gdmFsdWUuaW5kZXhPZignXFxuJywgbGFzdClcbiAgfVxuXG4gIHBhcnNlTGluZSh2YWx1ZS5zbGljZShsYXN0KSwgb3B0aW9ucywgZGljdClcbn1cblxuLy8gUGFyc2UgYSBsaW5lIGluIGRpY3Rpb25hcnkuXG5mdW5jdGlvbiBwYXJzZUxpbmUobGluZSwgb3B0aW9ucywgZGljdCkge1xuICB2YXIgc2xhc2hPZmZzZXQgPSBsaW5lLmluZGV4T2YoJy8nKVxuICB2YXIgaGFzaE9mZnNldCA9IGxpbmUuaW5kZXhPZignIycpXG4gIHZhciBjb2RlcyA9ICcnXG4gIHZhciB3b3JkXG4gIHZhciByZXN1bHRcblxuICAvLyBGaW5kIG9mZnNldHMuXG4gIHdoaWxlIChcbiAgICBzbGFzaE9mZnNldCA+IC0xICYmXG4gICAgbGluZS5jaGFyQ29kZUF0KHNsYXNoT2Zmc2V0IC0gMSkgPT09IDkyIC8qIGBcXGAgKi9cbiAgKSB7XG4gICAgbGluZSA9IGxpbmUuc2xpY2UoMCwgc2xhc2hPZmZzZXQgLSAxKSArIGxpbmUuc2xpY2Uoc2xhc2hPZmZzZXQpXG4gICAgc2xhc2hPZmZzZXQgPSBsaW5lLmluZGV4T2YoJy8nLCBzbGFzaE9mZnNldClcbiAgfVxuXG4gIC8vIEhhbmRsZSBoYXNoIGFuZCBzbGFzaCBvZmZzZXRzLlxuICAvLyBOb3RlIHRoYXQgaGFzaCBjYW4gYmUgYSB2YWxpZCBmbGFnLCBzbyB3ZSBzaG91bGQgbm90IGp1c3QgZGlzY2FyZFxuICAvLyBldmVyeXRoaW5nIGFmdGVyIGl0LlxuICBpZiAoaGFzaE9mZnNldCA+IC0xKSB7XG4gICAgaWYgKHNsYXNoT2Zmc2V0ID4gLTEgJiYgc2xhc2hPZmZzZXQgPCBoYXNoT2Zmc2V0KSB7XG4gICAgICB3b3JkID0gbGluZS5zbGljZSgwLCBzbGFzaE9mZnNldClcbiAgICAgIHdoaXRlU3BhY2VFeHByZXNzaW9uLmxhc3RJbmRleCA9IHNsYXNoT2Zmc2V0ICsgMVxuICAgICAgcmVzdWx0ID0gd2hpdGVTcGFjZUV4cHJlc3Npb24uZXhlYyhsaW5lKVxuICAgICAgY29kZXMgPSBsaW5lLnNsaWNlKHNsYXNoT2Zmc2V0ICsgMSwgcmVzdWx0ID8gcmVzdWx0LmluZGV4IDogdW5kZWZpbmVkKVxuICAgIH0gZWxzZSB7XG4gICAgICB3b3JkID0gbGluZS5zbGljZSgwLCBoYXNoT2Zmc2V0KVxuICAgIH1cbiAgfSBlbHNlIGlmIChzbGFzaE9mZnNldCA+IC0xKSB7XG4gICAgd29yZCA9IGxpbmUuc2xpY2UoMCwgc2xhc2hPZmZzZXQpXG4gICAgY29kZXMgPSBsaW5lLnNsaWNlKHNsYXNoT2Zmc2V0ICsgMSlcbiAgfSBlbHNlIHtcbiAgICB3b3JkID0gbGluZVxuICB9XG5cbiAgd29yZCA9IHdvcmQudHJpbSgpXG5cbiAgaWYgKHdvcmQpIHtcbiAgICBhZGQoZGljdCwgd29yZCwgcGFyc2VDb2RlcyhvcHRpb25zLmZsYWdzLCBjb2Rlcy50cmltKCkpLCBvcHRpb25zKVxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIHBhcnNlID0gcmVxdWlyZSgnLi91dGlsL2RpY3Rpb25hcnkuanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZFxuXG4vLyBBZGQgYSBkaWN0aW9uYXJ5IGZpbGUuXG5mdW5jdGlvbiBhZGQoYnVmKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgaW5kZXggPSAtMVxuICB2YXIgcnVsZVxuICB2YXIgc291cmNlXG4gIHZhciBjaGFyYWN0ZXJcbiAgdmFyIG9mZnNldFxuXG4gIHBhcnNlKGJ1Ziwgc2VsZiwgc2VsZi5kYXRhKVxuXG4gIC8vIFJlZ2VuZXJhdGUgY29tcG91bmQgZXhwcmVzc2lvbnMuXG4gIHdoaWxlICgrK2luZGV4IDwgc2VsZi5jb21wb3VuZFJ1bGVzLmxlbmd0aCkge1xuICAgIHJ1bGUgPSBzZWxmLmNvbXBvdW5kUnVsZXNbaW5kZXhdXG4gICAgc291cmNlID0gJydcbiAgICBvZmZzZXQgPSAtMVxuXG4gICAgd2hpbGUgKCsrb2Zmc2V0IDwgcnVsZS5sZW5ndGgpIHtcbiAgICAgIGNoYXJhY3RlciA9IHJ1bGUuY2hhckF0KG9mZnNldClcbiAgICAgIHNvdXJjZSArPSBzZWxmLmNvbXBvdW5kUnVsZUNvZGVzW2NoYXJhY3Rlcl0ubGVuZ3RoXG4gICAgICAgID8gJyg/OicgKyBzZWxmLmNvbXBvdW5kUnVsZUNvZGVzW2NoYXJhY3Rlcl0uam9pbignfCcpICsgJyknXG4gICAgICAgIDogY2hhcmFjdGVyXG4gICAgfVxuXG4gICAgc2VsZi5jb21wb3VuZFJ1bGVzW2luZGV4XSA9IG5ldyBSZWdFeHAoc291cmNlLCAnaScpXG4gIH1cblxuICByZXR1cm4gc2VsZlxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gYWRkXG5cbi8vIEFkZCBhIGRpY3Rpb25hcnkuXG5mdW5jdGlvbiBhZGQoYnVmKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgbGluZXMgPSBidWYudG9TdHJpbmcoJ3V0ZjgnKS5zcGxpdCgnXFxuJylcbiAgdmFyIGluZGV4ID0gLTFcbiAgdmFyIGxpbmVcbiAgdmFyIGZvcmJpZGRlblxuICB2YXIgd29yZFxuICB2YXIgZmxhZ1xuXG4gIC8vIEVuc3VyZSB0aGVyZeKAmXMgYSBrZXkgZm9yIGBGT1JCSURERU5XT1JEYDogYGZhbHNlYCBjYW5ub3QgYmUgc2V0IHRocm91Z2ggYW5cbiAgLy8gYWZmaXggZmlsZSBzbyBpdHMgc2FmZSB0byB1c2UgYXMgYSBtYWdpYyBjb25zdGFudC5cbiAgaWYgKHNlbGYuZmxhZ3MuRk9SQklEREVOV09SRCA9PT0gdW5kZWZpbmVkKSBzZWxmLmZsYWdzLkZPUkJJRERFTldPUkQgPSBmYWxzZVxuICBmbGFnID0gc2VsZi5mbGFncy5GT1JCSURERU5XT1JEXG5cbiAgd2hpbGUgKCsraW5kZXggPCBsaW5lcy5sZW5ndGgpIHtcbiAgICBsaW5lID0gbGluZXNbaW5kZXhdLnRyaW0oKVxuXG4gICAgaWYgKCFsaW5lKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIGxpbmUgPSBsaW5lLnNwbGl0KCcvJylcbiAgICB3b3JkID0gbGluZVswXVxuICAgIGZvcmJpZGRlbiA9IHdvcmQuY2hhckF0KDApID09PSAnKidcblxuICAgIGlmIChmb3JiaWRkZW4pIHtcbiAgICAgIHdvcmQgPSB3b3JkLnNsaWNlKDEpXG4gICAgfVxuXG4gICAgc2VsZi5hZGQod29yZCwgbGluZVsxXSlcblxuICAgIGlmIChmb3JiaWRkZW4pIHtcbiAgICAgIHNlbGYuZGF0YVt3b3JkXS5wdXNoKGZsYWcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNlbGZcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgYnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJylcbnZhciBhZmZpeCA9IHJlcXVpcmUoJy4vdXRpbC9hZmZpeC5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gTlNwZWxsXG5cbnZhciBwcm90byA9IE5TcGVsbC5wcm90b3R5cGVcblxucHJvdG8uY29ycmVjdCA9IHJlcXVpcmUoJy4vY29ycmVjdC5qcycpXG5wcm90by5zdWdnZXN0ID0gcmVxdWlyZSgnLi9zdWdnZXN0LmpzJylcbnByb3RvLnNwZWxsID0gcmVxdWlyZSgnLi9zcGVsbC5qcycpXG5wcm90by5hZGQgPSByZXF1aXJlKCcuL2FkZC5qcycpXG5wcm90by5yZW1vdmUgPSByZXF1aXJlKCcuL3JlbW92ZS5qcycpXG5wcm90by53b3JkQ2hhcmFjdGVycyA9IHJlcXVpcmUoJy4vd29yZC1jaGFyYWN0ZXJzLmpzJylcbnByb3RvLmRpY3Rpb25hcnkgPSByZXF1aXJlKCcuL2RpY3Rpb25hcnkuanMnKVxucHJvdG8ucGVyc29uYWwgPSByZXF1aXJlKCcuL3BlcnNvbmFsLmpzJylcblxuLy8gQ29uc3RydWN0IGEgbmV3IHNwZWxsaW5nIGNvbnRleHQuXG5mdW5jdGlvbiBOU3BlbGwoYWZmLCBkaWMpIHtcbiAgdmFyIGluZGV4ID0gLTFcbiAgdmFyIGRpY3Rpb25hcmllc1xuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBOU3BlbGwpKSB7XG4gICAgcmV0dXJuIG5ldyBOU3BlbGwoYWZmLCBkaWMpXG4gIH1cblxuICBpZiAodHlwZW9mIGFmZiA9PT0gJ3N0cmluZycgfHwgYnVmZmVyKGFmZikpIHtcbiAgICBpZiAodHlwZW9mIGRpYyA9PT0gJ3N0cmluZycgfHwgYnVmZmVyKGRpYykpIHtcbiAgICAgIGRpY3Rpb25hcmllcyA9IFt7ZGljOiBkaWN9XVxuICAgIH1cbiAgfSBlbHNlIGlmIChhZmYpIHtcbiAgICBpZiAoJ2xlbmd0aCcgaW4gYWZmKSB7XG4gICAgICBkaWN0aW9uYXJpZXMgPSBhZmZcbiAgICAgIGFmZiA9IGFmZlswXSAmJiBhZmZbMF0uYWZmXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhZmYuZGljKSB7XG4gICAgICAgIGRpY3Rpb25hcmllcyA9IFthZmZdXG4gICAgICB9XG5cbiAgICAgIGFmZiA9IGFmZi5hZmZcbiAgICB9XG4gIH1cblxuICBpZiAoIWFmZikge1xuICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBgYWZmYCBpbiBkaWN0aW9uYXJ5JylcbiAgfVxuXG4gIGFmZiA9IGFmZml4KGFmZilcblxuICB0aGlzLmRhdGEgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIHRoaXMuY29tcG91bmRSdWxlQ29kZXMgPSBhZmYuY29tcG91bmRSdWxlQ29kZXNcbiAgdGhpcy5yZXBsYWNlbWVudFRhYmxlID0gYWZmLnJlcGxhY2VtZW50VGFibGVcbiAgdGhpcy5jb252ZXJzaW9uID0gYWZmLmNvbnZlcnNpb25cbiAgdGhpcy5jb21wb3VuZFJ1bGVzID0gYWZmLmNvbXBvdW5kUnVsZXNcbiAgdGhpcy5ydWxlcyA9IGFmZi5ydWxlc1xuICB0aGlzLmZsYWdzID0gYWZmLmZsYWdzXG5cbiAgaWYgKGRpY3Rpb25hcmllcykge1xuICAgIHdoaWxlICgrK2luZGV4IDwgZGljdGlvbmFyaWVzLmxlbmd0aCkge1xuICAgICAgaWYgKGRpY3Rpb25hcmllc1tpbmRleF0uZGljKSB7XG4gICAgICAgIHRoaXMuZGljdGlvbmFyeShkaWN0aW9uYXJpZXNbaW5kZXhdLmRpYylcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIFNwZWxsQ2hlY2tlciB7XG4gIGFic3RyYWN0IGFkZFdvcmQod29yZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcbiAgYWJzdHJhY3QgYWRkV29yZHMod29yZHM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPjtcbiAgYWJzdHJhY3QgcmVtb3ZlV29yZCh3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xuICBhYnN0cmFjdCByZW1vdmVXb3Jkcyh3b3Jkczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+O1xuICBhYnN0cmFjdCBzdWdnZXN0KHdvcmQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+O1xuICBhYnN0cmFjdCBjb3JyZWN0KHdvcmQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj47XG59XG4iLCJpbXBvcnQgU3BlbGxDaGVja2VyIGZyb20gXCIuL2Fic3RyYWN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5TcGVsbENoZWNrZXIgZXh0ZW5kcyBTcGVsbENoZWNrZXIge1xuICBuU3BlbGw6IE5zcGVsbDtcblxuICBjb25zdHJ1Y3RvcihuU3BlbGw6IE5zcGVsbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5uU3BlbGwgPSBuU3BlbGw7XG4gIH07XG5cbiAgYWRkV29yZCh3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLm5TcGVsbC5hZGQod29yZCk7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgYXN5bmMgYWRkV29yZHMod29yZHM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwod29yZHMubWFwKHdvcmQgPT4gdGhpcy5hZGRXb3JkKHdvcmQpKSk7XG4gIH1cblxuICByZW1vdmVXb3JkKHdvcmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMublNwZWxsLnJlbW92ZSh3b3JkKTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBhc3luYyByZW1vdmVXb3Jkcyh3b3Jkczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBQcm9taXNlLmFsbCh3b3Jkcy5tYXAod29yZCA9PiB0aGlzLnJlbW92ZVdvcmQod29yZCkpKTtcbiAgfVxuXG4gIHN1Z2dlc3Qod29yZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5uU3BlbGwuc3VnZ2VzdCh3b3JkKSk7XG4gIH1cblxuICBjb3JyZWN0KHdvcmQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5uU3BlbGwuY29ycmVjdCh3b3JkKSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFzc2VydGlvbkVycm9yIH0gZnJvbSBcImFzc2VydFwiO1xuaW1wb3J0IG5zcGVsbCBmcm9tIFwibnNwZWxsXCI7XG5pbXBvcnQgeyBEaWN0cmlvbmFyeVJlc3VsdCB9IGZyb20gXCJzcmMvdHlwZXMvZGljdGlvbmFyeVwiO1xuaW1wb3J0IFNwZWxsQ2hlY2tlciBmcm9tICdzcmMvc3BlbGxDaGVja2VyL2Fic3RyYWN0JztcbmltcG9ydCBOU3BlbGxDaGVja2VyIGZyb20gJ3NyYy9zcGVsbENoZWNrZXIvblNwZWxsQ2hlY2tlcic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTcGVsbENoZWNrZXJGYWN0b3J5IHtcbiAgYWJzdHJhY3QgZ2V0U3BlbGxDaGVja2VyKCk6IFByb21pc2U8U3BlbGxDaGVja2VyPjtcbn1cblxudHlwZSBEaWN0aW9uYXJ5TG9hZGVyID0gKGFmZlVyaTogc3RyaW5nLCBkaWNVcmk6IHN0cmluZykgPT4gUHJvbWlzZTxEaWN0cmlvbmFyeVJlc3VsdD47XG5cbmV4cG9ydCBjbGFzcyBOU3BlbGxDaGVja2VyRmFjdG9yeSBleHRlbmRzIFNwZWxsQ2hlY2tlckZhY3Rvcnkge1xuICBfYWZmVXJpczogc3RyaW5nW107XG4gIF9kaWNVcmlzOiBzdHJpbmdbXTtcbiAgbG9hZERpY3Rpb25hcnk6IERpY3Rpb25hcnlMb2FkZXI7XG5cbiAgY29uc3RydWN0b3IoYWZmVXJpczogc3RyaW5nW10sIGRpY1VyaXM6IHN0cmluZ1tdLCBsb2FkRGljdGlvbmFyeTogRGljdGlvbmFyeUxvYWRlcikge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoYWZmVXJpcy5sZW5ndGggIT09IGRpY1VyaXMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgQXNzZXJ0aW9uRXJyb3IoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hZmZVcmlzID0gYWZmVXJpcztcbiAgICB0aGlzLl9kaWNVcmlzID0gZGljVXJpcztcbiAgICB0aGlzLmxvYWREaWN0aW9uYXJ5ID0gbG9hZERpY3Rpb25hcnk7XG4gIH1cblxuICBhc3luYyBnZXRTcGVsbENoZWNrZXIoKTogUHJvbWlzZTxTcGVsbENoZWNrZXI+IHtcbiAgICBjb25zdCBwcm9taXNlczogUHJvbWlzZTxEaWN0cmlvbmFyeVJlc3VsdD5bXSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9hZmZVcmlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhZmZVcmkgPSB0aGlzLl9hZmZVcmlzW2ldO1xuICAgICAgY29uc3QgZGljVXJpID0gdGhpcy5fZGljVXJpc1tpXTtcbiAgICAgIHByb21pc2VzLnB1c2godGhpcy5sb2FkRGljdGlvbmFyeShhZmZVcmksIGRpY1VyaSkpO1xuICAgIH1cbiAgICBjb25zdCBkaWN0aW9uYXJpZXMgPSBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgY29uc3QgbnNwZWxsSW5zdGFuY2UgPSBuc3BlbGwoZGljdGlvbmFyaWVzKTtcbiAgICByZXR1cm4gbmV3IE5TcGVsbENoZWNrZXIobnNwZWxsSW5zdGFuY2UpO1xuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVib3VuY2UoZnVuYzogKGFyZ3M/OiBhbnkpID0+IHZvaWQsIHdhaXQ6IG51bWJlciwgaW1tZWRpYXRlOiBib29sZWFuKSB7XG5cdGxldCB0aW1lb3V0OiBOb2RlSlMuVGltZW91dDtcblxuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXHRcdHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHR9O1xuXHRcdHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG5cdFx0aWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdH07XG59O1xuIiwiaW1wb3J0IHsgRGljdHJpb25hcnlSZXN1bHQgfSBmcm9tIFwic3JjL3R5cGVzL2RpY3Rpb25hcnlcIjtcblxuYXN5bmMgZnVuY3Rpb24gbG9hZEZpbGUodXJpOiBzdHJpbmcpOiBQcm9taXNlPEJ1ZmZlcj4ge1xuICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmkpO1xuICBjb25zdCBhQnVmID0gYXdhaXQgcmVzLmFycmF5QnVmZmVyKCk7XG4gIHJldHVybiBCdWZmZXIuZnJvbShhQnVmKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gbG9hZChhZmZVcmk6IHN0cmluZywgZGljVXJpOiBzdHJpbmcpOiBQcm9taXNlPERpY3RyaW9uYXJ5UmVzdWx0PiB7XG4gIGNvbnN0IFthZmYsIGRpY10gPSBhd2FpdCBQcm9taXNlLmFsbChbbG9hZEZpbGUoYWZmVXJpKSwgbG9hZEZpbGUoZGljVXJpKV0pO1xuXG4gIGNvbnN0IHJlc3VsdDogRGljdHJpb25hcnlSZXN1bHQgPSB7XG4gICAgYWZmLFxuICAgIGRpYyxcbiAgfTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzdE9mcldvcmRzVG9BcnJheSh3b3Jkczogc3RyaW5nKTogc3RyaW5nW10ge1xuICByZXR1cm4gd29yZHNcbiAgICAuc3BsaXQoXCIsXCIpXG4gICAgLm1hcCgodykgPT4gdy50cmltKCkpXG4gICAgLmZpbHRlcigodykgPT4gdyk7XG59XG4iLCJpbXBvcnQgeyBBcHAsIFBsdWdpbiwgUGx1Z2luTWFuaWZlc3QgfSBmcm9tIFwib2JzaWRpYW5cIjtcclxuXHJcbmltcG9ydCBTcGVsbENoZWtlclNldHRpbmdUYWIgZnJvbSBcIi4vY29yZS9zZXR0aW5nVGFiXCI7XHJcbmltcG9ydCBTcGVsbENoZWNrZXIgZnJvbSBcIi4vc3BlbGxDaGVja2VyL2Fic3RyYWN0XCI7XHJcbmltcG9ydCB7XHJcbiAgTlNwZWxsQ2hlY2tlckZhY3RvcnksXHJcbiAgU3BlbGxDaGVja2VyRmFjdG9yeSxcclxufSBmcm9tIFwiLi9zcGVsbENoZWNrZXIvZmFjdG9yeVwiO1xyXG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gXCIuL3V0aWxzL2RlYm91bmNlXCI7XHJcbmltcG9ydCBsb2FkRGljdGlvbmFyeSBmcm9tIFwiLi91dGlscy9kaWN0aW9uYXJpZXNcIjtcclxuaW1wb3J0IHsgc3RPZnJXb3Jkc1RvQXJyYXkgfSBmcm9tIFwiLi91dGlscy93b3Jkc1wiO1xyXG5cclxuaW50ZXJmYWNlIFNwZWxsQ2hla2VyUGx1Z2luU2V0dGluZ3Mge1xyXG4gIGN1c3RvbVdvcmRzOiBzdHJpbmc7XHJcbn1cclxuXHJcbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFNwZWxsQ2hla2VyUGx1Z2luU2V0dGluZ3MgPSB7XHJcbiAgY3VzdG9tV29yZHM6IFwiXCIsXHJcbn07XHJcblxyXG5jb25zdCB0ZXh0UmVnZXhwID0gL15b0JAt0Y8tXSskLztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwZWxsQ2hla2VyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuICBzZXR0aW5nczogU3BlbGxDaGVrZXJQbHVnaW5TZXR0aW5ncztcclxuICBjbTogQ29kZU1pcnJvci5FZGl0b3I7XHJcbiAgbWFya2VyczogYW55W10gPSBbXTtcclxuICBjdXN0b21Xb3Jkczogc3RyaW5nW107XHJcbiAgZGlhbG9nOiBOb2RlIHwgbnVsbDtcclxuXHJcbiAgc3BlbGxDaGVja2VyOiBTcGVsbENoZWNrZXI7XHJcbiAgc3BlbGxDaGVja2VyRmFjdG9yeTogU3BlbGxDaGVja2VyRmFjdG9yeTtcclxuXHJcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIG1hbmlmZXN0OiBQbHVnaW5NYW5pZmVzdCkge1xyXG4gICAgc3VwZXIoYXBwLCBtYW5pZmVzdCk7XHJcbiAgICB0aGlzLnNwZWxsQ2hlY2tlckZhY3RvcnkgPSBuZXcgTlNwZWxsQ2hlY2tlckZhY3RvcnkoXHJcbiAgICAgIFtcclxuICAgICAgICBcImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS93b29vcm0vZGljdGlvbmFyaWVzL21haW4vZGljdGlvbmFyaWVzL3J1L2luZGV4LmFmZlwiLFxyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgXCJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vd29vb3JtL2RpY3Rpb25hcmllcy9tYWluL2RpY3Rpb25hcmllcy9ydS9pbmRleC5kaWNcIixcclxuICAgICAgXSxcclxuICAgICAgbG9hZERpY3Rpb25hcnlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCksXHJcbiAgICAgICh0aGlzLnNwZWxsQ2hlY2tlciA9IGF3YWl0IHRoaXMuc3BlbGxDaGVja2VyRmFjdG9yeS5nZXRTcGVsbENoZWNrZXIoKSksXHJcbiAgICBdKTtcclxuICAgIGNvbnN0IGN1c3RvbVdvcmRzID0gc3RPZnJXb3Jkc1RvQXJyYXkodGhpcy5zZXR0aW5ncy5jdXN0b21Xb3Jkcyk7XHJcbiAgICBhd2FpdCB0aGlzLnNwZWxsQ2hlY2tlci5hZGRXb3JkcyhjdXN0b21Xb3Jkcyk7XHJcblxyXG4gICAgdGhpcy5yZWdpc3RlckNvZGVNaXJyb3IodGhpcy5hdHRhY2hDb2RlTWlycm9yKTtcclxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgU3BlbGxDaGVrZXJTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcbiAgfVxyXG5cclxuICBhdHRhY2hDb2RlTWlycm9yID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvcikgPT4ge1xyXG4gICAgaWYgKHRoaXMuY20gIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmNtLm9mZignY2hhbmdlJywgdGhpcy5jaGVja1NwZWxsaW5nT3ZlckVkaXRvckRlYm91bmNlZCk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICB0aGlzLmNtID0gY207XHJcbiAgICB0aGlzLmNtLm9uKFwiY2hhbmdlXCIsIHRoaXMuY2hlY2tTcGVsbGluZ092ZXJFZGl0b3JEZWJvdW5jZWQpO1xyXG4gICAgdGhpcy5jaGVja1NwZWxsaW5nT3ZlckVkaXRvckRlYm91bmNlZCgpO1xyXG4gIH07XHJcblxyXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xyXG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNoYW5nZUN1c3RvbVdvcmRzID0gYXN5bmMgKHByZXZXb3Jkczogc3RyaW5nLCBuZXdXb3Jkczogc3RyaW5nKSA9PiB7XHJcbiAgICBhd2FpdCB0aGlzLnNwZWxsQ2hlY2tlci5yZW1vdmVXb3JkcyhzdE9mcldvcmRzVG9BcnJheShwcmV2V29yZHMpKTtcclxuICAgIGF3YWl0IHRoaXMuc3BlbGxDaGVja2VyLmFkZFdvcmRzKHN0T2ZyV29yZHNUb0FycmF5KG5ld1dvcmRzKSk7XHJcbiAgfTtcclxuXHJcbiAgY2hlY2tTcGVsbGluZ092ZXJFZGl0b3IgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBpZiAodGhpcy5jbSA9PSBudWxsKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaCgobTogYW55KSA9PiB7XHJcbiAgICAgIG0uY2xlYXIoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMubWFya2VycyA9IFtdO1xyXG5cclxuICAgIGNvbnN0IHRleHQgPSB0aGlzLmNtLmdldFZhbHVlKCk7XHJcbiAgICBsZXQgY3VycmVudFdvcmQgPSBcIlwiO1xyXG5cclxuICAgIGxldCBsaW5lID0gMDtcclxuICAgIGxldCBwb3NDaGFyID0gMDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgY2hhciA9IHRleHRbaV07XHJcblxyXG4gICAgICBpZiAodGV4dFJlZ2V4cC50ZXN0KGNoYXIpKSB7XHJcbiAgICAgICAgY3VycmVudFdvcmQgKz0gY2hhcjtcclxuICAgICAgICBwb3NDaGFyICs9IDE7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjdXJyZW50V29yZC5sZW5ndGggIT09IDAgJiYgIWN1cnJlbnRXb3JkLmluY2x1ZGVzKFwiLVwiKSkge1xyXG4gICAgICAgIGNvbnN0IGlzVmFsaWQgPSBhd2FpdCB0aGlzLnNwZWxsQ2hlY2tlci5jb3JyZWN0KGN1cnJlbnRXb3JkKTtcclxuXHJcbiAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XHJcbiAgICAgICAgICBjb25zdCBzdGFydFBvcyA9IHBvc0NoYXIgLSBjdXJyZW50V29yZC5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgY29uc3QgZW5kUG9zID0gcG9zQ2hhcjtcclxuICAgICAgICAgIGNvbnN0IG0gPSB0aGlzLmNtLm1hcmtUZXh0KFxyXG4gICAgICAgICAgICB7IGNoOiBzdGFydFBvcywgbGluZSB9LFxyXG4gICAgICAgICAgICB7IGNoOiBlbmRQb3MsIGxpbmUgfSxcclxuICAgICAgICAgICAgeyBjbGFzc05hbWU6IFwic3BlbGxpbmctZXJyb3JcIiB9XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgdGhpcy5tYXJrZXJzLnB1c2gobSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBwb3NDaGFyICs9IDE7XHJcblxyXG4gICAgICBpZiAoY2hhciA9PT0gXCJcXG5cIikge1xyXG4gICAgICAgIHBvc0NoYXIgPSAwO1xyXG4gICAgICAgIGxpbmUgKz0gMTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY3VycmVudFdvcmQgPSBcIlwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNoZWNrU3BlbGxpbmdPdmVyRWRpdG9yRGVib3VuY2VkID0gZGVib3VuY2UodGhpcy5jaGVja1NwZWxsaW5nT3ZlckVkaXRvciwgMTAwMCwgZmFsc2UpO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIk5PX0NPREVTIiwicHVzaCIsIndoaXRlU3BhY2VFeHByZXNzaW9uIiwicGFyc2UiLCJleGFjdCIsImZsYWciLCJub3JtYWxpemUiLCJmb3JtIiwiY2FzaW5nIiwiYWRkIiwiYXBwbHkiLCJwYXJzZUNvZGVzIiwicmVxdWlyZSQkMCIsInJlcXVpcmUkJDEiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyIsInJlcXVpcmUkJDQiLCJyZXF1aXJlJCQ1IiwicmVxdWlyZSQkNiIsInJlcXVpcmUkJDciLCJidWZmZXIiLCJhZmZpeCIsIkFzc2VydGlvbkVycm9yIiwibnNwZWxsIiwiUGx1Z2luIiwibG9hZERpY3Rpb25hcnkiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9B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
