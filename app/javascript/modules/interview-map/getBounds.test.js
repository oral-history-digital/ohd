import getBounds from './getBounds';

test('gets bounds of all locations', () => {
    const locations = [
        {
            lat: '40.71',
            lon: '-74.01',
        },
        {
            lat: '52.52',
            lon: '13.04',
        },
        {
            lat: '51.51',
            lon: '0.0',
        },
        {
            lat: '31.78',
            lon: '35.21',
        },
    ];

    const actual = getBounds(locations);
    const expected = [
        [52.52, -74.01],
        [31.78, 35.21],
    ];
    expect(actual).toEqual(expected);
});

test('gets bounds of one location', () => {
    const locations = [
        {
            lat: '40.71',
            lon: '-74.01',
        },
    ];

    const actual = getBounds(locations);
    const expected = [
        [40.71, -74.01],
        [40.71, -74.01],
    ];
    expect(actual).toEqual(expected);
});

test('returns null if no locations are present', () => {
    const locations = [];
    const actual = getBounds(locations);
    expect(actual).toBeNull();
});
