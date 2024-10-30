import transformIntoMarkers from './transformIntoMarkers';

const colorMap = new Map();
colorMap.set('4', 'blue');
colorMap.set('14', 'red');

test('transforms registry location data into markers for map component', () => {
    const locations = [
        {
            id: 18220,
            lat: '52.21',
            lon: '21.03',
            agg_names: {
                de: 'Deutschland',
                en: 'Germany',
            },
            ref_types: '4,4,4,4,4',
        },
        {
            id: 18221,
            lat: '52.21',
            lon: '21.03',
            agg_names: {
                de: 'Deutschland',
                en: 'Germany',
            },
            ref_types: '4,4,4,4,4,S,S',
        },
        {
            id: 18222,
            lat: '53.66',
            lon: '23.81',
            agg_names: {
                de: 'Berlin',
                en: 'Berlin',
            },
            ref_types: 'S,S,S,4,14',
        },
    ];

    const actual = transformIntoMarkers(colorMap, locations);
    const expected = [
        {
            id: 18220,
            lat: 52.21,
            long: 21.03,
            agg_names: {
                de: 'Deutschland',
                en: 'Germany',
            },
            numReferences: 5,
            numMetadataReferences: 5,
            numSegmentReferences: 0,
            radius: 8,
            color: 'blue',
        },
        {
            id: 18221,
            lat: 52.21,
            long: 21.03,
            agg_names: {
                de: 'Deutschland',
                en: 'Germany',
            },
            numReferences: 7,
            numMetadataReferences: 5,
            numSegmentReferences: 2,
            radius: 8,
            color: 'blue',
        },
        {
            id: 18222,
            lat: 53.66,
            long: 23.81,
            agg_names: {
                de: 'Berlin',
                en: 'Berlin',
            },
            numReferences: 5,
            numMetadataReferences: 2,
            numSegmentReferences: 3,
            radius: 6.839903786706788,
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
            agg_names: {
                de: 'Berlin',
                en: 'Berlin',
            },
            ref_types: 'S,S,S,4,14',
        },
    ];

    expect(() => {
        transformIntoMarkers(colorMap, locations);
    }).toThrow(ReferenceError);
});
