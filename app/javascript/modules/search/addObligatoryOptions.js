const withoutRelevance = [
    'title',
    'random',
];

const withRelevance = [
    'relevance',
    'title',
    'random',
];

export default function addObligatoryOptions(includeRelevance, options) {
    if (includeRelevance) {
        return withRelevance.concat(options);
    } else {
        return withoutRelevance.concat(options);
    }
}
