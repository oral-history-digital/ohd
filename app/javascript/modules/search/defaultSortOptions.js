export default function defaultSortOptions(defaultSearchOrder) {
    if (defaultSearchOrder === 'random') {
        return {
            sort: 'random',
            order: undefined,
        };
    } else if (defaultSearchOrder === 'archive_id') {
        return {
            sort: 'archive_id',
            order: 'asc',
        };
    } else {
        return {
            sort: 'title',
            order: 'asc',
        };
    }
}
