const possibleOptions = [
    'archive_id',
    'duration',
    'media_type',
    'collection_id',
];

export default function filterByPossibleOptions(options) {
    return options.filter((option) => possibleOptions.includes(option));
}
