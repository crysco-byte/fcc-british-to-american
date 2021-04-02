const chai = require("chai");
const assert = chai.assert;

const Translator = require("../components/translator.js"),
  translate = new Translator();

suite("Unit Tests", () => {
  test("Translate Mangoes are my favorite fruit. to British English", (done) => {
    assert.equal(
      translate.americanToBritish("Mangoes are my favorite fruit."),
      "Mangoes are my favourite fruit."
    );
    done();
  });

  test("Translate I ate yogurt for breakfast. to British English", (done) => {
    assert.equal(
      translate.americanToBritish("I ate yogurt for breakfast."),
      "I ate yoghurt for breakfast."
    );
    done();
  });

  test("Translate We had a party at my friend's condo. to British English", (done) => {
    assert.equal(
      translate.americanToBritish("We had a party at my friend's condo."),
      "We had a party at my friend's flat."
    );
    done();
  });

  test("Translate Can you toss this in the trashcan for me? to British English", (done) => {
    assert.equal(
      translate.americanToBritish("Can you toss this in the trashcan for me?"),
      "Can you toss this in the bin for me?"
    );
    done();
  });

  test("Translate The parking lot was full. to British English", (done) => {
    assert.equal(
      translate.americanToBritish("The parking lot was full."),
      "The car park was full."
    );
    done();
  });

  test("Translate To play hooky means to skip class or work. to British English", (done) => {
    assert.equal(
      translate.americanToBritish("To play hooky means to skip class or work."),
      "To bunk off means to skip class or work."
    );
    done();
  });

  test("Translate No Mr. Bond, I expect you to die. to British English", (done) => {
    assert.equal(
      translate.americanToBritish("No Mr. Bond, I expect you to die."),
      "No Mr Bond, I expect you to die."
    );

    done();
  });

  test("Translate Dr. Grosh will see you now. to British English", (done) => {
    assert.equal(
      translate.americanToBritish("Dr. Grosh will see you now."),
      "Dr Grosh will see you now."
    );
    done();
  });

  test("Translate Lunch is at 12:15 today. to British English", (done) => {
    assert.equal(
      translate.americanToBritish("Lunch is at 12:15 today."),
      "Lunch is at 12.15 today."
    );
    done();
  });

  test("Translate We watched the footie match for a while. to American", (done) => {
    assert.equal(
      translate.britishToAmerican("We watched the footie match for a while."),
      "We watched the soccer match for a while."
    );
    done();
  });

  test("Translate Paracetamol takes up to an hour to work. to American English", (done) => {
    assert.equal(
      translate.britishToAmerican("Paracetamol takes up to an hour to work."),
      "Tylenol takes up to an hour to work."
    );
    done();
  });

  test("Translate First, caramelise the onions. to American English", (done) => {
    assert.equal(
      translate.britishToAmerican("First, caramelise the onions."),
      "First, caramelize the onions."
    );
    done();
  });

  test("Translate I spent the bank holiday at the funfair. to American English", (done) => {
    assert.equal(
      translate.britishToAmerican("I spent the bank holiday at the funfair."),
      "I spent the public holiday at the carnival."
    );
    done();
  });

  test("Translate I had a bicky then went to the chippy. to American English", (done) => {
    assert.equal(
      translate.britishToAmerican("I had a bicky then went to the chippy."),
      "I had a cookie then went to the fish-and-chip shop."
    );
    done();
  });

  test("Translate I've just got bits and bobs in my bum bag. to American English", (done) => {
    assert.equal(
      translate.britishToAmerican("I've just got bits and bobs in my bum bag."),
      "I've just got odds and ends in my fanny pack."
    );
    done();
  });

  test("Translate The car boot sale at Boxted Airfield was called off. to American English", (done) => {
    assert.equal(
      translate.britishToAmerican(
        "The car boot sale at Boxted Airfield was called off."
      ),
      "The swap meet at Boxted Airfield was called off."
    );
    done();
  });

  test("Translate Have you met Mrs Kalyani? to American English", (done) => {
    assert.equal(
      translate.britishToAmerican("Have you met Mrs Kalyani?"),
      "Have you met Mrs. Kalyani?"
    );
    done();
  });

  test("Translate Prof Joyner of King's College, London. to American English", (done) => {
    assert.equal(
      translate.britishToAmerican("Prof Joyner of King's College, London."),
      "Prof. Joyner of King's College, London."
    );
    done();
  });

  test("Translate Tea time is usually around 4 or 4.30. to American English", (done) => {
    assert.equal(
      translate.britishToAmerican("Tea time is usually around 4 or 4.30."),
      "Tea time is usually around 4 or 4:30."
    );
    done();
  });

  test("Highlight translation in Mangoes are my favorite fruit.", (done) => {
    let originalString = "Mangoes are my favorite fruit.";
    let translatedString = translate.americanToBritish(originalString);
    let highlightedString = translate.getHighlightedTranslatedString(
      translatedString,
      originalString
    );
    assert.equal(
      translate.getHighlightedTranslatedString(
        translatedString,
        originalString
      ),
      'Mangoes are my <span class="highlight">favourite</span> fruit.'
    );
    done();
  });

  test("Highlight translation in I ate yogurt for breakfast.", (done) => {
    let originalString = "I ate yogurt for breakfast.";
    let translatedString = "I ate yoghurt for breakfast.";
    let highlightedString =
      'I ate <span class="highlight">yoghurt</span> for breakfast.';
    assert.equal(
      translate.getHighlightedTranslatedString(
        translatedString,
        originalString
      ),
      highlightedString
    );
    done();
  });

  test("Highlight translation in Paracetamol takes up to an hour to work.", (done) => {
    let originalString = "Paracetamol takes up to an hour to work.";
    let translatedString = "Tylenol takes up to an hour to work.";
    let highlightedString =
      '<span class="highlight">Tylenol</span> takes up to an hour to work.';
    assert.equal(
      translate.getHighlightedTranslatedString(
        translatedString,
        originalString
      ),
      highlightedString
    );
    done();
  });
});
