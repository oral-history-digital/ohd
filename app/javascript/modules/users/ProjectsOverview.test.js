import { renderToStaticMarkup } from 'react-dom/server';

import ProjectsOverview from './ProjectsOverview';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        locale: 'en',
        t: (key) => key,
    }),
}));

const userProject = (
    id,
    shortname,
    name,
    workflowState = 'project_access_granted'
) => ({
    id,
    project_id: id,
    shortname,
    name,
    workflow_state: workflowState,
    updated_at: '2026-06-01',
});

describe('<ProjectsOverview />', () => {
    it('renders projects grouped by workflow state from user project payload', () => {
        const html = renderToStaticMarkup(
            <ProjectsOverview
                user={{
                    user_projects: {
                        1: userProject(1, 'ohd', 'Oral-History.Digital'),
                        2: userProject(2, 'test', 'Test Project'),
                        3: userProject(3, 'demo', 'Demo Project'),
                        4: userProject(
                            4,
                            'pending',
                            'Pending Project',
                            'project_access_requested'
                        ),
                        5: userProject(
                            5,
                            'blocked',
                            'Blocked Project',
                            'project_access_blocked'
                        ),
                    },
                }}
            />
        );

        // ProjectsOverview uses capitalizeFirstLetter, that's why we capitalize here, too
        expect(
            html.indexOf(
                'Workflow_states.user_projects.project_access_requested'
            )
        ).toBeLessThan(
            html.indexOf('Workflow_states.user_projects.project_access_granted')
        );
        expect(html.indexOf('Demo Project')).toBeLessThan(
            html.indexOf('Test Project')
        );
        expect(html).toContain('Pending Project');
        expect(html).toContain('Test Project');
        expect(html).toContain('Blocked Project');
        expect(html).toContain(
            'workflow_states.user_projects.project_access_blocked'
        );
        expect(html).not.toContain('Oral-History.Digital');
    });

    it('uses a disclosure for larger groups', () => {
        const projects = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].reduce(
            (memo, id) => {
                memo[id] = userProject(id, `p${id}`, `Project ${id}`);
                return memo;
            },
            {}
        );

        const html = renderToStaticMarkup(
            <ProjectsOverview user={{ user_projects: projects }} />
        );

        expect(html).toContain('Disclosure-toggle');
        expect(html).toContain('11 activerecord.models.project.other');
        expect(html.indexOf('Project 1')).toBeLessThan(
            html.indexOf('Project 11')
        );
        expect(html).toContain('Project 1');
        expect(html).toContain(
            'Workflow_states.user_projects.project_access_granted' // Capitalized because function capitalizes first letter
        );
    });
});
