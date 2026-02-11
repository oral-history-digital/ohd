const possibleOptions = ['archive_id', 'duration', 'media_type'];

export default function filterByPossibleOptions(options) {
    return options.filter((option) => possibleOptions.includes(option));
}
