const prependWithoutRelevance = [
    'title',
];

const prependWithRelevance = [
    'relevance',
    'title',
];

export default function addObligatoryOptions(includeRelevance, options) {
    let combinedOptions;
    if (includeRelevance) {
        combinedOptions = prependWithRelevance.concat(options);
    } else {
        combinedOptions = prependWithoutRelevance.concat(options);
    }

    return combinedOptions.concat('random');
}
