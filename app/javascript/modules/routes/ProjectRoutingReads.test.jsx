/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import {
    clearViewModes,
    setArchiveId,
    setAvailableViewModes,
    setViewMode,
} from 'modules/archive';

import { getIsRedirectingAfterLogout as mockGetIsRedirectingAfterLogout } from '../user/selectors';
import ProjectRoutes from './ProjectRoutes';
import RouteDivider from './RouteDivider';
import useProject from './useProject';

let mockViewMode;
const mockDispatch = jest.fn();
jest.mock('./useProject', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) =>
        selector === mockGetIsRedirectingAfterLogout ? false : mockViewMode,
}));
jest.mock('modules/archive', () => ({
    getViewMode: jest.fn(),
    setAvailableViewModes: jest.fn((modes) => ({ type: 'AVAILABLE', modes })),
    setViewMode: jest.fn((mode) => ({ type: 'MODE', mode })),
    clearViewModes: jest.fn(() => ({ type: 'CLEAR' })),
    setArchiveId: jest.fn((id) => ({ type: 'INTERVIEW', id })),
}));
jest.mock('modules/admin', () =>
    Object.fromEntries(
        [
            'CollectionsAdminPage',
            'ContributionTypesAdminPage',
            'EditInterviewPage',
            'EditProjectAccessPage',
            'EditProjectConfigPage',
            'EditProjectDisplayPage',
            'EditProjectInfoPage',
            'EventTypesAdminPage',
            'InstanceSettingsAdminPage',
            'LanguagesAdminPage',
            'MetadataFieldsAdminPage',
            'PeopleAdminPage',
            'PermissionsAdminPage',
            'RegistryNameTypesAdminPage',
            'RegistryReferenceTypesAdminPage',
            'RolesAdminPage',
            'StatisticsAdminPage',
            'TaskTypesAdminPage',
            'TranslationValuesAdminPage',
            'UploadsPage',
            'UsersAdminPage',
        ].map((name) => [name, () => null])
    )
);
jest.mock('modules/interview', () => ({ InterviewContainer: () => null }));
jest.mock('modules/layout', () => ({
    Layout: ({ children }) => children,
    TextPage: () => null,
}));
jest.mock('modules/analytics', () => ({
    AnalyticsProvider: ({ children }) => children,
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/react-toolbox', () => ({
    ErrorBoundary: ({ children }) => children,
}));
jest.mock('modules/registry', () => ({ RegistryContainer: () => null }));
jest.mock('modules/search', () => ({ SearchPage: () => null }));
jest.mock('modules/search-map', () => ({ SearchMap: () => null }));
jest.mock('modules/user', () => ({
    AccountPage: () => null,
    ActivateAccount: () => null,
    OrderNewPasswordContainer: () => null,
    RegisterPage: () => null,
}));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('react-router-dom', () => ({
    Routes: () => <p>Project routes</p>,
    Route: () => null,
}));
jest.mock('./Routes', () => ({
    MemoizedRoutesWithProjectId: () => <p>Prefixed routes</p>,
    MemoizedRoutesWithoutProjectId: () => <p>Locale routes</p>,
}));

beforeEach(() => {
    jest.clearAllMocks();
    mockViewMode = 'workflow';
});

test.each([
    [{ is_umbrella: true }, 'Locale routes'],
    [
        { is_umbrella: false, archive_domain: 'https://project.example' },
        'Locale routes',
    ],
    [{ is_umbrella: false, archive_domain: null }, 'Prefixed routes'],
])(
    'route selection follows the loaded project domain settings (%p)',
    (project, routeLabel) => {
        useProject.mockReturnValue({ project });
        render(<RouteDivider />);
        expect(useProject).toHaveBeenCalledWith();
        expect(screen.getByText(routeLabel)).toBeInTheDocument();
    }
);

test('routes wait for settings and show errors without falling back to a different route tree', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<RouteDivider />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Prefixed routes')).not.toBeInTheDocument();
    useProject.mockReturnValue({ error: { message: 'Denied' } });
    rerender(<RouteDivider />);
    expect(screen.getByRole('alert')).toHaveTextContent('Denied');
});

test('view modes initialize after loading, preserve valid selections on refresh, and reset for a different project', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender, unmount } = render(<ProjectRoutes />);
    expect(setViewMode).not.toHaveBeenCalled();
    useProject.mockReturnValue({
        project: { id: 7, view_modes: ['grid', 'list'] },
    });
    rerender(<ProjectRoutes />);
    expect(setAvailableViewModes).toHaveBeenLastCalledWith(['grid', 'list']);
    expect(setViewMode).toHaveBeenLastCalledWith('grid');
    mockViewMode = 'list';
    useProject.mockReturnValue({
        project: { id: 7, view_modes: ['grid', 'list'] },
        isValidating: true,
    });
    rerender(<ProjectRoutes />);
    expect(setViewMode).toHaveBeenCalledTimes(1);
    useProject.mockReturnValue({ project: { id: 7, view_modes: ['grid'] } });
    rerender(<ProjectRoutes />);
    expect(setViewMode).toHaveBeenCalledTimes(2);
    mockViewMode = 'grid';
    useProject.mockReturnValue({ project: { id: 9, view_modes: ['list'] } });
    rerender(<ProjectRoutes />);
    expect(setViewMode).toHaveBeenLastCalledWith('list');
    expect(clearViewModes).toHaveBeenCalledTimes(1);
    expect(setArchiveId).toHaveBeenCalledWith(null);
    unmount();
    expect(clearViewModes).toHaveBeenCalledTimes(2);
});
