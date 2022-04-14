const possibleOptions = [
    'archive_id',
    'duration',
    'language',
    'language_id',
    'media_type',
];

export default function filterByPossibleOptions(options) {
    return options.filter(option => possibleOptions.includes(option));
}
