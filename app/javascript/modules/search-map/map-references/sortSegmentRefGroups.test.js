import sortSegmentRefGroups from './sortSegmentRefGroups';

test('sorts segment ref groups by last and then first name', () => {
    const refGroups = [
        {
            archive_id: 'za512',
            last_name: 'Henderson',
            first_name: 'Bob',
        },
        {
            archive_id: 'za367',
            last_name: 'Turner',
            first_name: 'Peter',
        },
        {
            archive_id: 'za368',
            last_name: 'Henderson',
            first_name: 'Alice',
        },
    ];

    const actual = sortSegmentRefGroups(refGroups);
    const expected = [
        {
            archive_id: 'za368',
            last_name: 'Henderson',
            first_name: 'Alice',
        },
        {
            archive_id: 'za512',
            last_name: 'Henderson',
            first_name: 'Bob',
        },
        {
            archive_id: 'za367',
            last_name: 'Turner',
            first_name: 'Peter',
        },
    ];

    expect(actual).toEqual(expected);
});
