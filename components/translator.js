const AMERICAN_ONLY = require("./american-only.js");
(AMERICAN_TO_BRITISH_SPELLING = require("./american-to-british-spelling.js")),
  (AMERICAN_TO_BRITISH_TITLES = require("./american-to-british-titles.js")),
  (BRITISH_ONLY = require("./british-only.js"));

String.prototype.replaceKeepCase = function (regex, replaceString) {
  const MATCH = this.match(regex);
  let result;
  const isUpperCase = (char) => {
    return /[A-Z]/.test(char);
  };
  if (MATCH != null && isUpperCase(MATCH[0][0])) {
    let replacedString = this.replace(regex, replaceString);
    let stringArray = replacedString.split("");
    stringArray.splice(MATCH.index, 1, stringArray[MATCH.index].toUpperCase());
    return stringArray.join("");
  } else {
    return this.replace(regex, replaceString);
  }
};

class Translator {
  getMatches(object, string) {
    let matches = [],
      matchObj = {};
    const KEYS = Object.keys(object);
    for (let i = 0; i < KEYS.length; i++) {
      const KEY_NAME = KEYS[i],
        KEY_REGEX = new RegExp(KEY_NAME, "i");
      if (KEY_REGEX.test(string)) {
        matchObj[KEY_NAME] = object[KEY_NAME];
      }
    }
    if (Object.keys(matchObj).length !== 0) matches.push(matchObj);
    return matches; // returns array of objects
  }

  getWorstMatches(array) {
    let worstMatches = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i][0].length < array[i][1]) {
        worstMatches.push(array[i][0]);
      } else {
        worstMatches.push(array[i][1]);
      }
    }
    return worstMatches;
  }

  extractDoubleMatchedKeys(object) {
    const KEYS = Object.keys(object);
    let doubleMatchedKeys = [];
    for (let i = 0; i < KEYS.length; i++) {
      const PIVOT_KEY = KEYS[i];
      for (let j = 0; j < KEYS.length; j++) {
        if (PIVOT_KEY !== KEYS[j]) {
          if (KEYS[j].includes(PIVOT_KEY)) {
            doubleMatchedKeys.push([KEYS[j], PIVOT_KEY]);
          }
        }
      }
    }
    return doubleMatchedKeys; // returns 2d array containing similar keys
  }

  hasHourAndMinute(str) {
    return /\d{1,2}[:|\.]\d\d/g.test(str);
  }

  replaceTimeSymbol(str) {
    let getOppositeSymbol = {
        ":": ".",
        ".": ":",
      },
      timeRegex = /\d{1,2}[:|\.]\d\d/g,
      match = str.match(timeRegex)[0];
    if (match.length === 5) {
      match = match.replace(match[2], getOppositeSymbol[match[2]]);
    } else {
      match = match.replace(match[1], getOppositeSymbol[match[1]]);
    }
    return str.replace(timeRegex, match);
  }

  getTranslation(string, filteredMatches) {
    let translatedString = string;
    const KEYS = Object.keys(filteredMatches);
    for (let i = 0; i < KEYS.length; i++) {
      let regex = new RegExp(KEYS[i], "i");
      translatedString = translatedString.replaceKeepCase(
        regex,
        filteredMatches[KEYS[i]]
      );
    }
    if (this.hasHourAndMinute(translatedString))
      translatedString = this.replaceTimeSymbol(translatedString);
    return translatedString;
  }

  filterOutWorstMatches(object, worstMatchesArray) {
    let result = object;
    for (let i = 0; i < worstMatchesArray.length; i++) {
      delete result[worstMatchesArray[i]];
    }
    return result;
  }

  invertObject(object) {
    let result = {};
    for (let key in object) {
      result[object[key]] = key;
    }
    return result;
  }

  getAmericanToBritishMatches(string) {
    return [
      ...this.getMatches(AMERICAN_ONLY, string),
      ...this.getMatches(AMERICAN_TO_BRITISH_SPELLING, string),
      ...this.getMatches(AMERICAN_TO_BRITISH_TITLES, string),
    ];
  }

  getBritishToAmericanMatches(string) {
    return [
      ...this.getMatches(BRITISH_ONLY, string),
      ...this.getMatches(
        this.invertObject(AMERICAN_TO_BRITISH_SPELLING),
        string
      ),
      ...this.getMatches(this.invertObject(AMERICAN_TO_BRITISH_TITLES), string),
    ];
  }

  getTranslatedWords(originalString, translatedString) {
    let wordsArr = [],
      oriStringArr = originalString.split(" "),
      traStringArr = translatedString.split(" ");
    for (let i = 0; i < traStringArr.length; i++) {
      if (!oriStringArr.includes(traStringArr[i])) {
        wordsArr.push(traStringArr[i]);
      }
    }
    return wordsArr;
  }
  getHighlightedTranslatedString(translatedString, originalString) {
    let translatedWordsArr = this.getTranslatedWords(
        originalString,
        translatedString
      ),
      tranStringArr = translatedString.split(" ");
    let result = [];
    for (let i = 0; i < translatedWordsArr.length; i++) {
      for (let j = 0; j < tranStringArr.length; j++) {
        if (translatedWordsArr[i] === tranStringArr[j]) {
          result.push(`<span class="highlight">${tranStringArr[j]}</span>`);
        } else {
          result.push(tranStringArr[j]);
        }
      }
    }
    return result.join(" ");
  }

  americanToBritish(string) {
    let matches = this.getAmericanToBritishMatches(string),
      filteredMatchObject;
    if (matches.length == 0) {
      if (this.hasHourAndMinute(string)) return this.replaceTimeSymbol(string);
      return string;
    }
    let doubleMatched = this.extractDoubleMatchedKeys(...matches);
    let translatedString = this.getTranslation(string, ...matches);
    if (doubleMatched.length !== 0) {
      let worstMatches = this.getWorstMatches(doubleMatched);
      filteredMatchObject = this.filterOutWorstMatches(
        ...matches,
        worstMatches
      );
      translatedString = this.getTranslation(string, filteredMatchObject);
    }
    if (this.hasHourAndMinute(translatedString))
      return this.replaceTimeSymbol(translatedString);
    return translatedString;
  }

  britishToAmerican(string) {
    let matches = this.getBritishToAmericanMatches(string),
      filteredMatchObject;
    if (matches.length == 0) {
      if (this.hasHourAndMinute(string)) return this.replaceTimeSymbol(string);
      return string;
    }
    let doubleMatched = this.extractDoubleMatchedKeys(...matches);
    let translatedString = this.getTranslation(string, ...matches);
    if (doubleMatched.length !== 0) {
      let worstMatches = this.getWorstMatches(doubleMatched);
      filteredMatchObject = this.filterOutWorstMatches(
        ...matches,
        worstMatches
      );
      translatedString = this.getTranslation(string, filteredMatchObject);
    }
    if (this.hasHourAndMinute(translatedString))
      return this.replaceTimeSymbol(translatedString);
    return translatedString;
  }
}

module.exports = Translator;
