import buildInstitutionTree from './buildInstitutionTree';

test('builds tree from flat institution array', () => {
    const rootInstitutions = [
        {
            id: 1,
            shortname: 'FU',
            parent_id: null,
        },
        {
            id: 5,
            shortname: 'University of Hagen',
            parent_id: null,
        },
    ];

    const flatInstitutions = [
        {
            id: 1,
            shortname: 'FU',
            parent_id: null,
        },
        {
            id: 2,
            shortname: 'FU library',
            parent_id: 1,
        },
        {
            id: 3,
            shortname: 'Department of Computer Sciences',
            parent_id: 1,
        },
        {
            id: 4,
            shortname: 'Digital Interview Collections',
            parent_id: 2,
        },
        {
            id: 5,
            shortname: 'University of Hagen',
            parent_id: null,
        },
    ];

    const actual = buildInstitutionTree(rootInstitutions, flatInstitutions);
    const expected = [
        {
            id: 1,
            shortname: 'FU',
            children: [
                {
                    id: 2,
                    shortname: 'FU library',
                    children: [
                        {
                            id: 4,
                            shortname: 'Digital Interview Collections',
                            children: [],
                        },
                    ],
                },
                {
                    id: 3,
                    shortname: 'Department of Computer Sciences',
                    children: [],
                },
            ],
        },
        {
            id: 5,
            shortname: 'University of Hagen',
            children: [],
        },
    ];

    expect(actual).toEqual(expected);
});
