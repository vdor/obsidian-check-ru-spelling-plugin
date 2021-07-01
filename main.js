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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9jb3JlL3NldHRpbmdUYWIudHMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9ydWxlLWNvZGVzLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9hZmZpeC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3V0aWwvbm9ybWFsaXplLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9mbGFnLmpzIiwibm9kZV9tb2R1bGVzL25zcGVsbC9saWIvdXRpbC9leGFjdC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3V0aWwvZm9ybS5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL2NvcnJlY3QuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi91dGlsL2Nhc2luZy5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3N1Z2dlc3QuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi9zcGVsbC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3V0aWwvYXBwbHkuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi91dGlsL2FkZC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL2FkZC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3JlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3dvcmQtY2hhcmFjdGVycy5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL3V0aWwvZGljdGlvbmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL2RpY3Rpb25hcnkuanMiLCJub2RlX21vZHVsZXMvbnNwZWxsL2xpYi9wZXJzb25hbC5qcyIsIm5vZGVfbW9kdWxlcy9uc3BlbGwvbGliL2luZGV4LmpzIiwic3JjL3NwZWxsQ2hlY2tlci9hYnN0cmFjdC50cyIsInNyYy9zcGVsbENoZWNrZXIvblNwZWxsQ2hlY2tlci50cyIsInNyYy9zcGVsbENoZWNrZXIvZmFjdG9yeS50cyIsInNyYy91dGlscy9kZWJvdW5jZS50cyIsInNyYy91dGlscy9kaWN0aW9uYXJpZXMudHMiLCJzcmMvdXRpbHMvd29yZHMudHMiLCJzcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IGZyb20pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHtcbiAgQXBwLFxuICBQbHVnaW5TZXR0aW5nVGFiLFxuICBTZXR0aW5nLFxuICBQbHVnaW5cbn0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBTcGVsbENoZWtlclBsdWdpblNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncyc7XG5cbmludGVyZmFjZSBDdXN0b21QbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5nczogU3BlbGxDaGVrZXJQbHVnaW5TZXR0aW5ncztcbiAgaGFuZGxlQ2hhbmdlQ3VzdG9tV29yZHM6IChwcmV2V29yZHM6IHN0cmluZywgbmV3V29yZHM6IHN0cmluZykgPT4gdm9pZDtcbiAgc2F2ZVNldHRpbmdzOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGVsbENoZWtlclNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgcGx1Z2luOiBDdXN0b21QbHVnaW47XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogQ3VzdG9tUGx1Z2luKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcblxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJTZXR0aW5ncyBmb3IgY2hlY2tlciBvZiBzcGVsbGluZ1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkN1c3RvbSB3b3Jkc1wiKVxuICAgICAgLnNldERlc2MoXCJDdXN0b20gc3BlbGxpbmcgd29yZHNcIilcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiRW50ZXIgd29yZHMgc2VwYXJhdGVkIGJ5IGNvbW1hXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmN1c3RvbVdvcmRzKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXN0b21Xb3JkcztcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmN1c3RvbVdvcmRzID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5oYW5kbGVDaGFuZ2VDdXN0b21Xb3JkcyhwcmV2LCB2YWx1ZSk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxufVxuIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3RvciAhPSBudWxsICYmXG4gICAgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gcnVsZUNvZGVzXG5cbnZhciBOT19DT0RFUyA9IFtdXG5cbi8vIFBhcnNlIHJ1bGUgY29kZXMuXG5mdW5jdGlvbiBydWxlQ29kZXMoZmxhZ3MsIHZhbHVlKSB7XG4gIHZhciBpbmRleCA9IDBcbiAgdmFyIHJlc3VsdFxuXG4gIGlmICghdmFsdWUpIHJldHVybiBOT19DT0RFU1xuXG4gIGlmIChmbGFncy5GTEFHID09PSAnbG9uZycpIHtcbiAgICAvLyBDcmVhdGluZyBhbiBhcnJheSBvZiB0aGUgcmlnaHQgbGVuZ3RoIGltbWVkaWF0ZWx5XG4gICAgLy8gYXZvaWRpbmcgcmVzaXplcyBhbmQgdXNpbmcgbWVtb3J5IG1vcmUgZWZmaWNpZW50bHlcbiAgICByZXN1bHQgPSBuZXcgQXJyYXkoTWF0aC5jZWlsKHZhbHVlLmxlbmd0aCAvIDIpKVxuXG4gICAgd2hpbGUgKGluZGV4IDwgdmFsdWUubGVuZ3RoKSB7XG4gICAgICByZXN1bHRbaW5kZXggLyAyXSA9IHZhbHVlLnNsaWNlKGluZGV4LCBpbmRleCArIDIpXG4gICAgICBpbmRleCArPSAyXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgcmV0dXJuIHZhbHVlLnNwbGl0KGZsYWdzLkZMQUcgPT09ICdudW0nID8gJywnIDogJycpXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIHBhcnNlID0gcmVxdWlyZSgnLi9ydWxlLWNvZGVzLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSBhZmZpeFxuXG52YXIgcHVzaCA9IFtdLnB1c2hcblxuLy8gUmVsYXRpdmUgZnJlcXVlbmNpZXMgb2YgbGV0dGVycyBpbiB0aGUgRW5nbGlzaCBsYW5ndWFnZS5cbnZhciBhbHBoYWJldCA9ICdldGFvaW5zaHJkbGN1bXdmZ3lwYnZranhxeicuc3BsaXQoJycpXG5cbi8vIEV4cHJlc3Npb25zLlxudmFyIHdoaXRlU3BhY2VFeHByZXNzaW9uID0gL1xccysvXG5cbi8vIERlZmF1bHRzLlxudmFyIGRlZmF1bHRLZXlib2FyZExheW91dCA9IFtcbiAgJ3F3ZXJ0enVvcCcsXG4gICd5eGN2Ym5tJyxcbiAgJ3FhdycsXG4gICdzYXknLFxuICAnd3NlJyxcbiAgJ2RzeCcsXG4gICdzeScsXG4gICdlZHInLFxuICAnZmRjJyxcbiAgJ2R4JyxcbiAgJ3JmdCcsXG4gICdnZnYnLFxuICAnZmMnLFxuICAndGd6JyxcbiAgJ2hnYicsXG4gICdndicsXG4gICd6aHUnLFxuICAnamhuJyxcbiAgJ2hiJyxcbiAgJ3VqaScsXG4gICdram0nLFxuICAnam4nLFxuICAnaWtvJyxcbiAgJ2xrbSdcbl1cblxuLy8gUGFyc2UgYW4gYWZmaXggZmlsZS5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21wbGV4aXR5XG5mdW5jdGlvbiBhZmZpeChkb2MpIHtcbiAgdmFyIHJ1bGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICB2YXIgY29tcG91bmRSdWxlQ29kZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIHZhciBmbGFncyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgdmFyIHJlcGxhY2VtZW50VGFibGUgPSBbXVxuICB2YXIgY29udmVyc2lvbiA9IHtpbjogW10sIG91dDogW119XG4gIHZhciBjb21wb3VuZFJ1bGVzID0gW11cbiAgdmFyIGFmZiA9IGRvYy50b1N0cmluZygndXRmOCcpXG4gIHZhciBsaW5lcyA9IFtdXG4gIHZhciBsYXN0ID0gMFxuICB2YXIgaW5kZXggPSBhZmYuaW5kZXhPZignXFxuJylcbiAgdmFyIHBhcnRzXG4gIHZhciBsaW5lXG4gIHZhciBydWxlVHlwZVxuICB2YXIgY291bnRcbiAgdmFyIHJlbW92ZVxuICB2YXIgYWRkXG4gIHZhciBzb3VyY2VcbiAgdmFyIGVudHJ5XG4gIHZhciBwb3NpdGlvblxuICB2YXIgcnVsZVxuICB2YXIgdmFsdWVcbiAgdmFyIG9mZnNldFxuICB2YXIgY2hhcmFjdGVyXG5cbiAgZmxhZ3MuS0VZID0gW11cblxuICAvLyBQcm9jZXNzIHRoZSBhZmZpeCBidWZmZXIgaW50byBhIGxpc3Qgb2YgYXBwbGljYWJsZSBsaW5lcy5cbiAgd2hpbGUgKGluZGV4ID4gLTEpIHtcbiAgICBwdXNoTGluZShhZmYuc2xpY2UobGFzdCwgaW5kZXgpKVxuICAgIGxhc3QgPSBpbmRleCArIDFcbiAgICBpbmRleCA9IGFmZi5pbmRleE9mKCdcXG4nLCBsYXN0KVxuICB9XG5cbiAgcHVzaExpbmUoYWZmLnNsaWNlKGxhc3QpKVxuXG4gIC8vIFByb2Nlc3MgZWFjaCBsaW5lLlxuICBpbmRleCA9IC0xXG5cbiAgd2hpbGUgKCsraW5kZXggPCBsaW5lcy5sZW5ndGgpIHtcbiAgICBsaW5lID0gbGluZXNbaW5kZXhdXG4gICAgcGFydHMgPSBsaW5lLnNwbGl0KHdoaXRlU3BhY2VFeHByZXNzaW9uKVxuICAgIHJ1bGVUeXBlID0gcGFydHNbMF1cblxuICAgIGlmIChydWxlVHlwZSA9PT0gJ1JFUCcpIHtcbiAgICAgIGNvdW50ID0gaW5kZXggKyBwYXJzZUludChwYXJ0c1sxXSwgMTApXG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDw9IGNvdW50KSB7XG4gICAgICAgIHBhcnRzID0gbGluZXNbaW5kZXhdLnNwbGl0KHdoaXRlU3BhY2VFeHByZXNzaW9uKVxuICAgICAgICByZXBsYWNlbWVudFRhYmxlLnB1c2goW3BhcnRzWzFdLCBwYXJ0c1syXV0pXG4gICAgICB9XG5cbiAgICAgIGluZGV4LS1cbiAgICB9IGVsc2UgaWYgKHJ1bGVUeXBlID09PSAnSUNPTlYnIHx8IHJ1bGVUeXBlID09PSAnT0NPTlYnKSB7XG4gICAgICBjb3VudCA9IGluZGV4ICsgcGFyc2VJbnQocGFydHNbMV0sIDEwKVxuICAgICAgZW50cnkgPSBjb252ZXJzaW9uW3J1bGVUeXBlID09PSAnSUNPTlYnID8gJ2luJyA6ICdvdXQnXVxuXG4gICAgICB3aGlsZSAoKytpbmRleCA8PSBjb3VudCkge1xuICAgICAgICBwYXJ0cyA9IGxpbmVzW2luZGV4XS5zcGxpdCh3aGl0ZVNwYWNlRXhwcmVzc2lvbilcbiAgICAgICAgZW50cnkucHVzaChbbmV3IFJlZ0V4cChwYXJ0c1sxXSwgJ2cnKSwgcGFydHNbMl1dKVxuICAgICAgfVxuXG4gICAgICBpbmRleC0tXG4gICAgfSBlbHNlIGlmIChydWxlVHlwZSA9PT0gJ0NPTVBPVU5EUlVMRScpIHtcbiAgICAgIGNvdW50ID0gaW5kZXggKyBwYXJzZUludChwYXJ0c1sxXSwgMTApXG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDw9IGNvdW50KSB7XG4gICAgICAgIHJ1bGUgPSBsaW5lc1tpbmRleF0uc3BsaXQod2hpdGVTcGFjZUV4cHJlc3Npb24pWzFdXG4gICAgICAgIHBvc2l0aW9uID0gLTFcblxuICAgICAgICBjb21wb3VuZFJ1bGVzLnB1c2gocnVsZSlcblxuICAgICAgICB3aGlsZSAoKytwb3NpdGlvbiA8IHJ1bGUubGVuZ3RoKSB7XG4gICAgICAgICAgY29tcG91bmRSdWxlQ29kZXNbcnVsZS5jaGFyQXQocG9zaXRpb24pXSA9IFtdXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW5kZXgtLVxuICAgIH0gZWxzZSBpZiAocnVsZVR5cGUgPT09ICdQRlgnIHx8IHJ1bGVUeXBlID09PSAnU0ZYJykge1xuICAgICAgY291bnQgPSBpbmRleCArIHBhcnNlSW50KHBhcnRzWzNdLCAxMClcblxuICAgICAgcnVsZSA9IHtcbiAgICAgICAgdHlwZTogcnVsZVR5cGUsXG4gICAgICAgIGNvbWJpbmVhYmxlOiBwYXJ0c1syXSA9PT0gJ1knLFxuICAgICAgICBlbnRyaWVzOiBbXVxuICAgICAgfVxuXG4gICAgICBydWxlc1twYXJ0c1sxXV0gPSBydWxlXG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDw9IGNvdW50KSB7XG4gICAgICAgIHBhcnRzID0gbGluZXNbaW5kZXhdLnNwbGl0KHdoaXRlU3BhY2VFeHByZXNzaW9uKVxuICAgICAgICByZW1vdmUgPSBwYXJ0c1syXVxuICAgICAgICBhZGQgPSBwYXJ0c1szXS5zcGxpdCgnLycpXG4gICAgICAgIHNvdXJjZSA9IHBhcnRzWzRdXG5cbiAgICAgICAgZW50cnkgPSB7XG4gICAgICAgICAgYWRkOiAnJyxcbiAgICAgICAgICByZW1vdmU6ICcnLFxuICAgICAgICAgIG1hdGNoOiAnJyxcbiAgICAgICAgICBjb250aW51YXRpb246IHBhcnNlKGZsYWdzLCBhZGRbMV0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWRkICYmIGFkZFswXSAhPT0gJzAnKSB7XG4gICAgICAgICAgZW50cnkuYWRkID0gYWRkWzBdXG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChyZW1vdmUgIT09ICcwJykge1xuICAgICAgICAgICAgZW50cnkucmVtb3ZlID0gcnVsZVR5cGUgPT09ICdTRlgnID8gZW5kKHJlbW92ZSkgOiByZW1vdmVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc291cmNlICYmIHNvdXJjZSAhPT0gJy4nKSB7XG4gICAgICAgICAgICBlbnRyeS5tYXRjaCA9IHJ1bGVUeXBlID09PSAnU0ZYJyA/IGVuZChzb3VyY2UpIDogc3RhcnQoc291cmNlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIC8vIElnbm9yZSBpbnZhbGlkIHJlZ2V4IHBhdHRlcm5zLlxuICAgICAgICAgIGVudHJ5ID0gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgcnVsZS5lbnRyaWVzLnB1c2goZW50cnkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW5kZXgtLVxuICAgIH0gZWxzZSBpZiAocnVsZVR5cGUgPT09ICdUUlknKSB7XG4gICAgICBzb3VyY2UgPSBwYXJ0c1sxXVxuICAgICAgb2Zmc2V0ID0gLTFcbiAgICAgIHZhbHVlID0gW11cblxuICAgICAgd2hpbGUgKCsrb2Zmc2V0IDwgc291cmNlLmxlbmd0aCkge1xuICAgICAgICBjaGFyYWN0ZXIgPSBzb3VyY2UuY2hhckF0KG9mZnNldClcblxuICAgICAgICBpZiAoY2hhcmFjdGVyLnRvTG93ZXJDYXNlKCkgPT09IGNoYXJhY3Rlcikge1xuICAgICAgICAgIHZhbHVlLnB1c2goY2hhcmFjdGVyKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFNvbWUgZGljdGlvbmFyaWVzIG1heSBmb3JnZXQgYSBjaGFyYWN0ZXIuXG4gICAgICAvLyBOb3RhYmx5IGBlbmAgZm9yZ2V0cyBgamAsIGB4YCwgYW5kIGB5YC5cbiAgICAgIG9mZnNldCA9IC0xXG5cbiAgICAgIHdoaWxlICgrK29mZnNldCA8IGFscGhhYmV0Lmxlbmd0aCkge1xuICAgICAgICBpZiAoc291cmNlLmluZGV4T2YoYWxwaGFiZXRbb2Zmc2V0XSkgPCAwKSB7XG4gICAgICAgICAgdmFsdWUucHVzaChhbHBoYWJldFtvZmZzZXRdKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZsYWdzW3J1bGVUeXBlXSA9IHZhbHVlXG4gICAgfSBlbHNlIGlmIChydWxlVHlwZSA9PT0gJ0tFWScpIHtcbiAgICAgIHB1c2guYXBwbHkoZmxhZ3NbcnVsZVR5cGVdLCBwYXJ0c1sxXS5zcGxpdCgnfCcpKVxuICAgIH0gZWxzZSBpZiAocnVsZVR5cGUgPT09ICdDT01QT1VORE1JTicpIHtcbiAgICAgIGZsYWdzW3J1bGVUeXBlXSA9IE51bWJlcihwYXJ0c1sxXSlcbiAgICB9IGVsc2UgaWYgKHJ1bGVUeXBlID09PSAnT05MWUlOQ09NUE9VTkQnKSB7XG4gICAgICAvLyBJZiB3ZSBhZGQgdGhpcyBPTkxZSU5DT01QT1VORCBmbGFnIHRvIGBjb21wb3VuZFJ1bGVDb2Rlc2AsIHRoZW5cbiAgICAgIC8vIGBwYXJzZURpY2Agd2lsbCBkbyB0aGUgd29yayBvZiBzYXZpbmcgdGhlIGxpc3Qgb2Ygd29yZHMgdGhhdCBhcmVcbiAgICAgIC8vIGNvbXBvdW5kLW9ubHkuXG4gICAgICBmbGFnc1tydWxlVHlwZV0gPSBwYXJ0c1sxXVxuICAgICAgY29tcG91bmRSdWxlQ29kZXNbcGFydHNbMV1dID0gW11cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcnVsZVR5cGUgPT09ICdGTEFHJyB8fFxuICAgICAgcnVsZVR5cGUgPT09ICdLRUVQQ0FTRScgfHxcbiAgICAgIHJ1bGVUeXBlID09PSAnTk9TVUdHRVNUJyB8fFxuICAgICAgcnVsZVR5cGUgPT09ICdXT1JEQ0hBUlMnXG4gICAgKSB7XG4gICAgICBmbGFnc1tydWxlVHlwZV0gPSBwYXJ0c1sxXVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWZhdWx0IGhhbmRsaW5nOiBzZXQgdGhlbSBmb3Igbm93LlxuICAgICAgZmxhZ3NbcnVsZVR5cGVdID0gcGFydHNbMV1cbiAgICB9XG4gIH1cblxuICAvLyBEZWZhdWx0IGZvciBgQ09NUE9VTkRNSU5gIGlzIGAzYC5cbiAgLy8gU2VlIGBtYW4gNCBodW5zcGVsbGAuXG4gIGlmIChpc05hTihmbGFncy5DT01QT1VORE1JTikpIHtcbiAgICBmbGFncy5DT01QT1VORE1JTiA9IDNcbiAgfVxuXG4gIGlmICghZmxhZ3MuS0VZLmxlbmd0aCkge1xuICAgIGZsYWdzLktFWSA9IGRlZmF1bHRLZXlib2FyZExheW91dFxuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmIC0gRGljdGlvbmFyaWVzIHNlZW0gdG8gYWx3YXlzIGhhdmUgdGhpcy4gKi9cbiAgaWYgKCFmbGFncy5UUlkpIHtcbiAgICBmbGFncy5UUlkgPSBhbHBoYWJldC5jb25jYXQoKVxuICB9XG5cbiAgaWYgKCFmbGFncy5LRUVQQ0FTRSkge1xuICAgIGZsYWdzLktFRVBDQVNFID0gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY29tcG91bmRSdWxlQ29kZXM6IGNvbXBvdW5kUnVsZUNvZGVzLFxuICAgIHJlcGxhY2VtZW50VGFibGU6IHJlcGxhY2VtZW50VGFibGUsXG4gICAgY29udmVyc2lvbjogY29udmVyc2lvbixcbiAgICBjb21wb3VuZFJ1bGVzOiBjb21wb3VuZFJ1bGVzLFxuICAgIHJ1bGVzOiBydWxlcyxcbiAgICBmbGFnczogZmxhZ3NcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2hMaW5lKGxpbmUpIHtcbiAgICBsaW5lID0gbGluZS50cmltKClcblxuICAgIC8vIEhhc2ggY2FuIGJlIGEgdmFsaWQgZmxhZywgc28gd2Ugb25seSBkaXNjYXJkIGxpbmUgdGhhdCBzdGFydHMgd2l0aCBpdC5cbiAgICBpZiAobGluZSAmJiBsaW5lLmNoYXJDb2RlQXQoMCkgIT09IDM1IC8qIGAjYCAqLykge1xuICAgICAgbGluZXMucHVzaChsaW5lKVxuICAgIH1cbiAgfVxufVxuXG4vLyBXcmFwIHRoZSBgc291cmNlYCBvZiBhbiBleHByZXNzaW9uLWxpa2Ugc3RyaW5nIHNvIHRoYXQgaXQgbWF0Y2hlcyBvbmx5IGF0XG4vLyB0aGUgZW5kIG9mIGEgdmFsdWUuXG5mdW5jdGlvbiBlbmQoc291cmNlKSB7XG4gIHJldHVybiBuZXcgUmVnRXhwKHNvdXJjZSArICckJylcbn1cblxuLy8gV3JhcCB0aGUgYHNvdXJjZWAgb2YgYW4gZXhwcmVzc2lvbi1saWtlIHN0cmluZyBzbyB0aGF0IGl0IG1hdGNoZXMgb25seSBhdFxuLy8gdGhlIHN0YXJ0IG9mIGEgdmFsdWUuXG5mdW5jdGlvbiBzdGFydChzb3VyY2UpIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoJ14nICsgc291cmNlKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gbm9ybWFsaXplXG5cbi8vIE5vcm1hbGl6ZSBgdmFsdWVgIHdpdGggcGF0dGVybnMuXG5mdW5jdGlvbiBub3JtYWxpemUodmFsdWUsIHBhdHRlcm5zKSB7XG4gIHZhciBpbmRleCA9IC0xXG5cbiAgd2hpbGUgKCsraW5kZXggPCBwYXR0ZXJucy5sZW5ndGgpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocGF0dGVybnNbaW5kZXhdWzBdLCBwYXR0ZXJuc1tpbmRleF1bMV0pXG4gIH1cblxuICByZXR1cm4gdmFsdWVcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYWdcblxuLy8gQ2hlY2sgd2hldGhlciBhIHdvcmQgaGFzIGEgZmxhZy5cbmZ1bmN0aW9uIGZsYWcodmFsdWVzLCB2YWx1ZSwgZmxhZ3MpIHtcbiAgcmV0dXJuIGZsYWdzICYmIHZhbHVlIGluIHZhbHVlcyAmJiBmbGFncy5pbmRleE9mKHZhbHVlc1t2YWx1ZV0pID4gLTFcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgZmxhZyA9IHJlcXVpcmUoJy4vZmxhZy5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gZXhhY3RcblxuLy8gQ2hlY2sgc3BlbGxpbmcgb2YgYHZhbHVlYCwgZXhhY3RseS5cbmZ1bmN0aW9uIGV4YWN0KGNvbnRleHQsIHZhbHVlKSB7XG4gIHZhciBpbmRleCA9IC0xXG5cbiAgaWYgKGNvbnRleHQuZGF0YVt2YWx1ZV0pIHtcbiAgICByZXR1cm4gIWZsYWcoY29udGV4dC5mbGFncywgJ09OTFlJTkNPTVBPVU5EJywgY29udGV4dC5kYXRhW3ZhbHVlXSlcbiAgfVxuXG4gIC8vIENoZWNrIGlmIHRoaXMgbWlnaHQgYmUgYSBjb21wb3VuZCB3b3JkLlxuICBpZiAodmFsdWUubGVuZ3RoID49IGNvbnRleHQuZmxhZ3MuQ09NUE9VTkRNSU4pIHtcbiAgICB3aGlsZSAoKytpbmRleCA8IGNvbnRleHQuY29tcG91bmRSdWxlcy5sZW5ndGgpIHtcbiAgICAgIGlmIChjb250ZXh0LmNvbXBvdW5kUnVsZXNbaW5kZXhdLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIG5vcm1hbGl6ZSA9IHJlcXVpcmUoJy4vbm9ybWFsaXplLmpzJylcbnZhciBleGFjdCA9IHJlcXVpcmUoJy4vZXhhY3QuanMnKVxudmFyIGZsYWcgPSByZXF1aXJlKCcuL2ZsYWcuanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvcm1cblxuLy8gRmluZCBhIGtub3duIGZvcm0gb2YgYHZhbHVlYC5cbmZ1bmN0aW9uIGZvcm0oY29udGV4dCwgdmFsdWUsIGFsbCkge1xuICB2YXIgbm9ybWFsID0gdmFsdWUudHJpbSgpXG4gIHZhciBhbHRlcm5hdGl2ZVxuXG4gIGlmICghbm9ybWFsKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIG5vcm1hbCA9IG5vcm1hbGl6ZShub3JtYWwsIGNvbnRleHQuY29udmVyc2lvbi5pbilcblxuICBpZiAoZXhhY3QoY29udGV4dCwgbm9ybWFsKSkge1xuICAgIGlmICghYWxsICYmIGZsYWcoY29udGV4dC5mbGFncywgJ0ZPUkJJRERFTldPUkQnLCBjb250ZXh0LmRhdGFbbm9ybWFsXSkpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgcmV0dXJuIG5vcm1hbFxuICB9XG5cbiAgLy8gVHJ5IHNlbnRlbmNlIGNhc2UgaWYgdGhlIHZhbHVlIGlzIHVwcGVyY2FzZS5cbiAgaWYgKG5vcm1hbC50b1VwcGVyQ2FzZSgpID09PSBub3JtYWwpIHtcbiAgICBhbHRlcm5hdGl2ZSA9IG5vcm1hbC5jaGFyQXQoMCkgKyBub3JtYWwuc2xpY2UoMSkudG9Mb3dlckNhc2UoKVxuXG4gICAgaWYgKGlnbm9yZShjb250ZXh0LmZsYWdzLCBjb250ZXh0LmRhdGFbYWx0ZXJuYXRpdmVdLCBhbGwpKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGlmIChleGFjdChjb250ZXh0LCBhbHRlcm5hdGl2ZSkpIHtcbiAgICAgIHJldHVybiBhbHRlcm5hdGl2ZVxuICAgIH1cbiAgfVxuXG4gIC8vIFRyeSBsb3dlcmNhc2UuXG4gIGFsdGVybmF0aXZlID0gbm9ybWFsLnRvTG93ZXJDYXNlKClcblxuICBpZiAoYWx0ZXJuYXRpdmUgIT09IG5vcm1hbCkge1xuICAgIGlmIChpZ25vcmUoY29udGV4dC5mbGFncywgY29udGV4dC5kYXRhW2FsdGVybmF0aXZlXSwgYWxsKSkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBpZiAoZXhhY3QoY29udGV4dCwgYWx0ZXJuYXRpdmUpKSB7XG4gICAgICByZXR1cm4gYWx0ZXJuYXRpdmVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5mdW5jdGlvbiBpZ25vcmUoZmxhZ3MsIGRpY3QsIGFsbCkge1xuICByZXR1cm4gKFxuICAgIGZsYWcoZmxhZ3MsICdLRUVQQ0FTRScsIGRpY3QpIHx8IGFsbCB8fCBmbGFnKGZsYWdzLCAnRk9SQklEREVOV09SRCcsIGRpY3QpXG4gIClcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgZm9ybSA9IHJlcXVpcmUoJy4vdXRpbC9mb3JtLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSBjb3JyZWN0XG5cbi8vIENoZWNrIHNwZWxsaW5nIG9mIGB2YWx1ZWAuXG5mdW5jdGlvbiBjb3JyZWN0KHZhbHVlKSB7XG4gIHJldHVybiBCb29sZWFuKGZvcm0odGhpcywgdmFsdWUpKVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gY2FzaW5nXG5cbi8vIEdldCB0aGUgY2FzaW5nIG9mIGB2YWx1ZWAuXG5mdW5jdGlvbiBjYXNpbmcodmFsdWUpIHtcbiAgdmFyIGhlYWQgPSBleGFjdCh2YWx1ZS5jaGFyQXQoMCkpXG4gIHZhciByZXN0ID0gdmFsdWUuc2xpY2UoMSlcblxuICBpZiAoIXJlc3QpIHtcbiAgICByZXR1cm4gaGVhZFxuICB9XG5cbiAgcmVzdCA9IGV4YWN0KHJlc3QpXG5cbiAgaWYgKGhlYWQgPT09IHJlc3QpIHtcbiAgICByZXR1cm4gaGVhZFxuICB9XG5cbiAgaWYgKGhlYWQgPT09ICd1JyAmJiByZXN0ID09PSAnbCcpIHtcbiAgICByZXR1cm4gJ3MnXG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5mdW5jdGlvbiBleGFjdCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICA/ICdsJ1xuICAgIDogdmFsdWUgPT09IHZhbHVlLnRvVXBwZXJDYXNlKClcbiAgICA/ICd1J1xuICAgIDogbnVsbFxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjYXNpbmcgPSByZXF1aXJlKCcuL3V0aWwvY2FzaW5nLmpzJylcbnZhciBub3JtYWxpemUgPSByZXF1aXJlKCcuL3V0aWwvbm9ybWFsaXplLmpzJylcbnZhciBmbGFnID0gcmVxdWlyZSgnLi91dGlsL2ZsYWcuanMnKVxudmFyIGZvcm0gPSByZXF1aXJlKCcuL3V0aWwvZm9ybS5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gc3VnZ2VzdFxuXG52YXIgcHVzaCA9IFtdLnB1c2hcblxuLy8gU3VnZ2VzdCBzcGVsbGluZyBmb3IgYHZhbHVlYC5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21wbGV4aXR5XG5mdW5jdGlvbiBzdWdnZXN0KHZhbHVlKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgY2hhckFkZGVkID0ge31cbiAgdmFyIHN1Z2dlc3Rpb25zID0gW11cbiAgdmFyIHdlaWdodGVkID0ge31cbiAgdmFyIG1lbW9yeVxuICB2YXIgcmVwbGFjZW1lbnRcbiAgdmFyIGVkaXRzID0gW11cbiAgdmFyIHZhbHVlc1xuICB2YXIgaW5kZXhcbiAgdmFyIG9mZnNldFxuICB2YXIgcG9zaXRpb25cbiAgdmFyIGNvdW50XG4gIHZhciBvdGhlck9mZnNldFxuICB2YXIgb3RoZXJDaGFyYWN0ZXJcbiAgdmFyIGNoYXJhY3RlclxuICB2YXIgZ3JvdXBcbiAgdmFyIGJlZm9yZVxuICB2YXIgYWZ0ZXJcbiAgdmFyIHVwcGVyXG4gIHZhciBpbnNlbnNpdGl2ZVxuICB2YXIgZmlyc3RMZXZlbFxuICB2YXIgcHJldmlvdXNcbiAgdmFyIG5leHRcbiAgdmFyIG5leHRDaGFyYWN0ZXJcbiAgdmFyIG1heFxuICB2YXIgZGlzdGFuY2VcbiAgdmFyIHNpemVcbiAgdmFyIG5vcm1hbGl6ZWRcbiAgdmFyIHN1Z2dlc3Rpb25cbiAgdmFyIGN1cnJlbnRDYXNlXG5cbiAgdmFsdWUgPSBub3JtYWxpemUodmFsdWUudHJpbSgpLCBzZWxmLmNvbnZlcnNpb24uaW4pXG5cbiAgaWYgKCF2YWx1ZSB8fCBzZWxmLmNvcnJlY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIFtdXG4gIH1cblxuICBjdXJyZW50Q2FzZSA9IGNhc2luZyh2YWx1ZSlcblxuICAvLyBDaGVjayB0aGUgcmVwbGFjZW1lbnQgdGFibGUuXG4gIGluZGV4ID0gLTFcblxuICB3aGlsZSAoKytpbmRleCA8IHNlbGYucmVwbGFjZW1lbnRUYWJsZS5sZW5ndGgpIHtcbiAgICByZXBsYWNlbWVudCA9IHNlbGYucmVwbGFjZW1lbnRUYWJsZVtpbmRleF1cbiAgICBvZmZzZXQgPSB2YWx1ZS5pbmRleE9mKHJlcGxhY2VtZW50WzBdKVxuXG4gICAgd2hpbGUgKG9mZnNldCA+IC0xKSB7XG4gICAgICBlZGl0cy5wdXNoKHZhbHVlLnJlcGxhY2UocmVwbGFjZW1lbnRbMF0sIHJlcGxhY2VtZW50WzFdKSlcbiAgICAgIG9mZnNldCA9IHZhbHVlLmluZGV4T2YocmVwbGFjZW1lbnRbMF0sIG9mZnNldCArIDEpXG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2sgdGhlIGtleWJvYXJkLlxuICBpbmRleCA9IC0xXG5cbiAgd2hpbGUgKCsraW5kZXggPCB2YWx1ZS5sZW5ndGgpIHtcbiAgICBjaGFyYWN0ZXIgPSB2YWx1ZS5jaGFyQXQoaW5kZXgpXG4gICAgYmVmb3JlID0gdmFsdWUuc2xpY2UoMCwgaW5kZXgpXG4gICAgYWZ0ZXIgPSB2YWx1ZS5zbGljZShpbmRleCArIDEpXG4gICAgaW5zZW5zaXRpdmUgPSBjaGFyYWN0ZXIudG9Mb3dlckNhc2UoKVxuICAgIHVwcGVyID0gaW5zZW5zaXRpdmUgIT09IGNoYXJhY3RlclxuICAgIGNoYXJBZGRlZCA9IHt9XG5cbiAgICBvZmZzZXQgPSAtMVxuXG4gICAgd2hpbGUgKCsrb2Zmc2V0IDwgc2VsZi5mbGFncy5LRVkubGVuZ3RoKSB7XG4gICAgICBncm91cCA9IHNlbGYuZmxhZ3MuS0VZW29mZnNldF1cbiAgICAgIHBvc2l0aW9uID0gZ3JvdXAuaW5kZXhPZihpbnNlbnNpdGl2ZSlcblxuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBvdGhlck9mZnNldCA9IC0xXG5cbiAgICAgIHdoaWxlICgrK290aGVyT2Zmc2V0IDwgZ3JvdXAubGVuZ3RoKSB7XG4gICAgICAgIGlmIChvdGhlck9mZnNldCAhPT0gcG9zaXRpb24pIHtcbiAgICAgICAgICBvdGhlckNoYXJhY3RlciA9IGdyb3VwLmNoYXJBdChvdGhlck9mZnNldClcblxuICAgICAgICAgIGlmIChjaGFyQWRkZWRbb3RoZXJDaGFyYWN0ZXJdKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNoYXJBZGRlZFtvdGhlckNoYXJhY3Rlcl0gPSB0cnVlXG5cbiAgICAgICAgICBpZiAodXBwZXIpIHtcbiAgICAgICAgICAgIG90aGVyQ2hhcmFjdGVyID0gb3RoZXJDaGFyYWN0ZXIudG9VcHBlckNhc2UoKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGVkaXRzLnB1c2goYmVmb3JlICsgb3RoZXJDaGFyYWN0ZXIgKyBhZnRlcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENoZWNrIGNhc2VzIHdoZXJlIG9uZSBvZiBhIGRvdWJsZSBjaGFyYWN0ZXIgd2FzIGZvcmdvdHRlbiwgb3Igb25lIHRvbyBtYW55XG4gIC8vIHdlcmUgYWRkZWQsIHVwIHRvIHRocmVlIOKAnGRpc3RhbmNlc+KAnS4gIFRoaXMgaW5jcmVhc2VzIHRoZSBzdWNjZXNzLXJhdGUgYnkgMiVcbiAgLy8gYW5kIHNwZWVkcyB0aGUgcHJvY2VzcyB1cCBieSAxMyUuXG4gIGluZGV4ID0gLTFcbiAgbmV4dENoYXJhY3RlciA9IHZhbHVlLmNoYXJBdCgwKVxuICB2YWx1ZXMgPSBbJyddXG4gIG1heCA9IDFcbiAgZGlzdGFuY2UgPSAwXG5cbiAgd2hpbGUgKCsraW5kZXggPCB2YWx1ZS5sZW5ndGgpIHtcbiAgICBjaGFyYWN0ZXIgPSBuZXh0Q2hhcmFjdGVyXG4gICAgbmV4dENoYXJhY3RlciA9IHZhbHVlLmNoYXJBdChpbmRleCArIDEpXG4gICAgYmVmb3JlID0gdmFsdWUuc2xpY2UoMCwgaW5kZXgpXG5cbiAgICByZXBsYWNlbWVudCA9IGNoYXJhY3RlciA9PT0gbmV4dENoYXJhY3RlciA/ICcnIDogY2hhcmFjdGVyICsgY2hhcmFjdGVyXG4gICAgb2Zmc2V0ID0gLTFcbiAgICBjb3VudCA9IHZhbHVlcy5sZW5ndGhcblxuICAgIHdoaWxlICgrK29mZnNldCA8IGNvdW50KSB7XG4gICAgICBpZiAob2Zmc2V0IDw9IG1heCkge1xuICAgICAgICB2YWx1ZXMucHVzaCh2YWx1ZXNbb2Zmc2V0XSArIHJlcGxhY2VtZW50KVxuICAgICAgfVxuXG4gICAgICB2YWx1ZXNbb2Zmc2V0XSArPSBjaGFyYWN0ZXJcbiAgICB9XG5cbiAgICBpZiAoKytkaXN0YW5jZSA8IDMpIHtcbiAgICAgIG1heCA9IHZhbHVlcy5sZW5ndGhcbiAgICB9XG4gIH1cblxuICBwdXNoLmFwcGx5KGVkaXRzLCB2YWx1ZXMpXG5cbiAgLy8gRW5zdXJlIHRoZSBjYXBpdGFsaXNlZCBhbmQgdXBwZXJjYXNlIHZhbHVlcyBhcmUgaW5jbHVkZWQuXG4gIHZhbHVlcyA9IFt2YWx1ZV1cbiAgcmVwbGFjZW1lbnQgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpXG5cbiAgaWYgKHZhbHVlID09PSByZXBsYWNlbWVudCB8fCBjdXJyZW50Q2FzZSA9PT0gbnVsbCkge1xuICAgIHZhbHVlcy5wdXNoKHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcmVwbGFjZW1lbnQuc2xpY2UoMSkpXG4gIH1cblxuICByZXBsYWNlbWVudCA9IHZhbHVlLnRvVXBwZXJDYXNlKClcblxuICBpZiAodmFsdWUgIT09IHJlcGxhY2VtZW50KSB7XG4gICAgdmFsdWVzLnB1c2gocmVwbGFjZW1lbnQpXG4gIH1cblxuICAvLyBDb25zdHJ1Y3QgYSBtZW1vcnkgb2JqZWN0IGZvciBgZ2VuZXJhdGVgLlxuICBtZW1vcnkgPSB7XG4gICAgc3RhdGU6IHt9LFxuICAgIHdlaWdodGVkOiB3ZWlnaHRlZCxcbiAgICBzdWdnZXN0aW9uczogc3VnZ2VzdGlvbnNcbiAgfVxuXG4gIGZpcnN0TGV2ZWwgPSBnZW5lcmF0ZShzZWxmLCBtZW1vcnksIHZhbHVlcywgZWRpdHMpXG5cbiAgLy8gV2hpbGUgdGhlcmUgYXJlIG5vIHN1Z2dlc3Rpb25zIGJhc2VkIG9uIGdlbmVyYXRlZCB2YWx1ZXMgd2l0aCBhblxuICAvLyBlZGl0LWRpc3RhbmNlIG9mIGAxYCwgY2hlY2sgdGhlIGdlbmVyYXRlZCB2YWx1ZXMsIGBTSVpFYCBhdCBhIHRpbWUuXG4gIC8vIEJhc2ljYWxseSwgd2XigJlyZSBnZW5lcmF0aW5nIHZhbHVlcyB3aXRoIGFuIGVkaXQtZGlzdGFuY2Ugb2YgYDJgLCBidXQgd2VyZVxuICAvLyBkb2luZyBpdCBpbiBzbWFsbCBiYXRjaGVzIGJlY2F1c2UgaXTigJlzIHN1Y2ggYW4gZXhwZW5zaXZlIG9wZXJhdGlvbi5cbiAgcHJldmlvdXMgPSAwXG4gIG1heCA9IE1hdGgubWluKGZpcnN0TGV2ZWwubGVuZ3RoLCBNYXRoLnBvdyhNYXRoLm1heCgxNSAtIHZhbHVlLmxlbmd0aCwgMyksIDMpKVxuICBzaXplID0gTWF0aC5tYXgoTWF0aC5wb3coMTAgLSB2YWx1ZS5sZW5ndGgsIDMpLCAxKVxuXG4gIHdoaWxlICghc3VnZ2VzdGlvbnMubGVuZ3RoICYmIHByZXZpb3VzIDwgbWF4KSB7XG4gICAgbmV4dCA9IHByZXZpb3VzICsgc2l6ZVxuICAgIGdlbmVyYXRlKHNlbGYsIG1lbW9yeSwgZmlyc3RMZXZlbC5zbGljZShwcmV2aW91cywgbmV4dCkpXG4gICAgcHJldmlvdXMgPSBuZXh0XG4gIH1cblxuICAvLyBTb3J0IHRoZSBzdWdnZXN0aW9ucyBiYXNlZCBvbiB0aGVpciB3ZWlnaHQuXG4gIHN1Z2dlc3Rpb25zLnNvcnQoc29ydClcblxuICAvLyBOb3JtYWxpemUgdGhlIG91dHB1dC5cbiAgdmFsdWVzID0gW11cbiAgbm9ybWFsaXplZCA9IFtdXG4gIGluZGV4ID0gLTFcblxuICB3aGlsZSAoKytpbmRleCA8IHN1Z2dlc3Rpb25zLmxlbmd0aCkge1xuICAgIHN1Z2dlc3Rpb24gPSBub3JtYWxpemUoc3VnZ2VzdGlvbnNbaW5kZXhdLCBzZWxmLmNvbnZlcnNpb24ub3V0KVxuICAgIHJlcGxhY2VtZW50ID0gc3VnZ2VzdGlvbi50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiAobm9ybWFsaXplZC5pbmRleE9mKHJlcGxhY2VtZW50KSA8IDApIHtcbiAgICAgIHZhbHVlcy5wdXNoKHN1Z2dlc3Rpb24pXG4gICAgICBub3JtYWxpemVkLnB1c2gocmVwbGFjZW1lbnQpXG4gICAgfVxuICB9XG5cbiAgLy8gQk9PTSEgQWxsIGRvbmUhXG4gIHJldHVybiB2YWx1ZXNcblxuICBmdW5jdGlvbiBzb3J0KGEsIGIpIHtcbiAgICByZXR1cm4gc29ydFdlaWdodChhLCBiKSB8fCBzb3J0Q2FzaW5nKGEsIGIpIHx8IHNvcnRBbHBoYShhLCBiKVxuICB9XG5cbiAgZnVuY3Rpb24gc29ydFdlaWdodChhLCBiKSB7XG4gICAgcmV0dXJuIHdlaWdodGVkW2FdID09PSB3ZWlnaHRlZFtiXSA/IDAgOiB3ZWlnaHRlZFthXSA+IHdlaWdodGVkW2JdID8gLTEgOiAxXG4gIH1cblxuICBmdW5jdGlvbiBzb3J0Q2FzaW5nKGEsIGIpIHtcbiAgICB2YXIgbGVmdENhc2luZyA9IGNhc2luZyhhKVxuICAgIHZhciByaWdodENhc2luZyA9IGNhc2luZyhiKVxuXG4gICAgcmV0dXJuIGxlZnRDYXNpbmcgPT09IHJpZ2h0Q2FzaW5nXG4gICAgICA/IDBcbiAgICAgIDogbGVmdENhc2luZyA9PT0gY3VycmVudENhc2VcbiAgICAgID8gLTFcbiAgICAgIDogcmlnaHRDYXNpbmcgPT09IGN1cnJlbnRDYXNlXG4gICAgICA/IDFcbiAgICAgIDogdW5kZWZpbmVkXG4gIH1cblxuICBmdW5jdGlvbiBzb3J0QWxwaGEoYSwgYikge1xuICAgIHJldHVybiBhLmxvY2FsZUNvbXBhcmUoYilcbiAgfVxufVxuXG4vLyBHZXQgYSBsaXN0IG9mIHZhbHVlcyBjbG9zZSBpbiBlZGl0IGRpc3RhbmNlIHRvIGB3b3Jkc2AuXG5mdW5jdGlvbiBnZW5lcmF0ZShjb250ZXh0LCBtZW1vcnksIHdvcmRzLCBlZGl0cykge1xuICB2YXIgY2hhcmFjdGVycyA9IGNvbnRleHQuZmxhZ3MuVFJZXG4gIHZhciBkYXRhID0gY29udGV4dC5kYXRhXG4gIHZhciBmbGFncyA9IGNvbnRleHQuZmxhZ3NcbiAgdmFyIHJlc3VsdCA9IFtdXG4gIHZhciBpbmRleCA9IC0xXG4gIHZhciB3b3JkXG4gIHZhciBiZWZvcmVcbiAgdmFyIGNoYXJhY3RlclxuICB2YXIgbmV4dENoYXJhY3RlclxuICB2YXIgbmV4dEFmdGVyXG4gIHZhciBuZXh0TmV4dEFmdGVyXG4gIHZhciBuZXh0VXBwZXJcbiAgdmFyIGN1cnJlbnRDYXNlXG4gIHZhciBwb3NpdGlvblxuICB2YXIgYWZ0ZXJcbiAgdmFyIHVwcGVyXG4gIHZhciBpbmplY3RcbiAgdmFyIG9mZnNldFxuXG4gIC8vIENoZWNrIHRoZSBwcmUtZ2VuZXJhdGVkIGVkaXRzLlxuICBpZiAoZWRpdHMpIHtcbiAgICB3aGlsZSAoKytpbmRleCA8IGVkaXRzLmxlbmd0aCkge1xuICAgICAgY2hlY2soZWRpdHNbaW5kZXhdLCB0cnVlKVxuICAgIH1cbiAgfVxuXG4gIC8vIEl0ZXJhdGUgb3ZlciBnaXZlbiB3b3JkLlxuICBpbmRleCA9IC0xXG5cbiAgd2hpbGUgKCsraW5kZXggPCB3b3Jkcy5sZW5ndGgpIHtcbiAgICB3b3JkID0gd29yZHNbaW5kZXhdXG4gICAgYmVmb3JlID0gJydcbiAgICBjaGFyYWN0ZXIgPSAnJ1xuICAgIG5leHRDaGFyYWN0ZXIgPSB3b3JkLmNoYXJBdCgwKVxuICAgIG5leHRBZnRlciA9IHdvcmRcbiAgICBuZXh0TmV4dEFmdGVyID0gd29yZC5zbGljZSgxKVxuICAgIG5leHRVcHBlciA9IG5leHRDaGFyYWN0ZXIudG9Mb3dlckNhc2UoKSAhPT0gbmV4dENoYXJhY3RlclxuICAgIGN1cnJlbnRDYXNlID0gY2FzaW5nKHdvcmQpXG4gICAgcG9zaXRpb24gPSAtMVxuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIGV2ZXJ5IGNoYXJhY3RlciAoaW5jbHVkaW5nIHRoZSBlbmQpLlxuICAgIHdoaWxlICgrK3Bvc2l0aW9uIDw9IHdvcmQubGVuZ3RoKSB7XG4gICAgICBiZWZvcmUgKz0gY2hhcmFjdGVyXG4gICAgICBhZnRlciA9IG5leHRBZnRlclxuICAgICAgbmV4dEFmdGVyID0gbmV4dE5leHRBZnRlclxuICAgICAgbmV4dE5leHRBZnRlciA9IG5leHRBZnRlci5zbGljZSgxKVxuICAgICAgY2hhcmFjdGVyID0gbmV4dENoYXJhY3RlclxuICAgICAgbmV4dENoYXJhY3RlciA9IHdvcmQuY2hhckF0KHBvc2l0aW9uICsgMSlcbiAgICAgIHVwcGVyID0gbmV4dFVwcGVyXG5cbiAgICAgIGlmIChuZXh0Q2hhcmFjdGVyKSB7XG4gICAgICAgIG5leHRVcHBlciA9IG5leHRDaGFyYWN0ZXIudG9Mb3dlckNhc2UoKSAhPT0gbmV4dENoYXJhY3RlclxuICAgICAgfVxuXG4gICAgICBpZiAobmV4dEFmdGVyICYmIHVwcGVyICE9PSBuZXh0VXBwZXIpIHtcbiAgICAgICAgLy8gUmVtb3ZlLlxuICAgICAgICBjaGVjayhiZWZvcmUgKyBzd2l0Y2hDYXNlKG5leHRBZnRlcikpXG5cbiAgICAgICAgLy8gU3dpdGNoLlxuICAgICAgICBjaGVjayhcbiAgICAgICAgICBiZWZvcmUgK1xuICAgICAgICAgICAgc3dpdGNoQ2FzZShuZXh0Q2hhcmFjdGVyKSArXG4gICAgICAgICAgICBzd2l0Y2hDYXNlKGNoYXJhY3RlcikgK1xuICAgICAgICAgICAgbmV4dE5leHRBZnRlclxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIC8vIFJlbW92ZS5cbiAgICAgIGNoZWNrKGJlZm9yZSArIG5leHRBZnRlcilcblxuICAgICAgLy8gU3dpdGNoLlxuICAgICAgaWYgKG5leHRBZnRlcikge1xuICAgICAgICBjaGVjayhiZWZvcmUgKyBuZXh0Q2hhcmFjdGVyICsgY2hhcmFjdGVyICsgbmV4dE5leHRBZnRlcilcbiAgICAgIH1cblxuICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCBwb3NzaWJsZSBsZXR0ZXJzLlxuICAgICAgb2Zmc2V0ID0gLTFcblxuICAgICAgd2hpbGUgKCsrb2Zmc2V0IDwgY2hhcmFjdGVycy5sZW5ndGgpIHtcbiAgICAgICAgaW5qZWN0ID0gY2hhcmFjdGVyc1tvZmZzZXRdXG5cbiAgICAgICAgLy8gVHJ5IHVwcGVyY2FzZSBpZiB0aGUgb3JpZ2luYWwgY2hhcmFjdGVyIHdhcyB1cHBlcmNhc2VkLlxuICAgICAgICBpZiAodXBwZXIgJiYgaW5qZWN0ICE9PSBpbmplY3QudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgIGlmIChjdXJyZW50Q2FzZSAhPT0gJ3MnKSB7XG4gICAgICAgICAgICBjaGVjayhiZWZvcmUgKyBpbmplY3QgKyBhZnRlcilcbiAgICAgICAgICAgIGNoZWNrKGJlZm9yZSArIGluamVjdCArIG5leHRBZnRlcilcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbmplY3QgPSBpbmplY3QudG9VcHBlckNhc2UoKVxuXG4gICAgICAgICAgY2hlY2soYmVmb3JlICsgaW5qZWN0ICsgYWZ0ZXIpXG4gICAgICAgICAgY2hlY2soYmVmb3JlICsgaW5qZWN0ICsgbmV4dEFmdGVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEFkZCBhbmQgcmVwbGFjZS5cbiAgICAgICAgICBjaGVjayhiZWZvcmUgKyBpbmplY3QgKyBhZnRlcilcbiAgICAgICAgICBjaGVjayhiZWZvcmUgKyBpbmplY3QgKyBuZXh0QWZ0ZXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIGxpc3Qgb2YgZ2VuZXJhdGVkIHdvcmRzLlxuICByZXR1cm4gcmVzdWx0XG5cbiAgLy8gQ2hlY2sgYW5kIGhhbmRsZSBhIGdlbmVyYXRlZCB2YWx1ZS5cbiAgZnVuY3Rpb24gY2hlY2sodmFsdWUsIGRvdWJsZSkge1xuICAgIHZhciBzdGF0ZSA9IG1lbW9yeS5zdGF0ZVt2YWx1ZV1cbiAgICB2YXIgY29ycmVjdGVkXG5cbiAgICBpZiAoc3RhdGUgIT09IEJvb2xlYW4oc3RhdGUpKSB7XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSlcblxuICAgICAgY29ycmVjdGVkID0gZm9ybShjb250ZXh0LCB2YWx1ZSlcbiAgICAgIHN0YXRlID0gY29ycmVjdGVkICYmICFmbGFnKGZsYWdzLCAnTk9TVUdHRVNUJywgZGF0YVtjb3JyZWN0ZWRdKVxuXG4gICAgICBtZW1vcnkuc3RhdGVbdmFsdWVdID0gc3RhdGVcblxuICAgICAgaWYgKHN0YXRlKSB7XG4gICAgICAgIG1lbW9yeS53ZWlnaHRlZFt2YWx1ZV0gPSBkb3VibGUgPyAxMCA6IDBcbiAgICAgICAgbWVtb3J5LnN1Z2dlc3Rpb25zLnB1c2godmFsdWUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlKSB7XG4gICAgICBtZW1vcnkud2VpZ2h0ZWRbdmFsdWVdKytcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzd2l0Y2hDYXNlKGZyYWdtZW50KSB7XG4gICAgdmFyIGZpcnN0ID0gZnJhZ21lbnQuY2hhckF0KDApXG5cbiAgICByZXR1cm4gKFxuICAgICAgKGZpcnN0LnRvTG93ZXJDYXNlKCkgPT09IGZpcnN0XG4gICAgICAgID8gZmlyc3QudG9VcHBlckNhc2UoKVxuICAgICAgICA6IGZpcnN0LnRvTG93ZXJDYXNlKCkpICsgZnJhZ21lbnQuc2xpY2UoMSlcbiAgICApXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgZm9ybSA9IHJlcXVpcmUoJy4vdXRpbC9mb3JtLmpzJylcbnZhciBmbGFnID0gcmVxdWlyZSgnLi91dGlsL2ZsYWcuanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNwZWxsXG5cbi8vIENoZWNrIHNwZWxsaW5nIG9mIGB3b3JkYC5cbmZ1bmN0aW9uIHNwZWxsKHdvcmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHZhciB2YWx1ZSA9IGZvcm0oc2VsZiwgd29yZCwgdHJ1ZSlcblxuICAvLyBIdW5zcGVsbCBhbHNvIHByb3ZpZGVzIGByb290YCAocm9vdCB3b3JkIG9mIHRoZSBpbnB1dCB3b3JkKSwgYW5kIGBjb21wb3VuZGBcbiAgLy8gKHdoZXRoZXIgYHdvcmRgIHdhcyBjb21wb3VuZCkuXG4gIHJldHVybiB7XG4gICAgY29ycmVjdDogc2VsZi5jb3JyZWN0KHdvcmQpLFxuICAgIGZvcmJpZGRlbjogQm9vbGVhbihcbiAgICAgIHZhbHVlICYmIGZsYWcoc2VsZi5mbGFncywgJ0ZPUkJJRERFTldPUkQnLCBzZWxmLmRhdGFbdmFsdWVdKVxuICAgICksXG4gICAgd2FybjogQm9vbGVhbih2YWx1ZSAmJiBmbGFnKHNlbGYuZmxhZ3MsICdXQVJOJywgc2VsZi5kYXRhW3ZhbHVlXSkpXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcGx5XG5cbi8vIEFwcGx5IGEgcnVsZS5cbmZ1bmN0aW9uIGFwcGx5KHZhbHVlLCBydWxlLCBydWxlcywgd29yZHMpIHtcbiAgdmFyIGluZGV4ID0gLTFcbiAgdmFyIGVudHJ5XG4gIHZhciBuZXh0XG4gIHZhciBjb250aW51YXRpb25SdWxlXG4gIHZhciBjb250aW51YXRpb25cbiAgdmFyIHBvc2l0aW9uXG5cbiAgd2hpbGUgKCsraW5kZXggPCBydWxlLmVudHJpZXMubGVuZ3RoKSB7XG4gICAgZW50cnkgPSBydWxlLmVudHJpZXNbaW5kZXhdXG4gICAgY29udGludWF0aW9uID0gZW50cnkuY29udGludWF0aW9uXG4gICAgcG9zaXRpb24gPSAtMVxuXG4gICAgaWYgKCFlbnRyeS5tYXRjaCB8fCBlbnRyeS5tYXRjaC50ZXN0KHZhbHVlKSkge1xuICAgICAgbmV4dCA9IGVudHJ5LnJlbW92ZSA/IHZhbHVlLnJlcGxhY2UoZW50cnkucmVtb3ZlLCAnJykgOiB2YWx1ZVxuICAgICAgbmV4dCA9IHJ1bGUudHlwZSA9PT0gJ1NGWCcgPyBuZXh0ICsgZW50cnkuYWRkIDogZW50cnkuYWRkICsgbmV4dFxuICAgICAgd29yZHMucHVzaChuZXh0KVxuXG4gICAgICBpZiAoY29udGludWF0aW9uICYmIGNvbnRpbnVhdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgd2hpbGUgKCsrcG9zaXRpb24gPCBjb250aW51YXRpb24ubGVuZ3RoKSB7XG4gICAgICAgICAgY29udGludWF0aW9uUnVsZSA9IHJ1bGVzW2NvbnRpbnVhdGlvbltwb3NpdGlvbl1dXG5cbiAgICAgICAgICBpZiAoY29udGludWF0aW9uUnVsZSkge1xuICAgICAgICAgICAgYXBwbHkobmV4dCwgY29udGludWF0aW9uUnVsZSwgcnVsZXMsIHdvcmRzKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB3b3Jkc1xufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBhcHBseSA9IHJlcXVpcmUoJy4vYXBwbHkuanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZFxuXG52YXIgcHVzaCA9IFtdLnB1c2hcblxudmFyIE5PX1JVTEVTID0gW11cblxuLy8gQWRkIGBydWxlc2AgZm9yIGB3b3JkYCB0byB0aGUgdGFibGUuXG5mdW5jdGlvbiBhZGRSdWxlcyhkaWN0LCB3b3JkLCBydWxlcykge1xuICB2YXIgY3VyciA9IGRpY3Rbd29yZF1cblxuICAvLyBTb21lIGRpY3Rpb25hcmllcyB3aWxsIGxpc3QgdGhlIHNhbWUgd29yZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudFxuICAvLyBydWxlIHNldHMuXG4gIGlmICh3b3JkIGluIGRpY3QpIHtcbiAgICBpZiAoY3VyciA9PT0gTk9fUlVMRVMpIHtcbiAgICAgIGRpY3Rbd29yZF0gPSBydWxlcy5jb25jYXQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBwdXNoLmFwcGx5KGN1cnIsIHJ1bGVzKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBkaWN0W3dvcmRdID0gcnVsZXMuY29uY2F0KClcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGQoZGljdCwgd29yZCwgY29kZXMsIG9wdGlvbnMpIHtcbiAgdmFyIHBvc2l0aW9uID0gLTFcbiAgdmFyIHJ1bGVcbiAgdmFyIG9mZnNldFxuICB2YXIgc3VicG9zaXRpb25cbiAgdmFyIHN1Ym9mZnNldFxuICB2YXIgY29tYmluZWRcbiAgdmFyIG5ld1dvcmRzXG4gIHZhciBvdGhlck5ld1dvcmRzXG5cbiAgLy8gQ29tcG91bmQgd29yZHMuXG4gIGlmIChcbiAgICAhKCdORUVEQUZGSVgnIGluIG9wdGlvbnMuZmxhZ3MpIHx8XG4gICAgY29kZXMuaW5kZXhPZihvcHRpb25zLmZsYWdzLk5FRURBRkZJWCkgPCAwXG4gICkge1xuICAgIGFkZFJ1bGVzKGRpY3QsIHdvcmQsIGNvZGVzKVxuICB9XG5cbiAgd2hpbGUgKCsrcG9zaXRpb24gPCBjb2Rlcy5sZW5ndGgpIHtcbiAgICBydWxlID0gb3B0aW9ucy5ydWxlc1tjb2Rlc1twb3NpdGlvbl1dXG5cbiAgICBpZiAoY29kZXNbcG9zaXRpb25dIGluIG9wdGlvbnMuY29tcG91bmRSdWxlQ29kZXMpIHtcbiAgICAgIG9wdGlvbnMuY29tcG91bmRSdWxlQ29kZXNbY29kZXNbcG9zaXRpb25dXS5wdXNoKHdvcmQpXG4gICAgfVxuXG4gICAgaWYgKHJ1bGUpIHtcbiAgICAgIG5ld1dvcmRzID0gYXBwbHkod29yZCwgcnVsZSwgb3B0aW9ucy5ydWxlcywgW10pXG4gICAgICBvZmZzZXQgPSAtMVxuXG4gICAgICB3aGlsZSAoKytvZmZzZXQgPCBuZXdXb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCEobmV3V29yZHNbb2Zmc2V0XSBpbiBkaWN0KSkge1xuICAgICAgICAgIGRpY3RbbmV3V29yZHNbb2Zmc2V0XV0gPSBOT19SVUxFU1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJ1bGUuY29tYmluZWFibGUpIHtcbiAgICAgICAgICBzdWJwb3NpdGlvbiA9IHBvc2l0aW9uXG5cbiAgICAgICAgICB3aGlsZSAoKytzdWJwb3NpdGlvbiA8IGNvZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29tYmluZWQgPSBvcHRpb25zLnJ1bGVzW2NvZGVzW3N1YnBvc2l0aW9uXV1cblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBjb21iaW5lZCAmJlxuICAgICAgICAgICAgICBjb21iaW5lZC5jb21iaW5lYWJsZSAmJlxuICAgICAgICAgICAgICBydWxlLnR5cGUgIT09IGNvbWJpbmVkLnR5cGVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBvdGhlck5ld1dvcmRzID0gYXBwbHkoXG4gICAgICAgICAgICAgICAgbmV3V29yZHNbb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBjb21iaW5lZCxcbiAgICAgICAgICAgICAgICBvcHRpb25zLnJ1bGVzLFxuICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgc3Vib2Zmc2V0ID0gLTFcblxuICAgICAgICAgICAgICB3aGlsZSAoKytzdWJvZmZzZXQgPCBvdGhlck5ld1dvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmICghKG90aGVyTmV3V29yZHNbc3Vib2Zmc2V0XSBpbiBkaWN0KSkge1xuICAgICAgICAgICAgICAgICAgZGljdFtvdGhlck5ld1dvcmRzW3N1Ym9mZnNldF1dID0gTk9fUlVMRVNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgcHVzaCA9IHJlcXVpcmUoJy4vdXRpbC9hZGQuanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZFxuXG52YXIgTk9fQ09ERVMgPSBbXVxuXG4vLyBBZGQgYHZhbHVlYCB0byB0aGUgY2hlY2tlci5cbmZ1bmN0aW9uIGFkZCh2YWx1ZSwgbW9kZWwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgcHVzaChzZWxmLmRhdGEsIHZhbHVlLCBzZWxmLmRhdGFbbW9kZWxdIHx8IE5PX0NPREVTLCBzZWxmKVxuXG4gIHJldHVybiBzZWxmXG59XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSByZW1vdmVcblxuLy8gUmVtb3ZlIGB2YWx1ZWAgZnJvbSB0aGUgY2hlY2tlci5cbmZ1bmN0aW9uIHJlbW92ZSh2YWx1ZSkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBkZWxldGUgc2VsZi5kYXRhW3ZhbHVlXVxuXG4gIHJldHVybiBzZWxmXG59XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSB3b3JkQ2hhcmFjdGVyc1xuXG4vLyBHZXQgdGhlIHdvcmQgY2hhcmFjdGVycyBkZWZpbmVkIGluIGFmZml4LlxuZnVuY3Rpb24gd29yZENoYXJhY3RlcnMoKSB7XG4gIHJldHVybiB0aGlzLmZsYWdzLldPUkRDSEFSUyB8fCBudWxsXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIHBhcnNlQ29kZXMgPSByZXF1aXJlKCcuL3J1bGUtY29kZXMuanMnKVxudmFyIGFkZCA9IHJlcXVpcmUoJy4vYWRkLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZVxuXG4vLyBFeHByZXNzaW9ucy5cbnZhciB3aGl0ZVNwYWNlRXhwcmVzc2lvbiA9IC9cXHMvZ1xuXG4vLyBQYXJzZSBhIGRpY3Rpb25hcnkuXG5mdW5jdGlvbiBwYXJzZShidWYsIG9wdGlvbnMsIGRpY3QpIHtcbiAgLy8gUGFyc2UgYXMgbGluZXMgKGlnbm9yaW5nIHRoZSBmaXJzdCBsaW5lKS5cbiAgdmFyIHZhbHVlID0gYnVmLnRvU3RyaW5nKCd1dGY4JylcbiAgdmFyIGxhc3QgPSB2YWx1ZS5pbmRleE9mKCdcXG4nKSArIDFcbiAgdmFyIGluZGV4ID0gdmFsdWUuaW5kZXhPZignXFxuJywgbGFzdClcblxuICB3aGlsZSAoaW5kZXggPiAtMSkge1xuICAgIC8vIFNvbWUgZGljdGlvbmFyaWVzIHVzZSB0YWJzIGFzIGNvbW1lbnRzLlxuICAgIGlmICh2YWx1ZS5jaGFyQ29kZUF0KGxhc3QpICE9PSA5IC8qIGBcXHRgICovKSB7XG4gICAgICBwYXJzZUxpbmUodmFsdWUuc2xpY2UobGFzdCwgaW5kZXgpLCBvcHRpb25zLCBkaWN0KVxuICAgIH1cblxuICAgIGxhc3QgPSBpbmRleCArIDFcbiAgICBpbmRleCA9IHZhbHVlLmluZGV4T2YoJ1xcbicsIGxhc3QpXG4gIH1cblxuICBwYXJzZUxpbmUodmFsdWUuc2xpY2UobGFzdCksIG9wdGlvbnMsIGRpY3QpXG59XG5cbi8vIFBhcnNlIGEgbGluZSBpbiBkaWN0aW9uYXJ5LlxuZnVuY3Rpb24gcGFyc2VMaW5lKGxpbmUsIG9wdGlvbnMsIGRpY3QpIHtcbiAgdmFyIHNsYXNoT2Zmc2V0ID0gbGluZS5pbmRleE9mKCcvJylcbiAgdmFyIGhhc2hPZmZzZXQgPSBsaW5lLmluZGV4T2YoJyMnKVxuICB2YXIgY29kZXMgPSAnJ1xuICB2YXIgd29yZFxuICB2YXIgcmVzdWx0XG5cbiAgLy8gRmluZCBvZmZzZXRzLlxuICB3aGlsZSAoXG4gICAgc2xhc2hPZmZzZXQgPiAtMSAmJlxuICAgIGxpbmUuY2hhckNvZGVBdChzbGFzaE9mZnNldCAtIDEpID09PSA5MiAvKiBgXFxgICovXG4gICkge1xuICAgIGxpbmUgPSBsaW5lLnNsaWNlKDAsIHNsYXNoT2Zmc2V0IC0gMSkgKyBsaW5lLnNsaWNlKHNsYXNoT2Zmc2V0KVxuICAgIHNsYXNoT2Zmc2V0ID0gbGluZS5pbmRleE9mKCcvJywgc2xhc2hPZmZzZXQpXG4gIH1cblxuICAvLyBIYW5kbGUgaGFzaCBhbmQgc2xhc2ggb2Zmc2V0cy5cbiAgLy8gTm90ZSB0aGF0IGhhc2ggY2FuIGJlIGEgdmFsaWQgZmxhZywgc28gd2Ugc2hvdWxkIG5vdCBqdXN0IGRpc2NhcmRcbiAgLy8gZXZlcnl0aGluZyBhZnRlciBpdC5cbiAgaWYgKGhhc2hPZmZzZXQgPiAtMSkge1xuICAgIGlmIChzbGFzaE9mZnNldCA+IC0xICYmIHNsYXNoT2Zmc2V0IDwgaGFzaE9mZnNldCkge1xuICAgICAgd29yZCA9IGxpbmUuc2xpY2UoMCwgc2xhc2hPZmZzZXQpXG4gICAgICB3aGl0ZVNwYWNlRXhwcmVzc2lvbi5sYXN0SW5kZXggPSBzbGFzaE9mZnNldCArIDFcbiAgICAgIHJlc3VsdCA9IHdoaXRlU3BhY2VFeHByZXNzaW9uLmV4ZWMobGluZSlcbiAgICAgIGNvZGVzID0gbGluZS5zbGljZShzbGFzaE9mZnNldCArIDEsIHJlc3VsdCA/IHJlc3VsdC5pbmRleCA6IHVuZGVmaW5lZClcbiAgICB9IGVsc2Uge1xuICAgICAgd29yZCA9IGxpbmUuc2xpY2UoMCwgaGFzaE9mZnNldClcbiAgICB9XG4gIH0gZWxzZSBpZiAoc2xhc2hPZmZzZXQgPiAtMSkge1xuICAgIHdvcmQgPSBsaW5lLnNsaWNlKDAsIHNsYXNoT2Zmc2V0KVxuICAgIGNvZGVzID0gbGluZS5zbGljZShzbGFzaE9mZnNldCArIDEpXG4gIH0gZWxzZSB7XG4gICAgd29yZCA9IGxpbmVcbiAgfVxuXG4gIHdvcmQgPSB3b3JkLnRyaW0oKVxuXG4gIGlmICh3b3JkKSB7XG4gICAgYWRkKGRpY3QsIHdvcmQsIHBhcnNlQ29kZXMob3B0aW9ucy5mbGFncywgY29kZXMudHJpbSgpKSwgb3B0aW9ucylcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBwYXJzZSA9IHJlcXVpcmUoJy4vdXRpbC9kaWN0aW9uYXJ5LmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSBhZGRcblxuLy8gQWRkIGEgZGljdGlvbmFyeSBmaWxlLlxuZnVuY3Rpb24gYWRkKGJ1Zikge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIGluZGV4ID0gLTFcbiAgdmFyIHJ1bGVcbiAgdmFyIHNvdXJjZVxuICB2YXIgY2hhcmFjdGVyXG4gIHZhciBvZmZzZXRcblxuICBwYXJzZShidWYsIHNlbGYsIHNlbGYuZGF0YSlcblxuICAvLyBSZWdlbmVyYXRlIGNvbXBvdW5kIGV4cHJlc3Npb25zLlxuICB3aGlsZSAoKytpbmRleCA8IHNlbGYuY29tcG91bmRSdWxlcy5sZW5ndGgpIHtcbiAgICBydWxlID0gc2VsZi5jb21wb3VuZFJ1bGVzW2luZGV4XVxuICAgIHNvdXJjZSA9ICcnXG4gICAgb2Zmc2V0ID0gLTFcblxuICAgIHdoaWxlICgrK29mZnNldCA8IHJ1bGUubGVuZ3RoKSB7XG4gICAgICBjaGFyYWN0ZXIgPSBydWxlLmNoYXJBdChvZmZzZXQpXG4gICAgICBzb3VyY2UgKz0gc2VsZi5jb21wb3VuZFJ1bGVDb2Rlc1tjaGFyYWN0ZXJdLmxlbmd0aFxuICAgICAgICA/ICcoPzonICsgc2VsZi5jb21wb3VuZFJ1bGVDb2Rlc1tjaGFyYWN0ZXJdLmpvaW4oJ3wnKSArICcpJ1xuICAgICAgICA6IGNoYXJhY3RlclxuICAgIH1cblxuICAgIHNlbGYuY29tcG91bmRSdWxlc1tpbmRleF0gPSBuZXcgUmVnRXhwKHNvdXJjZSwgJ2knKVxuICB9XG5cbiAgcmV0dXJuIHNlbGZcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZFxuXG4vLyBBZGQgYSBkaWN0aW9uYXJ5LlxuZnVuY3Rpb24gYWRkKGJ1Zikge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIGxpbmVzID0gYnVmLnRvU3RyaW5nKCd1dGY4Jykuc3BsaXQoJ1xcbicpXG4gIHZhciBpbmRleCA9IC0xXG4gIHZhciBsaW5lXG4gIHZhciBmb3JiaWRkZW5cbiAgdmFyIHdvcmRcbiAgdmFyIGZsYWdcblxuICAvLyBFbnN1cmUgdGhlcmXigJlzIGEga2V5IGZvciBgRk9SQklEREVOV09SRGA6IGBmYWxzZWAgY2Fubm90IGJlIHNldCB0aHJvdWdoIGFuXG4gIC8vIGFmZml4IGZpbGUgc28gaXRzIHNhZmUgdG8gdXNlIGFzIGEgbWFnaWMgY29uc3RhbnQuXG4gIGlmIChzZWxmLmZsYWdzLkZPUkJJRERFTldPUkQgPT09IHVuZGVmaW5lZCkgc2VsZi5mbGFncy5GT1JCSURERU5XT1JEID0gZmFsc2VcbiAgZmxhZyA9IHNlbGYuZmxhZ3MuRk9SQklEREVOV09SRFxuXG4gIHdoaWxlICgrK2luZGV4IDwgbGluZXMubGVuZ3RoKSB7XG4gICAgbGluZSA9IGxpbmVzW2luZGV4XS50cmltKClcblxuICAgIGlmICghbGluZSkge1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICBsaW5lID0gbGluZS5zcGxpdCgnLycpXG4gICAgd29yZCA9IGxpbmVbMF1cbiAgICBmb3JiaWRkZW4gPSB3b3JkLmNoYXJBdCgwKSA9PT0gJyonXG5cbiAgICBpZiAoZm9yYmlkZGVuKSB7XG4gICAgICB3b3JkID0gd29yZC5zbGljZSgxKVxuICAgIH1cblxuICAgIHNlbGYuYWRkKHdvcmQsIGxpbmVbMV0pXG5cbiAgICBpZiAoZm9yYmlkZGVuKSB7XG4gICAgICBzZWxmLmRhdGFbd29yZF0ucHVzaChmbGFnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzZWxmXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIGJ1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpXG52YXIgYWZmaXggPSByZXF1aXJlKCcuL3V0aWwvYWZmaXguanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5TcGVsbFxuXG52YXIgcHJvdG8gPSBOU3BlbGwucHJvdG90eXBlXG5cbnByb3RvLmNvcnJlY3QgPSByZXF1aXJlKCcuL2NvcnJlY3QuanMnKVxucHJvdG8uc3VnZ2VzdCA9IHJlcXVpcmUoJy4vc3VnZ2VzdC5qcycpXG5wcm90by5zcGVsbCA9IHJlcXVpcmUoJy4vc3BlbGwuanMnKVxucHJvdG8uYWRkID0gcmVxdWlyZSgnLi9hZGQuanMnKVxucHJvdG8ucmVtb3ZlID0gcmVxdWlyZSgnLi9yZW1vdmUuanMnKVxucHJvdG8ud29yZENoYXJhY3RlcnMgPSByZXF1aXJlKCcuL3dvcmQtY2hhcmFjdGVycy5qcycpXG5wcm90by5kaWN0aW9uYXJ5ID0gcmVxdWlyZSgnLi9kaWN0aW9uYXJ5LmpzJylcbnByb3RvLnBlcnNvbmFsID0gcmVxdWlyZSgnLi9wZXJzb25hbC5qcycpXG5cbi8vIENvbnN0cnVjdCBhIG5ldyBzcGVsbGluZyBjb250ZXh0LlxuZnVuY3Rpb24gTlNwZWxsKGFmZiwgZGljKSB7XG4gIHZhciBpbmRleCA9IC0xXG4gIHZhciBkaWN0aW9uYXJpZXNcblxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTlNwZWxsKSkge1xuICAgIHJldHVybiBuZXcgTlNwZWxsKGFmZiwgZGljKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBhZmYgPT09ICdzdHJpbmcnIHx8IGJ1ZmZlcihhZmYpKSB7XG4gICAgaWYgKHR5cGVvZiBkaWMgPT09ICdzdHJpbmcnIHx8IGJ1ZmZlcihkaWMpKSB7XG4gICAgICBkaWN0aW9uYXJpZXMgPSBbe2RpYzogZGljfV1cbiAgICB9XG4gIH0gZWxzZSBpZiAoYWZmKSB7XG4gICAgaWYgKCdsZW5ndGgnIGluIGFmZikge1xuICAgICAgZGljdGlvbmFyaWVzID0gYWZmXG4gICAgICBhZmYgPSBhZmZbMF0gJiYgYWZmWzBdLmFmZlxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYWZmLmRpYykge1xuICAgICAgICBkaWN0aW9uYXJpZXMgPSBbYWZmXVxuICAgICAgfVxuXG4gICAgICBhZmYgPSBhZmYuYWZmXG4gICAgfVxuICB9XG5cbiAgaWYgKCFhZmYpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgYGFmZmAgaW4gZGljdGlvbmFyeScpXG4gIH1cblxuICBhZmYgPSBhZmZpeChhZmYpXG5cbiAgdGhpcy5kYXRhID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICB0aGlzLmNvbXBvdW5kUnVsZUNvZGVzID0gYWZmLmNvbXBvdW5kUnVsZUNvZGVzXG4gIHRoaXMucmVwbGFjZW1lbnRUYWJsZSA9IGFmZi5yZXBsYWNlbWVudFRhYmxlXG4gIHRoaXMuY29udmVyc2lvbiA9IGFmZi5jb252ZXJzaW9uXG4gIHRoaXMuY29tcG91bmRSdWxlcyA9IGFmZi5jb21wb3VuZFJ1bGVzXG4gIHRoaXMucnVsZXMgPSBhZmYucnVsZXNcbiAgdGhpcy5mbGFncyA9IGFmZi5mbGFnc1xuXG4gIGlmIChkaWN0aW9uYXJpZXMpIHtcbiAgICB3aGlsZSAoKytpbmRleCA8IGRpY3Rpb25hcmllcy5sZW5ndGgpIHtcbiAgICAgIGlmIChkaWN0aW9uYXJpZXNbaW5kZXhdLmRpYykge1xuICAgICAgICB0aGlzLmRpY3Rpb25hcnkoZGljdGlvbmFyaWVzW2luZGV4XS5kaWMpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBTcGVsbENoZWNrZXIge1xuICBhYnN0cmFjdCBhZGRXb3JkKHdvcmQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG4gIGFic3RyYWN0IGFkZFdvcmRzKHdvcmRzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD47XG4gIGFic3RyYWN0IHJlbW92ZVdvcmQod29yZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcbiAgYWJzdHJhY3QgcmVtb3ZlV29yZHMod29yZHM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPjtcbiAgYWJzdHJhY3Qgc3VnZ2VzdCh3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPjtcbiAgYWJzdHJhY3QgY29ycmVjdCh3b3JkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+O1xufVxuIiwiaW1wb3J0IFNwZWxsQ2hlY2tlciBmcm9tIFwiLi9hYnN0cmFjdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOU3BlbGxDaGVja2VyIGV4dGVuZHMgU3BlbGxDaGVja2VyIHtcbiAgblNwZWxsOiBOc3BlbGw7XG5cbiAgY29uc3RydWN0b3IoblNwZWxsOiBOc3BlbGwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMublNwZWxsID0gblNwZWxsO1xuICB9O1xuXG4gIGFkZFdvcmQod29yZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5uU3BlbGwuYWRkKHdvcmQpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIGFzeW5jIGFkZFdvcmRzKHdvcmRzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IFByb21pc2UuYWxsKHdvcmRzLm1hcCh3b3JkID0+IHRoaXMuYWRkV29yZCh3b3JkKSkpO1xuICB9XG5cbiAgcmVtb3ZlV29yZCh3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLm5TcGVsbC5yZW1vdmUod29yZCk7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgYXN5bmMgcmVtb3ZlV29yZHMod29yZHM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwod29yZHMubWFwKHdvcmQgPT4gdGhpcy5yZW1vdmVXb3JkKHdvcmQpKSk7XG4gIH1cblxuICBzdWdnZXN0KHdvcmQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMublNwZWxsLnN1Z2dlc3Qod29yZCkpO1xuICB9XG5cbiAgY29ycmVjdCh3b3JkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMublNwZWxsLmNvcnJlY3Qod29yZCkpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBc3NlcnRpb25FcnJvciB9IGZyb20gXCJhc3NlcnRcIjtcbmltcG9ydCBuc3BlbGwgZnJvbSBcIm5zcGVsbFwiO1xuaW1wb3J0IHsgRGljdHJpb25hcnlSZXN1bHQgfSBmcm9tIFwic3JjL3R5cGVzL2RpY3Rpb25hcnlcIjtcbmltcG9ydCBTcGVsbENoZWNrZXIgZnJvbSAnc3JjL3NwZWxsQ2hlY2tlci9hYnN0cmFjdCc7XG5pbXBvcnQgTlNwZWxsQ2hlY2tlciBmcm9tICdzcmMvc3BlbGxDaGVja2VyL25TcGVsbENoZWNrZXInO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3BlbGxDaGVja2VyRmFjdG9yeSB7XG4gIGFic3RyYWN0IGdldFNwZWxsQ2hlY2tlcigpOiBQcm9taXNlPFNwZWxsQ2hlY2tlcj47XG59XG5cbnR5cGUgRGljdGlvbmFyeUxvYWRlciA9IChhZmZVcmk6IHN0cmluZywgZGljVXJpOiBzdHJpbmcpID0+IFByb21pc2U8RGljdHJpb25hcnlSZXN1bHQ+O1xuXG5leHBvcnQgY2xhc3MgTlNwZWxsQ2hlY2tlckZhY3RvcnkgZXh0ZW5kcyBTcGVsbENoZWNrZXJGYWN0b3J5IHtcbiAgX2FmZlVyaXM6IHN0cmluZ1tdO1xuICBfZGljVXJpczogc3RyaW5nW107XG4gIGxvYWREaWN0aW9uYXJ5OiBEaWN0aW9uYXJ5TG9hZGVyO1xuXG4gIGNvbnN0cnVjdG9yKGFmZlVyaXM6IHN0cmluZ1tdLCBkaWNVcmlzOiBzdHJpbmdbXSwgbG9hZERpY3Rpb25hcnk6IERpY3Rpb25hcnlMb2FkZXIpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKGFmZlVyaXMubGVuZ3RoICE9PSBkaWNVcmlzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEFzc2VydGlvbkVycm9yKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWZmVXJpcyA9IGFmZlVyaXM7XG4gICAgdGhpcy5fZGljVXJpcyA9IGRpY1VyaXM7XG4gICAgdGhpcy5sb2FkRGljdGlvbmFyeSA9IGxvYWREaWN0aW9uYXJ5O1xuICB9XG5cbiAgYXN5bmMgZ2V0U3BlbGxDaGVja2VyKCk6IFByb21pc2U8U3BlbGxDaGVja2VyPiB7XG4gICAgY29uc3QgcHJvbWlzZXM6IFByb21pc2U8RGljdHJpb25hcnlSZXN1bHQ+W10gPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fYWZmVXJpcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYWZmVXJpID0gdGhpcy5fYWZmVXJpc1tpXTtcbiAgICAgIGNvbnN0IGRpY1VyaSA9IHRoaXMuX2RpY1VyaXNbaV07XG4gICAgICBwcm9taXNlcy5wdXNoKHRoaXMubG9hZERpY3Rpb25hcnkoYWZmVXJpLCBkaWNVcmkpKTtcbiAgICB9XG4gICAgY29uc3QgZGljdGlvbmFyaWVzID0gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgIGNvbnN0IG5zcGVsbEluc3RhbmNlID0gbnNwZWxsKGRpY3Rpb25hcmllcyk7XG4gICAgcmV0dXJuIG5ldyBOU3BlbGxDaGVja2VyKG5zcGVsbEluc3RhbmNlKTtcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmM6IChhcmdzPzogYW55KSA9PiB2b2lkLCB3YWl0OiBudW1iZXIsIGltbWVkaWF0ZTogYm9vbGVhbikge1xuXHRsZXQgdGltZW91dDogTm9kZUpTLlRpbWVvdXQ7XG5cblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0aWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0fTtcblx0XHR2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuXHRcdGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHR9O1xufTtcbiIsImltcG9ydCB7IERpY3RyaW9uYXJ5UmVzdWx0IH0gZnJvbSBcInNyYy90eXBlcy9kaWN0aW9uYXJ5XCI7XG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRGaWxlKHVyaTogc3RyaW5nKTogUHJvbWlzZTxCdWZmZXI+IHtcbiAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJpKTtcbiAgY29uc3QgYUJ1ZiA9IGF3YWl0IHJlcy5hcnJheUJ1ZmZlcigpO1xuICByZXR1cm4gQnVmZmVyLmZyb20oYUJ1Zik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGxvYWQoYWZmVXJpOiBzdHJpbmcsIGRpY1VyaTogc3RyaW5nKTogUHJvbWlzZTxEaWN0cmlvbmFyeVJlc3VsdD4ge1xuICBjb25zdCBbYWZmLCBkaWNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW2xvYWRGaWxlKGFmZlVyaSksIGxvYWRGaWxlKGRpY1VyaSldKTtcblxuICBjb25zdCByZXN1bHQ6IERpY3RyaW9uYXJ5UmVzdWx0ID0ge1xuICAgIGFmZixcbiAgICBkaWMsXG4gIH07XG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc3RPZnJXb3Jkc1RvQXJyYXkod29yZHM6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIHdvcmRzXG4gICAgLnNwbGl0KFwiLFwiKVxuICAgIC5tYXAoKHcpID0+IHcudHJpbSgpKVxuICAgIC5maWx0ZXIoKHcpID0+IHcpO1xufVxuIiwiaW1wb3J0IHsgQXBwLCBQbHVnaW4sIFBsdWdpbk1hbmlmZXN0IH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcblxyXG5pbXBvcnQgU3BlbGxDaGVrZXJTZXR0aW5nVGFiIGZyb20gXCIuL2NvcmUvc2V0dGluZ1RhYlwiO1xyXG5pbXBvcnQgU3BlbGxDaGVja2VyIGZyb20gXCIuL3NwZWxsQ2hlY2tlci9hYnN0cmFjdFwiO1xyXG5pbXBvcnQge1xyXG4gIE5TcGVsbENoZWNrZXJGYWN0b3J5LFxyXG4gIFNwZWxsQ2hlY2tlckZhY3RvcnksXHJcbn0gZnJvbSBcIi4vc3BlbGxDaGVja2VyL2ZhY3RvcnlcIjtcclxuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tIFwiLi91dGlscy9kZWJvdW5jZVwiO1xyXG5pbXBvcnQgbG9hZERpY3Rpb25hcnkgZnJvbSBcIi4vdXRpbHMvZGljdGlvbmFyaWVzXCI7XHJcbmltcG9ydCB7IHN0T2ZyV29yZHNUb0FycmF5IH0gZnJvbSBcIi4vdXRpbHMvd29yZHNcIjtcclxuXHJcbmludGVyZmFjZSBTcGVsbENoZWtlclBsdWdpblNldHRpbmdzIHtcclxuICBjdXN0b21Xb3Jkczogc3RyaW5nO1xyXG59XHJcblxyXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBTcGVsbENoZWtlclBsdWdpblNldHRpbmdzID0ge1xyXG4gIGN1c3RvbVdvcmRzOiBcIlwiLFxyXG59O1xyXG5cclxuY29uc3QgdGV4dFJlZ2V4cCA9IC9eW9CQLdGPLV0rJC87XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGVsbENoZWtlclBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgc2V0dGluZ3M6IFNwZWxsQ2hla2VyUGx1Z2luU2V0dGluZ3M7XHJcbiAgY206IENvZGVNaXJyb3IuRWRpdG9yO1xyXG4gIG1hcmtlcnM6IGFueVtdID0gW107XHJcbiAgY3VzdG9tV29yZHM6IHN0cmluZ1tdO1xyXG4gIGRpYWxvZzogTm9kZSB8IG51bGw7XHJcblxyXG4gIHNwZWxsQ2hlY2tlcjogU3BlbGxDaGVja2VyO1xyXG4gIHNwZWxsQ2hlY2tlckZhY3Rvcnk6IFNwZWxsQ2hlY2tlckZhY3Rvcnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBtYW5pZmVzdDogUGx1Z2luTWFuaWZlc3QpIHtcclxuICAgIHN1cGVyKGFwcCwgbWFuaWZlc3QpO1xyXG4gICAgdGhpcy5zcGVsbENoZWNrZXJGYWN0b3J5ID0gbmV3IE5TcGVsbENoZWNrZXJGYWN0b3J5KFxyXG4gICAgICBbXHJcbiAgICAgICAgXCJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vd29vb3JtL2RpY3Rpb25hcmllcy9tYWluL2RpY3Rpb25hcmllcy9ydS9pbmRleC5hZmZcIixcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgIFwiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3dvb29ybS9kaWN0aW9uYXJpZXMvbWFpbi9kaWN0aW9uYXJpZXMvcnUvaW5kZXguZGljXCIsXHJcbiAgICAgIF0sXHJcbiAgICAgIGxvYWREaWN0aW9uYXJ5XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpLFxyXG4gICAgICAodGhpcy5zcGVsbENoZWNrZXIgPSBhd2FpdCB0aGlzLnNwZWxsQ2hlY2tlckZhY3RvcnkuZ2V0U3BlbGxDaGVja2VyKCkpLFxyXG4gICAgXSk7XHJcbiAgICBjb25zdCBjdXN0b21Xb3JkcyA9IHN0T2ZyV29yZHNUb0FycmF5KHRoaXMuc2V0dGluZ3MuY3VzdG9tV29yZHMpO1xyXG4gICAgYXdhaXQgdGhpcy5zcGVsbENoZWNrZXIuYWRkV29yZHMoY3VzdG9tV29yZHMpO1xyXG5cclxuICAgIHRoaXMucmVnaXN0ZXJDb2RlTWlycm9yKHRoaXMuYXR0YWNoQ29kZU1pcnJvcik7XHJcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNwZWxsQ2hla2VyU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG4gIH1cclxuXHJcbiAgYXR0YWNoQ29kZU1pcnJvciA9IChjbTogQ29kZU1pcnJvci5FZGl0b3IpID0+IHtcclxuICAgIGlmICh0aGlzLmNtICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5jbS5vZmYoJ2NoYW5nZScsIHRoaXMuY2hlY2tTcGVsbGluZ092ZXJFZGl0b3JEZWJvdW5jZWQpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgdGhpcy5jbSA9IGNtO1xyXG4gICAgdGhpcy5jbS5vbihcImNoYW5nZVwiLCB0aGlzLmNoZWNrU3BlbGxpbmdPdmVyRWRpdG9yRGVib3VuY2VkKTtcclxuICAgIHRoaXMuY2hlY2tTcGVsbGluZ092ZXJFZGl0b3JEZWJvdW5jZWQoKTtcclxuICB9O1xyXG5cclxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcclxuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2VDdXN0b21Xb3JkcyA9IGFzeW5jIChwcmV2V29yZHM6IHN0cmluZywgbmV3V29yZHM6IHN0cmluZykgPT4ge1xyXG4gICAgYXdhaXQgdGhpcy5zcGVsbENoZWNrZXIucmVtb3ZlV29yZHMoc3RPZnJXb3Jkc1RvQXJyYXkocHJldldvcmRzKSk7XHJcbiAgICBhd2FpdCB0aGlzLnNwZWxsQ2hlY2tlci5hZGRXb3JkcyhzdE9mcldvcmRzVG9BcnJheShuZXdXb3JkcykpO1xyXG4gIH07XHJcblxyXG4gIGNoZWNrU3BlbGxpbmdPdmVyRWRpdG9yID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgaWYgKHRoaXMuY20gPT0gbnVsbCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5tYXJrZXJzLmZvckVhY2goKG06IGFueSkgPT4ge1xyXG4gICAgICBtLmNsZWFyKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm1hcmtlcnMgPSBbXTtcclxuXHJcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5jbS5nZXRWYWx1ZSgpO1xyXG4gICAgbGV0IGN1cnJlbnRXb3JkID0gXCJcIjtcclxuXHJcbiAgICBsZXQgbGluZSA9IDA7XHJcbiAgICBsZXQgcG9zQ2hhciA9IDA7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGNoYXIgPSB0ZXh0W2ldO1xyXG5cclxuICAgICAgaWYgKHRleHRSZWdleHAudGVzdChjaGFyKSkge1xyXG4gICAgICAgIGN1cnJlbnRXb3JkICs9IGNoYXI7XHJcbiAgICAgICAgcG9zQ2hhciArPSAxO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY3VycmVudFdvcmQubGVuZ3RoICE9PSAwICYmICFjdXJyZW50V29yZC5pbmNsdWRlcyhcIi1cIikpIHtcclxuICAgICAgICBjb25zdCBpc1ZhbGlkID0gYXdhaXQgdGhpcy5zcGVsbENoZWNrZXIuY29ycmVjdChjdXJyZW50V29yZCk7XHJcblxyXG4gICAgICAgIGlmICghaXNWYWxpZCkge1xyXG4gICAgICAgICAgY29uc3Qgc3RhcnRQb3MgPSBwb3NDaGFyIC0gY3VycmVudFdvcmQubGVuZ3RoIC0gMTtcclxuICAgICAgICAgIGNvbnN0IGVuZFBvcyA9IHBvc0NoYXI7XHJcbiAgICAgICAgICBjb25zdCBtID0gdGhpcy5jbS5tYXJrVGV4dChcclxuICAgICAgICAgICAgeyBjaDogc3RhcnRQb3MsIGxpbmUgfSxcclxuICAgICAgICAgICAgeyBjaDogZW5kUG9zLCBsaW5lIH0sXHJcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBcInNwZWxsaW5nLWVycm9yXCIgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHRoaXMubWFya2Vycy5wdXNoKG0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcG9zQ2hhciArPSAxO1xyXG5cclxuICAgICAgaWYgKGNoYXIgPT09IFwiXFxuXCIpIHtcclxuICAgICAgICBwb3NDaGFyID0gMDtcclxuICAgICAgICBsaW5lICs9IDE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGN1cnJlbnRXb3JkID0gXCJcIjtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjaGVja1NwZWxsaW5nT3ZlckVkaXRvckRlYm91bmNlZCA9IGRlYm91bmNlKHRoaXMuY2hlY2tTcGVsbGluZ092ZXJFZGl0b3IsIDEwMDAsIGZhbHNlKTtcclxufVxyXG4iXSwibmFtZXMiOlsiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJOT19DT0RFUyIsInB1c2giLCJ3aGl0ZVNwYWNlRXhwcmVzc2lvbiIsInBhcnNlIiwiZXhhY3QiLCJmbGFnIiwibm9ybWFsaXplIiwiZm9ybSIsImNhc2luZyIsImFkZCIsImFwcGx5IiwicGFyc2VDb2RlcyIsInJlcXVpcmUkJDAiLCJyZXF1aXJlJCQxIiwicmVxdWlyZSQkMiIsInJlcXVpcmUkJDMiLCJyZXF1aXJlJCQ0IiwicmVxdWlyZSQkNSIsInJlcXVpcmUkJDYiLCJyZXF1aXJlJCQ3IiwiYnVmZmVyIiwiYWZmaXgiLCJBc3NlcnRpb25FcnJvciIsIm5zcGVsbCIsIlBsdWdpbiIsImxvYWREaWN0aW9uYXJ5Il0sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFP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
