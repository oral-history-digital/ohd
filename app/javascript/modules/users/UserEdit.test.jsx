/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProjectIdentity } from 'modules/routes';

import ProjectsOverview from './ProjectsOverview';
import UserEdit from './UserEdit';
import UserFormContainer from './UserFormContainer';

jest.mock('modules/routes', () => ({ useProjectIdentity: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));
jest.mock('./UserFormContainer', () => jest.fn(() => <p>User editor</p>));
jest.mock('./ProjectsOverview', () => jest.fn(() => <p>Project overview</p>));

const user = {
    id: 4,
    first_name: 'Test user',
    user_projects: {
        10: { id: 10, project_id: 9, organization: 'Other project' },
        11: { id: 11, project_id: 7, organization: 'Current project' },
    },
};

beforeEach(() => jest.clearAllMocks());

test('waits for identity and passes only the current project access record to the existing form', () => {
    useProjectIdentity.mockReturnValue({});
    const onSubmit = jest.fn();
    const { rerender } = render(
        <UserEdit data={user} dataPath="/users.json" onSubmit={onSubmit} />
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(UserFormContainer).not.toHaveBeenCalled();
    useProjectIdentity.mockReturnValue({ projectDbId: 7, isUmbrella: false });
    rerender(
        <UserEdit data={user} dataPath="/users.json" onSubmit={onSubmit} />
    );
    expect(screen.getByText('Current project')).toBeInTheDocument();
    expect(screen.queryByText('Other project')).not.toBeInTheDocument();
    expect(UserFormContainer.mock.lastCall[0]).toMatchObject({
        data: user.user_projects[11],
        scope: 'user_project',
        userId: 4,
        dataPath: '/users.json',
        onSubmit,
    });
    expect(ProjectsOverview).not.toHaveBeenCalled();
});

test('umbrella administration edits the account and shows its project overview', () => {
    useProjectIdentity.mockReturnValue({ projectDbId: 1, isUmbrella: true });
    render(<UserEdit data={user} dataPath="/users.json" />);
    expect(ProjectsOverview.mock.lastCall[0].user).toBe(user);
    expect(UserFormContainer.mock.lastCall[0]).toMatchObject({
        data: user,
        scope: 'user',
    });
});

test('missing current-project access cannot open an editor for another project', () => {
    useProjectIdentity.mockReturnValue({ projectDbId: 8, isUmbrella: false });
    render(<UserEdit data={user} dataPath="/users.json" />);
    expect(screen.getByText('Test user')).toBeInTheDocument();
    expect(UserFormContainer).not.toHaveBeenCalled();
    expect(screen.queryByText('Other project')).not.toBeInTheDocument();
});
