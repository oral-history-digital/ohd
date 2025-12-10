export default function pluralize(word) {
    // TODO: fit this to all upcase words like PERSON
    // or be aware that you have to upcase later!
    //
    let pluralizedWord;
    if (word.toLowerCase() === 'person') pluralizedWord = word[0] + 'eople';
    else if (word[word.length - 1] === 'y')
        pluralizedWord = word.slice(0, -1) + 'ies';
    else if (/atum$/.test(word)) pluralizedWord = word.slice(0, -2) + 'a';
    else pluralizedWord = word + 's';

    return pluralizedWord;
}
