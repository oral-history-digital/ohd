import addChildProjects from './addChildProjects';

test('adds projects for each institution', () => {
    const projects = {
        1: {
            id: 1,
            shortname: 'zwar',
        },
        2: {
            id: 2,
            shortname: 'cdoh',
        },
    };

    const institution = {
        id: 1,
        shortname: 'FU',
        institution_projects: {
            1: {
                id: 1,
                institution_id: 1,
                project_id: 1,
            },
        },
    };

    const actual = addChildProjects(projects, institution);
    const expected = {
        id: 1,
        shortname: 'FU',
        institution_projects: {
            1: {
                id: 1,
                institution_id: 1,
                project_id: 1,
            },
        },
        projects: [{
            id: 1,
            shortname: 'zwar',
        }],
    };

    expect(actual).toEqual(expected);
});
