/* eslint-disable react/prop-types */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { submitDataWithFetch, useDataApi } from 'modules/api';
import {
    fetchData,
    getRolesForCurrentProject,
    getRolesStatus,
    useMutateData,
    useMutateDatum,
} from 'modules/data';
import { Form } from 'modules/forms';
import { usePathBase, useProjectIdentity } from 'modules/routes';
import { useDispatch, useSelector } from 'react-redux';

import UserRole from './UserRole';
import UserRoleForm from './UserRoleForm';

jest.mock('modules/api', () => ({
    submitDataWithFetch: jest.fn(),
    useDataApi: jest.fn(),
}));
jest.mock('modules/data', () => ({
    fetchData: jest.fn(() => ({ type: 'FETCH_ROLES' })),
    getRolesForCurrentProject: jest.fn(),
    getRolesStatus: jest.fn(),
    useMutateData: jest.fn(),
    useMutateDatum: jest.fn(),
}));
jest.mock('modules/forms', () => ({ Form: jest.fn(() => <p>Role form</p>) }));
jest.mock('modules/routes', () => ({
    usePathBase: jest.fn(),
    useProjectIdentity: jest.fn(),
}));
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));
jest.mock('modules/auth', () => ({
    useAuthorization: () => ({ isAuthorized: () => true }),
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));
jest.mock('modules/ui', () => ({
    Modal: ({ children }) =>
        typeof children === 'function' ? children(jest.fn()) : children,
}));

const roles = { 3: { id: 3, name: 'Editor' } };
const mockMutateData = jest.fn();
const mockMutateDatum = jest.fn();
const mockDeleteDatum = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(jest.fn());
    useProjectIdentity.mockReturnValue({ projectDbId: 7 });
    usePathBase.mockReturnValue('/pilot/de');
    useSelector.mockImplementation((select) =>
        select === getRolesForCurrentProject ? roles : {}
    );
    useMutateData.mockReturnValue(mockMutateData);
    useMutateDatum.mockReturnValue(mockMutateDatum);
    useDataApi.mockReturnValue({ deleteDatum: mockDeleteDatum });
});

test('role choices wait for identity, request once per route, and use the new project after navigation', () => {
    useProjectIdentity.mockReturnValue({});
    const { rerender } = render(
        <UserRoleForm userId={4} onSubmit={jest.fn()} />
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(fetchData).not.toHaveBeenCalled();
    useProjectIdentity.mockReturnValue({ projectDbId: 7 });
    rerender(<UserRoleForm userId={4} onSubmit={jest.fn()} />);
    expect(fetchData).toHaveBeenLastCalledWith(
        { pathBase: '/pilot/de' },
        'roles',
        null,
        null,
        'for_projects=7'
    );
    rerender(<UserRoleForm userId={4} onSubmit={jest.fn()} />);
    expect(fetchData).toHaveBeenCalledTimes(1);
    useProjectIdentity.mockReturnValue({ projectDbId: 9 });
    usePathBase.mockReturnValue('/other/en');
    rerender(<UserRoleForm userId={4} onSubmit={jest.fn()} />);
    expect(fetchData).toHaveBeenLastCalledWith(
        { pathBase: '/other/en' },
        'roles',
        null,
        null,
        'for_projects=9'
    );
});

test('already fetched project role choices are reused', () => {
    useSelector.mockImplementation((select) =>
        select === getRolesStatus ? { for_projects_7: 'fetched' } : roles
    );
    render(<UserRoleForm userId={4} onSubmit={jest.fn()} />);
    expect(fetchData).not.toHaveBeenCalled();
    expect(Form.mock.lastCall[0]).toMatchObject({
        values: { user_id: 4 },
        elements: [{ values: roles }],
    });
});

test('assignment saves keep the current route and update the existing user list cache', async () => {
    const onSubmit = jest.fn();
    render(
        <UserRoleForm
            userId={4}
            dataPath="/pilot/de/users.json?page=2"
            onSubmit={onSubmit}
        />
    );
    const updated = { id: 4, user_roles: [{ id: 8 }] };
    submitDataWithFetch.mockResolvedValue({ data: updated });
    const params = { user_role: { user_id: 4, role_id: 3 } };
    await act(async () => Form.mock.lastCall[0].onSubmit(params));
    const users = { data: [{ id: 2 }, { id: 4 }] };
    const result = await mockMutateData.mock.lastCall[0](users);
    expect(submitDataWithFetch).toHaveBeenCalledWith('/pilot/de', params);
    expect(useMutateData).toHaveBeenCalledWith(
        'users',
        '/pilot/de/users.json?page=2'
    );
    expect(result.data).toEqual([{ id: 2 }, updated]);
    expect(mockMutateDatum).toHaveBeenCalledWith(4, 'users');
    expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('role deletion works without injected project records and retains user cache updates', async () => {
    mockDeleteDatum.mockResolvedValue({ data: { id: 4, user_roles: [] } });
    render(
        <UserRole
            userRole={{ id: 8, name: 'Editor' }}
            userId={4}
            dataPath="/users.json"
        />
    );
    fireEvent.click(screen.getByRole('button', { name: 'delete' }));
    const result = await mockMutateData.mock.lastCall[0]({
        data: [{ id: 4 }, { id: 2 }],
    });
    expect(mockDeleteDatum).toHaveBeenCalledWith(8, 'user_roles');
    expect(result.data).toEqual([{ id: 4, user_roles: [] }, { id: 2 }]);
    expect(mockMutateDatum).toHaveBeenCalledWith(4, 'users');
});
