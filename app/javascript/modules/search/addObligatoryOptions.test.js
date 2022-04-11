import addObligatoryOptions from './addObligatoryOptions';

test('adds options not configurable by metadata fields', () => {
    const options = [
        'archive_id',
        'duration',
    ];

    const actual = addObligatoryOptions(options);
    const expected = [
        'relevance',
        'title',
        'archive_id',
        'duration',
    ];
    expect(actual).toEqual(expected);
});
