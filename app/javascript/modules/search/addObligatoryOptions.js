const obligatoryOptions = [
    'relevance',
    'title',
    'random',
];

export default function addObligatoryOptions(options) {
    return obligatoryOptions.concat(options);
}
