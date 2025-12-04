const possibleOptions = [
    'archive_id',
    'duration',
    'language',
    'language_id',
    'media_type',
    'collection_id',
];

export default function filterByPossibleOptions(options) {
    return options.filter((option) => possibleOptions.includes(option));
}
