import mergeLocations from './mergeLocations';

test('merges segment and interview locations which are just concatenated on the server', () => {
    const locations = [
        {
            id: 18220,
            lat: '52.21',
            lon: '21.03',
            name: 'Deutschland',
            ref_types: 'Segment',
        },
        {
            id: 18221,
            lat: '53.66',
            lon: '23.81',
            name: 'Berlin',
            ref_types: 'Segment,Segment,Segment',
        },
        {
            id: 18221,
            lat: '53.66',
            lon: '23.81',
            name: 'Berlin',
            ref_types: '4,14',
        },
    ];

    const actual = mergeLocations(locations);
    const expected = [
        {
            id: 18220,
            lat: '52.21',
            lon: '21.03',
            name: 'Deutschland',
            ref_types: 'Segment',
        },
        {
            id: 18221,
            lat: '53.66',
            lon: '23.81',
            name: 'Berlin',
            ref_types: 'Segment,Segment,Segment,4,14',
        },
    ];
    expect(actual).toEqual(expected);
});
