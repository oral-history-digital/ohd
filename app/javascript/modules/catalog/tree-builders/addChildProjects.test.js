import addChildProjects from './addChildProjects';

test('adds projects for each institution', () => {
    const projects = {
        1: {
            id: 1,
            shortname: 'zwar',
            workflow_state: 'public'
        },
        2: {
            id: 2,
            shortname: 'cdoh',
            workflow_state: 'public'
        },
        3: {
            id: 3,
            shortname: 'test',
            workflow_state: 'unshared'
        }
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
            2: {
                id: 2,
                institution_id: 1,
                project_id: 3,
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
            2: {
                id: 2,
                institution_id: 1,
                project_id: 3,
            },
        },
        projects: [{
            id: 1,
            shortname: 'zwar',
            workflow_state: 'public'
        }],
    };

    expect(actual).toEqual(expected);
});
