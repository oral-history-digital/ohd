import addChildCollections from './addChildCollections';

test('adds sorted collections to a project', () => {
    const project = {
        id: 1,
        shortname: 'zwar',
        collection_ids: [1, 2, 3, 4],
    };

    const collections = [
        {
            id: 1,
            num_interviews: 5,
        },
        {
            id: 2,
            num_interviews: 3,
        },
        {
            id: 3,
            num_interviews: 0,
        },
    ];

    const actual = addChildCollections(collections, project);
    const expected = {
        id: 1,
        shortname: 'zwar',
        collection_ids: [1, 2, 3, 4],
        collections: [
            {
                id: 1,
                num_interviews: 5,
            },
            {
                id: 2,
                num_interviews: 3,
            },
        ],
    };

    expect(actual).toEqual(expected);
});

test('throws if collection_ids is undefined', () => {
    const project = {
        id: 1,
        shortname: 'zwar',
    };

    const collections = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
    ];

    expect(() => {
        addChildCollections(collections, project)
    }).toThrow(ReferenceError);
});
