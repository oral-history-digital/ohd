/* eslint-disable react/prop-types */
import { fireEvent, render, screen } from '@testing-library/react';

import Task from './Task';

jest.mock('modules/routes', () => ({
    usePathBase: () => '/adg/en',
    useProjectIdentity: () => ({ projectDbId: 7 }),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/auth', () => ({
    AuthorizedContent: ({ children }) => children,
    useAuthorization: () => ({ isAuthorized: () => true }),
}));
jest.mock(
    './CommentsContainer',
    () =>
        function Comments() {
            return null;
        }
);

const task = {
    id: 3,
    user_id: 1,
    supervisor_id: 1,
    workflow_state: 'started',
    task_type: { name: { en: 'Transcript' } },
    workflow_states: ['started', 'finished'],
};

test('assignment choices remain project-scoped and save/reset through the current route', () => {
    const submitData = jest.fn();
    const users = [
        {
            id: 1,
            first_name: 'Current',
            last_name: 'Editor',
            user_roles: [{ name: 'Redaktion', project_id: 7 }],
        },
        {
            id: 2,
            first_name: 'Other',
            last_name: 'Editor',
            user_roles: [{ name: 'Redaktion', project_id: 8 }],
        },
    ];
    render(
        <Task
            task={task}
            interview={{ archive_id: 'adg001' }}
            users={users}
            submitData={submitData}
        />
    );
    expect(
        screen
            .getAllByRole('option')
            .some((option) => option.textContent.includes('Current'))
    ).toBe(true);
    expect(
        screen
            .getAllByRole('option')
            .some((option) => option.textContent.includes('Other'))
    ).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'submit' }));
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/adg/en' },
        { task: { id: 3, user_id: 1, supervisor_id: 1 } }
    );
    fireEvent.click(screen.getByRole('button', { name: 'reset' }));
    expect(submitData).toHaveBeenLastCalledWith(
        { pathBase: '/adg/en' },
        { task: { id: 3, workflow_state: 'reset' } }
    );
});
