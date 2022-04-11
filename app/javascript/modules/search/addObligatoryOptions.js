const obligatoryOptions = [
    'relevance',
    'title',
];

export default function addObligatoryOptions(options) {
    return obligatoryOptions.concat(options);
}
