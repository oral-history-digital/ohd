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

        expect(
            html.indexOf(
                'workflow_states.user_projects.project_access_requested'
            )
        ).toBeLessThan(
            html.indexOf('workflow_states.user_projects.project_access_granted')
        );
        expect(
            html.indexOf('workflow_states.user_projects.project_access_granted')
        ).toBeLessThan(html.indexOf('Other'));
        expect(html.indexOf('Demo Project (demo)')).toBeLessThan(
            html.indexOf('Test Project (test)')
        );
        expect(html).toContain('Pending Project (pending)');
        expect(html).toContain('Test Project (test)');
        expect(html).toContain('Blocked Project (blocked)');
        expect(html).toContain(
            'workflow_states.user_projects.project_access_blocked'
        );
        expect(html).not.toContain('Oral-History.Digital');
    });

    it('uses a disclosure for larger groups', () => {
        const projects = [1, 2, 3, 4, 5, 6].reduce((memo, id) => {
            memo[id] = userProject(id, `p${id}`, `Project ${id}`);
            return memo;
        }, {});

        const html = renderToStaticMarkup(
            <ProjectsOverview user={{ user_projects: projects }} />
        );

        expect(html).toContain('Disclosure-toggle');
        expect(html).toContain('6 activerecord.models.project.other');
        expect(html.indexOf('Project 1')).toBeLessThan(
            html.indexOf('Project 6')
        );
        expect(html).toContain('Project 1 (p1)');
        expect(html).toContain(
            'workflow_states.user_projects.project_access_granted'
        );
    });
});
