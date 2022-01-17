import transformIntoMarkers from './transformIntoMarkers';

const colorMap = new Map();
colorMap.set(4, 'blue');
colorMap.set(14, 'red');

test('transforms registry location data into markers for map component', () => {
    const locations = [
        {
            id: 18220,
            lat: '52.21',
            lon: '21.03',
            name: 'Deutschland',
            ref_types: '4,4,4,4,4',
        },
        {
            id: 18221,
            lat: '53.66',
            lon: '23.81',
            name: 'Berlin',
            ref_types: 'S,S,S,4,14',
        },
    ];

    const actual = transformIntoMarkers(colorMap, locations);
    const expected = [
        {
            id: 18220,
            lat: 52.21,
            long: 21.03,
            name: 'Deutschland',
            numReferences: 5,
            radius: 8,
            color: 'blue',
        },
        {
            id: 18221,
            lat: 53.66,
            long: 23.81,
            name: 'Berlin',
            numReferences: 5,
            radius: 8,
            color: 'black',
        },
    ];
    expect(actual).toEqual(expected);
});

test('throws when lat lon data is empty', () => {
    const locations = [
        {
            id: 18221,
            lat: '',
            lon: '',
            name: 'Berlin',
            ref_types: 'S,S,S,4,14',
        },
    ];

    expect(() => {
        transformIntoMarkers(colorMap, locations);
    }).toThrow(ReferenceError);
});
