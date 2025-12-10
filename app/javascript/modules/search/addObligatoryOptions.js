const prependWithoutScore = ['title'];

const prependWithScore = ['score', 'title'];

export default function addObligatoryOptions(includeScore, options) {
    let combinedOptions;
    if (includeScore) {
        combinedOptions = prependWithScore.concat(options);
    } else {
        combinedOptions = prependWithoutScore.concat(options);
    }

    return combinedOptions.concat('random');
}
