import groupSegmentRefs from './groupSegmentRefs';

test('groups segment refs by interview id', () => {
    const segmentRefs = [
        {
            id: 52929,
            archive_id: 'za368',
            last_name: 'Henderson',
            first_name: 'Alice',
            display_name: 'Alice Henderson',
        },
        {
            id: 52930,
            archive_id: 'za368',
            last_name: 'Henderson',
            first_name: 'Alice',
            display_name: 'Alice Henderson',
        },
        {
            id: 53110,
            archive_id: 'za512',
            last_name: 'Henderson',
            first_name: 'Bob',
            display_name: 'Bob Henderson',
        },
    ];

    const actual = groupSegmentRefs(segmentRefs);
    const expected = [
        {
            archive_id: 'za368',
            last_name: 'Henderson',
            first_name: 'Alice',
            display_name: 'Alice Henderson',
            refs: [
                {
                    id: 52929,
                    archive_id: 'za368',
                    last_name: 'Henderson',
                    first_name: 'Alice',
                    display_name: 'Alice Henderson',
                },
                {
                    id: 52930,
                    archive_id: 'za368',
                    last_name: 'Henderson',
                    first_name: 'Alice',
                    display_name: 'Alice Henderson',
                },
            ],
        },
        {
            archive_id: 'za512',
            last_name: 'Henderson',
            first_name: 'Bob',
            display_name: 'Bob Henderson',
            refs: [
                {
                    id: 53110,
                    archive_id: 'za512',
                    last_name: 'Henderson',
                    first_name: 'Bob',
                    display_name: 'Bob Henderson',
                }
            ]
        }
    ];

    expect(actual).toEqual(expected);
});
