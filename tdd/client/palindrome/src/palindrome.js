var isPalindrome = function(phrase) {
  if(phrase === undefined) {
    throw new Error('Invalid argument');
  }
  phrase = phrase.trim();
  return phrase.length > 0 && phrase.split('').reverse().join('') === phrase;
}
