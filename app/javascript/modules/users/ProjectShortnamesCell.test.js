import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';

import ProjectShortnamesCell from './ProjectShortnamesCell';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('modules/data', () => ({ getProjects: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
}));

test('hides only the configured umbrella, keeping an archive named ohd', () => {
    useSelector.mockReturnValue({
        1: { shortname: 'shared', is_umbrella: true },
        2: { shortname: 'ohd', is_umbrella: false },
    });
    render(
        <ProjectShortnamesCell
            row={{
                original: {
                    user_roles: {},
                    user_projects: {
                        1: {
                            id: 1,
                            project_id: 1,
                            workflow_state: 'project_access_granted',
                        },
                        2: {
                            id: 2,
                            project_id: 2,
                            workflow_state: 'project_access_granted',
                        },
                    },
                },
            }}
        />
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('listitem')).toHaveTextContent('ohd -');
    expect(screen.queryByText(/shared/)).not.toBeInTheDocument();
});
