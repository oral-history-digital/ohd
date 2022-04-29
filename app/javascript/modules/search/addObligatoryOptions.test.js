import addObligatoryOptions from './addObligatoryOptions';

test('adds options not configurable by metadata fields', () => {
    const options = [
        'archive_id',
        'duration',
    ];

    const actual = addObligatoryOptions(false, options);
    const expected = [
        'title',
        'archive_id',
        'duration',
        'random',
    ];
    expect(actual).toEqual(expected);
});

test('optionally adds relevance', () => {
    const options = [
        'archive_id',
        'duration',
    ];

    const actual = addObligatoryOptions(true, options);
    const expected = [
        'relevance',
        'title',
        'archive_id',
        'duration',
        'random',
    ];
    expect(actual).toEqual(expected);
});
