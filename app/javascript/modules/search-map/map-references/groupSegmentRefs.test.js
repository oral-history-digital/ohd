import groupSegmentRefs from './groupSegmentRefs';

test('groups segment refs by interview id', () => {
    const segmentRefs = [
        {
            id: 52929,
            archive_id: 'za368',
            last_name: 'Henderson',
            first_name: 'Alice',
        },
        {
            id: 52930,
            archive_id: 'za368',
            last_name: 'Henderson',
            first_name: 'Alice',
        },
        {
            id: 53110,
            archive_id: 'za512',
            last_name: 'Henderson',
            first_name: 'Bob',
        },
    ];

    const actual = groupSegmentRefs(segmentRefs);
    const expected = [
        {
            archive_id: 'za368',
            last_name: 'Henderson',
            first_name: 'Alice',
            refs: [
                {
                    id: 52929,
                    archive_id: 'za368',
                    last_name: 'Henderson',
                    first_name: 'Alice',
                },
                {
                    id: 52930,
                    archive_id: 'za368',
                    last_name: 'Henderson',
                    first_name: 'Alice',
                },
            ],
        },
        {
            archive_id: 'za512',
            last_name: 'Henderson',
            first_name: 'Bob',
            refs: [
                {
                    id: 53110,
                    archive_id: 'za512',
                    last_name: 'Henderson',
                    first_name: 'Bob',
                }
            ]
        }
    ];

    expect(actual).toEqual(expected);
});
