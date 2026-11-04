/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProject } from 'modules/routes';
import { Helmet } from 'react-helmet';

import Layout from './Layout';

jest.mock('modules/archive', () => ({
    getViewMode: () => 'grid',
    useIsEditor: () => false,
}));
jest.mock('modules/banner', () => ({ getBannerActive: () => false }));
jest.mock('modules/data', () => ({
    getProjectBrandName: () => 'Portal',
    useUmbrellaProject: () => ({ project: { name: 'Portal' } }),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
    useCheckLocaleAgainstProject: jest.fn(),
}));
jest.mock('modules/react-toolbox', () => ({
    ErrorBoundary: ({ children }) => children,
}));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    useCurrentPage: () => ({ pageType: 'site_startpage' }),
    useSyncLegacyProjectId: jest.fn(),
}));
jest.mock('modules/sidebar', () => ({
    Sidebar: () => null,
    getSidebarVisible: () => false,
}));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('modules/user', () => ({
    AfterConfirmationPopup: () => null,
    AfterEnable2FAPopup: () => null,
    AfterEnablePasskeyPopup: () => null,
    AfterRegisterPopup: () => null,
    AfterRequestProjectAccessPopup: () => null,
    ConfirmNewZwarTosPopup: () => null,
    CorrectUserDataPopup: () => null,
    getIsLoggedIn: () => false,
    getLoggedInAt: () => null,
    useFetchAccount: jest.fn(),
}));
jest.mock('modules/user-agent', () => ({
    ResizeWatcher: ({ children }) => children,
    isMobile: () => false,
    useScrollBelowThreshold: () => false,
}));
jest.mock('react-redux', () => ({
    useDispatch: () => jest.fn(),
    useSelector: (select) => select(),
}));
jest.mock('react-router-dom', () => ({
    useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));
jest.mock('react-helmet', () => ({ Helmet: jest.fn(() => null) }));
jest.mock('./components', () => ({
    BackToTopButton: () => null,
    BurgerButton: () => null,
    Messages: () => null,
    SiteFooter: () => null,
    SiteHeader: () => null,
}));

const project = {
    id: 7,
    shortname: 'pilot',
    name: 'Localized name',
    display_name: 'Display title',
    favicon_url: '/configured.ico',
};

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project, projectShortname: 'pilot' });
});

test('uses display details for the page title and favicon', () => {
    const { rerender } = render(<Layout>Page content</Layout>);
    expect(useProject).toHaveBeenCalledWith();
    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(Helmet.mock.lastCall[0].defaultTitle).toBe('Display title');
    expect(
        Helmet.mock.lastCall[0].children.find((child) => child.type === 'link')
            .props.href
    ).toBe('/configured.ico');
    useProject.mockReturnValue({
        project: {
            ...project,
            display_name: null,
            name: 'New locale name',
            favicon_url: '/new.ico',
        },
    });
    rerender(<Layout>Page content</Layout>);
    expect(Helmet.mock.lastCall[0].defaultTitle).toBe('New locale name');
    expect(
        Helmet.mock.lastCall[0].children.find((child) => child.type === 'link')
            .props.href
    ).toBe('/new.ico');
});

test('waits for display details before rendering the page', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<Layout>Page content</Layout>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Page content')).not.toBeInTheDocument();
    useProject.mockReturnValue({ project });
    rerender(<Layout>Page content</Layout>);
    expect(screen.getByText('Page content')).toBeInTheDocument();
});

test('shows request errors without rendering incomplete page content', () => {
    useProject.mockReturnValue({ error: { message: 'Request denied' } });
    render(<Layout>Page content</Layout>);
    expect(screen.getByRole('alert')).toHaveTextContent('Request denied');
    expect(screen.queryByText('Page content')).not.toBeInTheDocument();
});
