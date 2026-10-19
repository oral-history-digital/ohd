/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';
import { getCurrentUser, useProjectDetail } from 'modules/data';

import UserProjectInterviewPermissions from './UserProjectInterviewPermissions';
import UserProjectRoles from './UserProjectRoles';
import UserProjects from './UserProjects';
import UserTasks from './UserTasks';

jest.mock('modules/data', () => ({
    getCurrentProject: () => ({ id: 7 }),
    getCurrentUser: jest.fn(),
    useProjectDetail: jest.fn(),
    ProjectShow: jest.requireActual('../../data/components/ProjectShow')
        .ProjectShow,
}));
jest.mock('react-redux', () => ({
    useSelector: (selector) => selector(),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({
    LinkOrA: ({ project, children }) => (
        <a href={`/${project.shortname}/en`}>{children}</a>
    ),
}));
jest.mock('modules/forms', () => ({
    ContentField: ({ label }) => <p>{label}</p>,
}));
jest.mock('./UserProjectRoles', () => jest.fn(() => null));
jest.mock('./UserProjectInterviewPermissions', () => jest.fn(() => null));
jest.mock('./UserTasks', () => jest.fn(() => null));

beforeEach(() => {
    jest.clearAllMocks();
    getCurrentUser.mockReturnValue({
        user_projects: {
            2: {
                id: 2,
                project_id: 8,
                workflow_state: 'project_access_requested',
            },
            3: {
                id: 3,
                project_id: 7,
                workflow_state: 'project_access_granted',
            },
        },
        user_roles: { 4: { id: 4, project_id: 7 } },
        interview_permissions: { 5: { id: 5, project_id: 7 } },
        tasks: { 6: { id: 6, project_id: 7 } },
    });
    useProjectDetail.mockImplementation((id) => ({
        project: {
            id,
            shortname: `project${id}`,
            name: id === 7 ? 'Current project' : 'Other project',
        },
    }));
});

test('shows the current project first and passes its grouped access details to the expanded row', () => {
    render(<UserProjects />);
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(
        ['Current project', 'Other project']
    );
    expect(screen.getByRole('link', { name: 'Other project' })).toHaveAttribute(
        'href',
        '/project8/en'
    );
    expect(useProjectDetail).toHaveBeenCalledWith(7);
    expect(useProjectDetail).toHaveBeenCalledWith(8);
    expect(screen.getByText(/project_access_requested/)).toBeInTheDocument();
    expect(screen.getByText(/project_access_granted/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(UserProjectRoles.mock.lastCall[0].roles).toEqual([
        { id: 4, project_id: 7 },
    ]);
    expect(UserProjectInterviewPermissions.mock.lastCall[0]).toMatchObject({
        project: { id: 7 },
        interviewPermissions: [{ id: 5, project_id: 7 }],
    });
    expect(UserTasks.mock.lastCall[0].tasks).toEqual([
        { id: 6, project_id: 7 },
    ]);
});

test('keeps unavailable projects hidden and displays them when the hook supplies data', () => {
    useProjectDetail.mockReturnValue({ project: undefined });
    const { rerender } = render(<UserProjects />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    useProjectDetail.mockImplementation((id) => ({
        project:
            id === 7
                ? { id, shortname: 'project7', name: 'Localized project name' }
                : undefined,
    }));
    rerender(<UserProjects />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(
        screen.getByRole('link', { name: 'Localized project name' })
    ).toHaveAttribute('href', '/project7/en');
    expect(
        screen.queryByText(/project_access_requested/)
    ).not.toBeInTheDocument();
});
