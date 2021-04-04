"use strict";

const Translator = require("../components/translator.js");

module.exports = function(app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    let originalString = req.body.text,
      locale = req.body.locale;

    const sendBritishToAmericanTranslation = () => {
      let translatedString = translator.britishToAmerican(originalString);
      let highlightedString = translator.getHighlightedTranslatedString(
        translatedString,
        originalString
      );
      if (originalString === translatedString)
        return res.send({
          text: originalString,
          translation: "Everything looks good to me!",
        });
      return res.send({
        text: originalString,
        translation: highlightedString
      });
    };

    const sendAmericanToBritishTranslation = () => {
      let translatedString = translator.americanToBritish(originalString);
      let highlightedString = translator.getHighlightedTranslatedString(
        translatedString,
        originalString
      );
      if (originalString === translatedString)
        return res.send({
          text: originalString,
          translation: "Everything looks good to me!",
        });
      return res.send({
        text: originalString,
        translation: highlightedString
      });
    };

    const getInvalidLocaleAndTextInputError = () => {
      if (originalString === '') return {
        error: 'No text to translate'
      };
      if (!locale | !originalString) return {
        error: 'Required field(s) missing'
      };
      if (locale !== 'american-to-british' && locale !== 'british-to-american') return {
        error: 'Invalid value for locale field'
      };
      return null
    };

    let error = getInvalidLocaleAndTextInputError();

    if (getInvalidLocaleAndTextInputError() == null) {
      if (locale === "american-to-british") {
        sendAmericanToBritishTranslation();
      } else if (locale === "british-to-american") {
        sendBritishToAmericanTranslation();
      }
    } else {
      return res.send(error);
    }
  });
};
