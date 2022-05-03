export default function defaultSortOptions(defaultSearchOrder) {
    if (defaultSearchOrder === 'random') {
        return {
            sort: 'random',
            order: undefined,
        };
    } else {
        return {
            sort: 'title',
            order: 'asc',
        };
    }
}
