import filterByPossibleOptions from './filterByPossibleOptions';

test('filters by options that are actually sortable', () => {
    const options = ['archive_id', 'duration', 'typology'];

    const actual = filterByPossibleOptions(options);
    const expected = ['archive_id', 'duration'];
    expect(actual).toEqual(expected);
});
