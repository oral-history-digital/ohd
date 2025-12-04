import addObligatoryOptions from './addObligatoryOptions';

test('adds options not configurable by metadata fields', () => {
    const options = ['archive_id', 'duration'];

    const actual = addObligatoryOptions(false, options);
    const expected = ['title', 'archive_id', 'duration', 'random'];
    expect(actual).toEqual(expected);
});

test('optionally adds score', () => {
    const options = ['archive_id', 'duration'];

    const actual = addObligatoryOptions(true, options);
    const expected = ['score', 'title', 'archive_id', 'duration', 'random'];
    expect(actual).toEqual(expected);
});
