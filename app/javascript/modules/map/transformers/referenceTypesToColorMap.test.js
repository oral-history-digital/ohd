import referenceTypesToColorMap from './referenceTypesToColorMap';

test('builds a color map from a reference types array', () => {
    const referenceTypes = [
        {
            id: 1,
            color: 'blue',
        },
        {
            id: 2,
            color: 'red',
        },
        {
            id: 'S',
            color: 'yellow',
        },
    ];

    const actual = referenceTypesToColorMap(referenceTypes);

    const colorMap = new Map();
    colorMap.set('1', 'blue');
    colorMap.set('2', 'red');
    colorMap.set('S', 'yellow');
    const expected = colorMap;

    expect(actual).toEqual(expected);
});
