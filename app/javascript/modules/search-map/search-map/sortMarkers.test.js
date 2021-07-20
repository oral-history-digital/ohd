import sortMarkers from './sortMarkers';

test('sorts markers according to number of references', () => {
    const markers = [
        {
            id: 1,
            numReferences: 5,
        },
        {
            id: 2,
            numReferences: 1,
        },
        {
            id: 3,
            numReferences: 23,
        },
    ];

    const actual = sortMarkers(markers);
    const expected = [
        {
            id: 3,
            numReferences: 23,
        },
        {
            id: 1,
            numReferences: 5,
        },
        {
            id: 2,
            numReferences: 1,
        },
    ];

    expect(actual).toEqual(expected);
});
