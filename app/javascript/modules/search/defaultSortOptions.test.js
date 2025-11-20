import defaultSortOptions from './defaultSortOptions';

test('returns random if project default is random', () => {
    const actual = defaultSortOptions('random');
    const expected = {
        sort: 'random',
        order: undefined,
    };

    expect(actual).toEqual(expected);
});

test('returns title and asc if project default is title', () => {
    const actual = defaultSortOptions('title');
    const expected = {
        sort: 'title',
        order: 'asc',
    };

    expect(actual).toEqual(expected);
});

test('returns archive_id and asc if project default is archive_id', () => {
    const actual = defaultSortOptions('archive_id');
    const expected = {
        sort: 'archive_id',
        order: 'asc',
    };

    expect(actual).toEqual(expected);
});

test('returns title and asc if there is no project default', () => {
    const actual = defaultSortOptions(undefined);
    const expected = {
        sort: 'title',
        order: 'asc',
    };

    expect(actual).toEqual(expected);
});
