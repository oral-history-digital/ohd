import addChildInterviews from './addChildInterviews';

test('adds interviews to a collection', () => {
    const collection = {
        id: 1,
    };

    const interviews = [
        {
            id: 1,
            collection_id: 1,
        },
        {
            id: 2,
            collection_id: 45,
        },
        {
            id: 3,
            collection_id: 1,
        },
    ];

    const actual = addChildInterviews(interviews, collection);
    const expected = {
        id: 1,
        interviews: [
            {
                id: 1,
                collection_id: 1,
            },
            {
                id: 3,
                collection_id: 1,
            },
        ],
    };

    expect(actual).toEqual(expected);
});
