import sortInterviewRefs from './sortInterviewRefs';

test('sorts individual refs by last name and then first name', () => {
    const refGroups = [
        {
            references: [
                {
                    last_name: 'Sanders',
                    first_name: 'George',
                },
                {
                    last_name: 'Henderson',
                    first_name: 'Bob',
                },
                {
                    last_name: 'Henderson',
                    first_name: 'Alice',
                },
            ],
        },
    ];

    const actual = sortInterviewRefs(refGroups);
    const expected = [
        {
            references: [
                {
                    last_name: 'Henderson',
                    first_name: 'Alice',
                },
                {
                    last_name: 'Henderson',
                    first_name: 'Bob',
                },
                {
                    last_name: 'Sanders',
                    first_name: 'George',
                },
            ],
        },
    ];

    expect(actual).toEqual(expected);
});
