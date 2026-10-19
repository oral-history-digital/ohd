/* eslint-disable react/prop-types */
import { fireEvent, render, screen, within } from '@testing-library/react';
import { getCurrentProject, useProjectList } from 'modules/data';
import { useSelector } from 'react-redux';

import UserTable from './UserTable';
import useUsers from './useUsers';

jest.mock('modules/data', () => ({
    getCurrentProject: jest.fn(),
    getCurrentUser: () => ({ admin: true }),
    getRolesForCurrentProject: () => [],
    Fetch: ({ children }) => children,
    useProjectList: jest.fn(),
}));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/forms', () => ({
    SelectField: jest.requireActual('../forms/components/input/SelectField')
        .default,
}));
jest.mock('../forms/hooks', () => ({
    useTouchFieldOnBlur: () => undefined,
}));
jest.mock('modules/tables', () => ({
    TableWithPagination: ({ children }) => <div>{children}</div>,
    DateCell: () => null,
}));
jest.mock('./ArchiveManagementInCell', () => () => null);
jest.mock('./MfaStatusCell', () => () => null);
jest.mock('./ProjectAccessGrantedCell', () => () => null);
jest.mock('./RolesCell', () => () => null);
jest.mock('./UserRowActions', () => () => null);
jest.mock('./UserRowInterviewPermissions', () => () => null);
jest.mock('./useUsers', () => jest.fn());

beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockImplementation((selector) => selector());
    getCurrentProject.mockReturnValue({
        id: 1,
        is_umbrella: true,
        available_locales: ['en'],
    });
    useProjectList.mockReturnValue({
        projects: [
            { id: 3, name: 'Zebra', workflow_state: 'public' },
            { id: 2, name: 'Alpha', workflow_state: 'unshared' },
        ],
    });
    useUsers.mockReturnValue({ data: { data: [], total: 0 } });
});

test('offers authorized projects alphabetically without restricting the list to public projects', () => {
    render(<UserTable />);

    expect(useProjectList).toHaveBeenCalledWith({ all: true });
    const select = screen.getByRole('combobox', {
        name: 'activerecord.models.project.one',
    });
    expect(
        within(select)
            .getAllByRole('option')
            .map((option) => option.textContent)
    ).toEqual(['choose', 'Alpha', 'Zebra']);

    fireEvent.change(select, { target: { value: '2' } });
    expect(useUsers.mock.lastCall[4]).toBe('2');
    fireEvent.change(select, { target: { value: '' } });
    expect(useUsers.mock.lastCall[4]).toBe('');
});

test('updates the project filter when the Redux list arrives', () => {
    useProjectList.mockReturnValue({ projects: [], isLoading: true });
    const { rerender } = render(<UserTable />);
    const select = screen.getByRole('combobox', {
        name: 'activerecord.models.project.one',
    });
    expect(within(select).getAllByRole('option')).toHaveLength(1);

    useProjectList.mockReturnValue({
        projects: [{ id: 2, name: 'Localized project name' }],
    });
    rerender(<UserTable />);
    expect(
        within(select).getByRole('option', { name: 'Localized project name' })
    ).toHaveValue('2');
});

test('shows the role filter instead of the project filter within a project', () => {
    getCurrentProject.mockReturnValue({
        id: 2,
        is_umbrella: false,
        available_locales: ['en'],
    });
    render(<UserTable />);
    expect(
        screen.queryByRole('combobox', {
            name: 'activerecord.models.project.one',
        })
    ).not.toBeInTheDocument();
    expect(
        screen.getByRole('combobox', { name: 'activerecord.models.role.one' })
    ).toBeInTheDocument();
});
