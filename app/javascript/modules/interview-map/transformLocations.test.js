import transformLocations from './transformLocations';

test('getInterviewMapMarkers gets locations transformed into markers', () => {
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

    const actual = transformLocations(locations);
    const expected = [
        {
            id: 18220,
            lat: 52.21,
            long: 21.03,
            name: 'Deutschland',
            numReferences: 1,
            radius: 7.5,
            color: 'red',
        },
        {
            id: 18221,
            lat: 53.66,
            long: 23.81,
            name: 'Berlin',
            numReferences: 5,
            radius: 7.5,
            color: 'red',
        },
    ];
    expect(actual).toEqual(expected);
});
