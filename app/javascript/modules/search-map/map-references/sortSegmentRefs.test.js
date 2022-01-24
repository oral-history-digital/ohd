import sortSegmentRefs from './sortSegmentRefs';

test('sort individual refs by tape and time', () => {
    const refGroups = [
        {
            archive_id: 'za001',
            refs: [
                {
                    id: 52929,
                    tape: 3,
                    time: 100,
                },
                {
                    id: 52930,
                    tape: 2,
                    time: 222,
                },
                {
                    id: 52931,
                    tape: 1,
                    time: 512,
                },
                {
                    id: 52932,
                    tape: 1,
                    time: 430,
                },
            ],
        },
    ];

    const actual = sortSegmentRefs(refGroups);
    const expected = [
        {
            archive_id: 'za001',
            refs: [
                {
                    id: 52932,
                    tape: 1,
                    time: 430,
                },
                {
                    id: 52931,
                    tape: 1,
                    time: 512,
                },
                {
                    id: 52930,
                    tape: 2,
                    time: 222,
                },
                {
                    id: 52929,
                    tape: 3,
                    time: 100,
                },
            ],
        },
    ];

    expect(actual).toEqual(expected);
});
