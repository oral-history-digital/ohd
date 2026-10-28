import { renderHook } from '@testing-library/react';
import { useProject } from 'modules/routes';

import { useAuthorization } from './authorization-hook';

const mockUser = {
    admin: false,
    tasks: {},
    supervised_tasks: {},
    interview_permissions: {},
    user_roles: {
        1: {
            project_id: 7,
            role_permissions: {
                1: { klass: 'Interview', action_name: 'update' },
            },
        },
    },
};
jest.mock('modules/data', () => ({ getCurrentUser: () => mockUser }));
jest.mock('modules/archive', () => ({ getEditView: () => true }));
jest.mock('react-redux', () => ({ useSelector: (select) => select({}) }));
jest.mock('modules/routes', () => ({ useProject: jest.fn() }));

test('permissions wait for current project details and remain scoped to that project', () => {
    const interview = { id: 3, type: 'Interview', project_id: 7 };
    useProject.mockReturnValue({ isLoading: true });
    const { result, rerender } = renderHook(useAuthorization);
    expect(result.current.isAuthorized(interview, 'update')).toBe(false);
    useProject.mockReturnValue({ project: { id: 7 } });
    rerender();
    expect(result.current.isAuthorized(interview, 'update')).toBe(true);
    expect(
        result.current.isAuthorized({ ...interview, project_id: 8 }, 'update')
    ).toBe(false);
    useProject.mockReturnValue({ project: { id: 8 } });
    rerender();
    expect(result.current.isAuthorized(interview, 'update')).toBe(false);
    useProject.mockReturnValue({
        project: { id: 7 },
        error: { message: 'Access denied' },
    });
    rerender();
    expect(result.current.isAuthorized(interview, 'update')).toBe(false);
    expect(useProject).toHaveBeenCalledWith({});
});
