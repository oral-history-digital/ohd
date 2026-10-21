/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProject, useProjectIdentity } from 'modules/routes';
import { useSelector } from 'react-redux';

import AdminTabPanel from '../../sidebar/components/AdminTabPanel';
import RolesCell from '../../users/RolesCell';
import TasksCell from '../../users/TasksCell';
import { PaginatedAdminRecordList } from '../components';
import StatisticsAdminPage from './StatisticsAdminPage';
import CollectionsAdminPage from './collections/CollectionsAdminPage';
import ContributionTypesAdminPage from './contribution-types/ContributionTypesAdminPage';
import RegistryNameTypesAdminPage from './registry/RegistryNameTypesAdminPage';
import RegistryReferenceTypesAdminPage from './registry/RegistryReferenceTypesAdminPage';
import RolesAdminPage from './roles/RolesAdminPage';
import TaskTypesAdminPage from './task-types/TaskTypesAdminPage';

jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    useProjectIdentity: jest.fn(),
    usePathBase: () => '/pilot/de',
}));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('modules/data', () => ({
    getTaskTypesForCurrentProject: jest.fn(),
    getTaskTypesStatus: jest.fn(),
    getCollectionsForCurrentProject: jest.fn(),
    getCollectionsStatus: jest.fn(),
    getContributionTypesForCurrentProject: jest.fn(),
    getContributionTypesStatus: jest.fn(),
    getRegistryNameTypesForCurrentProject: jest.fn(),
    getRegistryNameTypesStatus: jest.fn(),
    getRegistryReferenceTypesForCurrentProject: jest.fn(),
    getRegistryReferenceTypesStatus: jest.fn(),
    getRolesForCurrentProject: jest.fn(),
    getRolesStatus: jest.fn(),
    getCurrentUser: jest.fn(),
}));
jest.mock('modules/archive', () => ({ getCountryKeys: jest.fn() }));
jest.mock('modules/search', () => ({
    getTaskTypesQuery: jest.fn(),
    getCollectionsQuery: jest.fn(),
    getContributionTypesQuery: jest.fn(),
    getRegistryNameTypesQuery: jest.fn(),
    getRegistryReferenceTypesQuery: jest.fn(),
    getRolesQuery: jest.fn(),
}));
jest.mock('../hooks', () => ({ useAdminDataActions: () => ({}) }));
jest.mock('../components', () => ({
    PaginatedAdminRecordList: jest.fn(() => <p>Resource list</p>),
}));
jest.mock('./roles/RolePermissions', () => () => null);
jest.mock('./task-types/TaskTypePermissions', () => () => null);
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'de', t: (key) => key }),
}));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('modules/roles', () => ({
    UserRoles: ({ userRoles }) => (
        <p>{userRoles.map((role) => role.id).join(',')}</p>
    ),
}));
jest.mock('modules/workflow', () => ({
    TasksContainer: ({ data }) => (
        <p>{data.map((task) => task.id).join(',')}</p>
    ),
}));
jest.mock('modules/auth', () => ({
    AuthShowContainer: ({ hasProjectAccess, children }) =>
        hasProjectAccess ? children : null,
    AuthorizedContent: ({ children }) => children,
    useAuthorization: () => ({ isAuthorized: () => true }),
}));
jest.mock('modules/react-toolbox', () => ({
    ErrorBoundary: ({ children }) => children,
}));
jest.mock(
    '../../sidebar/components/AdminSubTab',
    () =>
        ({ children }) =>
            children
);

beforeEach(() => {
    jest.clearAllMocks();
    useProjectIdentity.mockReturnValue({ projectDbId: 7 });
    useProject.mockReturnValue({
        project: { id: 7, root_registry_entry_id: 30 },
    });
    useSelector.mockReturnValue({});
});

test.each([
    TaskTypesAdminPage,
    CollectionsAdminPage,
    ContributionTypesAdminPage,
    RolesAdminPage,
    RegistryNameTypesAdminPage,
])(
    'resource list uses project identity for its scope and creation defaults (%p)',
    (Page) => {
        useProjectIdentity.mockReturnValue({});
        const { rerender } = render(<Page />);
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(PaginatedAdminRecordList).not.toHaveBeenCalled();
        useProjectIdentity.mockReturnValue({ projectDbId: 7 });
        rerender(<Page />);
        expect(PaginatedAdminRecordList.mock.lastCall[0]).toMatchObject({
            outerScopeId: 7,
            initialFormValues: { project_id: 7 },
        });
        expect(useProject).not.toHaveBeenCalled();
    }
);

test('collection query stays scoped to the current project', () => {
    useSelector.mockReturnValue({ page: 2, for_projects: 99 });
    render(<CollectionsAdminPage />);
    expect(PaginatedAdminRecordList.mock.lastCall[0].query).toMatchObject({
        page: 2,
        for_projects: 7,
    });
});

test('registry reference types reject the configured root for both string and numeric input', () => {
    const { rerender } = render(<RegistryReferenceTypesAdminPage />);
    expect(useProject).toHaveBeenCalledWith({
        include: ['registry_configuration'],
    });
    const validate =
        PaginatedAdminRecordList.mock.lastCall[0].formElements[0].validate;
    expect(validate('30')).toBe(false);
    expect(validate(30)).toBe(false);
    expect(validate('31')).toBe(true);
    useProject.mockReturnValue({
        project: { id: 7 },
        error: { message: 'Denied' },
    });
    rerender(<RegistryReferenceTypesAdminPage />);
    expect(screen.getByRole('alert')).toHaveTextContent('Denied');
    expect(screen.queryByText('Resource list')).not.toBeInTheDocument();
});

test.each([
    [RolesCell, 'user_roles'],
    [TasksCell, 'tasks'],
])(
    'user assignment cells exclude other projects and wait for identity (%p)',
    (Cell, field) => {
        const row = {
            original: {
                id: 4,
                [field]: {
                    a: { id: 11, project_id: 7 },
                    b: { id: 22, project_id: 9 },
                },
            },
        };
        const { rerender } = render(
            <Cell row={row} getValue={() => '/users'} />
        );
        expect(screen.getByText('11')).toBeInTheDocument();
        expect(screen.queryByText('22')).not.toBeInTheDocument();
        useProjectIdentity.mockReturnValue({ projectDbId: 9 });
        rerender(<Cell row={row} getValue={() => '/users'} />);
        expect(screen.getByText('22')).toBeInTheDocument();
        expect(screen.queryByText('11')).not.toBeInTheDocument();
        useProjectIdentity.mockReturnValue({});
        rerender(<Cell row={row} getValue={() => '/users'} />);
        expect(screen.queryByText('11')).not.toBeInTheDocument();
    }
);

test.each([StatisticsAdminPage, AdminTabPanel])(
    'newsletter links follow successfully loaded display settings (%p)',
    (Page) => {
        useProject.mockReturnValue({ project: { has_newsletter: true } });
        const { rerender } = render(<Page />);
        expect(useProject).toHaveBeenCalledWith({});
        expect(
            screen.getByRole('link', { name: /download_newsletter_recipients/ })
        ).toHaveAttribute('href', '/pilot/de/users/newsletter_recipients.csv');
        useProject.mockReturnValue({
            project: { has_newsletter: true },
            error: { message: 'Denied' },
        });
        rerender(<Page />);
        expect(
            screen.queryByRole('link', {
                name: /download_newsletter_recipients/,
            })
        ).not.toBeInTheDocument();
    }
);
