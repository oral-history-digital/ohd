/* eslint-disable react/prop-types */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { fetchTranslationsForLocale, setLocale } from 'modules/archive';
import { useAuthorization } from 'modules/auth';
import { useProject } from 'modules/routes';
import { getIsLoggedIn, submitLogout } from 'modules/user';
import { MemoryRouter, useLocation } from 'react-router-dom';

import ArchiveSearchTabPanel from './ArchiveSearchTabPanel';
import CurrentArchive from './CurrentArchive';
import IndexingTabPanel from './IndexingTabPanel';
import LocaleButtons from './LocaleButtons';
import SessionButtons from './SessionButtons';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => selector(),
}));
jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    useProjectIdentity: () => ({ projectShortname: 'pilot' }),
    usePathBase: () => '/pilot/en',
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/constants', () => ({
    ALPHA2_TO_ALPHA3: { en: 'eng', de: 'deu' },
    SYSTEM_LOCALES: ['en', 'de'],
    OHD_DOMAINS: { test: 'https://portal.test' },
}));
jest.mock('modules/archive', () => ({
    getArchiveId: () => 'pilot001',
    getSelectedArchiveIds: () => [],
    fetchTranslationsForLocale: jest.fn(() => ({ type: 'translations' })),
    setLocale: jest.fn((locale) => ({ type: 'locale', locale })),
}));
jest.mock('modules/user', () => ({
    getIsLoggedIn: jest.fn(),
    submitLogout: jest.fn(() => ({ type: 'logout' })),
}));
jest.mock('modules/data', () => ({
    getProjectResources: () => ({}),
    getProjectIdentities: () => ({}),
    clearStateData: jest.fn(() => ({ type: 'clear' })),
}));
jest.mock('modules/auth', () => ({
    useAuthorization: jest.fn(),
    AuthorizedContent: ({ children }) => children,
}));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('modules/spinners', () => ({ Spinner: () => <span>Loading</span> }));
jest.mock('modules/react-toolbox', () => ({
    ErrorBoundary: ({ children }) => children,
}));
jest.mock('modules/help-text', () => ({
    HelpText: ({ code }) => <p>{code}</p>,
}));
jest.mock('modules/search', () => ({
    ArchiveSearchFormContainer: () => <p>Search form</p>,
}));
jest.mock('modules/admin', () => ({
    CollectionsSearchForm: () => null,
    ContributionTypesSearchForm: () => null,
    LanguagesSearchForm: () => null,
    RegistryNameTypesSearchForm: () => null,
    RegistryReferenceTypesSearchForm: () => null,
}));
jest.mock(
    './AdminActions',
    () =>
        function Actions() {
            return null;
        }
);
jest.mock(
    './SubTab',
    () =>
        function SubTab({ title, children }) {
            return (
                <section>
                    {title}
                    {children}
                </section>
            );
        }
);
jest.mock(
    './AdminSubTab',
    () =>
        function AdminSubTab({ title, url }) {
            return <a href={url}>{title}</a>;
        }
);

beforeEach(() => {
    jest.clearAllMocks();
    globalThis.railsMode = 'test';
    useProject.mockReturnValue({
        project: {
            name: 'Project name',
            display_name: 'Display name',
            shortname: 'pilot',
            available_locales: ['en', 'de'],
            is_umbrella: false,
        },
    });
    useAuthorization.mockReturnValue({ isAuthorized: () => true });
    getIsLoggedIn.mockReturnValue(false);
});

test.each([
    CurrentArchive,
    LocaleButtons,
    IndexingTabPanel,
    ArchiveSearchTabPanel,
])(
    '%p waits for project data and hides retained controls on error',
    (Component) => {
        useProject.mockReturnValue({ isLoading: true });
        const { rerender } = render(
            <MemoryRouter>
                <Component />
            </MemoryRouter>
        );
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(useProject).toHaveBeenCalledWith();
        useProject.mockReturnValue({
            project: { display_name: 'Retained name' },
            error: { message: 'Access denied' },
        });
        rerender(
            <MemoryRouter>
                <Component />
            </MemoryRouter>
        );
        expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    }
);

test('links the localized display name to the project homepage, falling back to name', () => {
    const { rerender } = render(
        <MemoryRouter>
            <CurrentArchive />
        </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Display name' })).toHaveAttribute(
        'href',
        '/pilot/en'
    );
    useProject.mockReturnValue({ project: { name: 'Project name' } });
    rerender(
        <MemoryRouter>
            <CurrentArchive />
        </MemoryRouter>
    );
    expect(
        screen.getByRole('link', { name: 'Project name' })
    ).toBeInTheDocument();
});

test.each([
    '/pilot/en/interviews/pilot001?q=term',
    '/en/interviews/pilot001?q=term',
])(
    'locale switch from %s waits for translations and preserves route and query',
    async (initialPath) => {
        let finishTranslations;
        mockDispatch.mockReturnValueOnce(
            new Promise((resolve) => {
                finishTranslations = resolve;
            })
        );
        function Location() {
            const location = useLocation();
            return <p>{location.pathname + location.search}</p>;
        }
        render(
            <MemoryRouter initialEntries={[initialPath]}>
                <LocaleButtons />
                <Location />
            </MemoryRouter>
        );
        expect(screen.getByRole('button', { name: 'eng' })).toBeDisabled();
        fireEvent.click(screen.getByRole('button', { name: 'deu' }));
        expect(screen.getByText(initialPath)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /deu/ })).toBeDisabled();
        const expectedPrefix = initialPath.startsWith('/pilot/')
            ? '/pilot/de'
            : '/de';
        expect(fetchTranslationsForLocale).toHaveBeenCalledWith(
            'de',
            expectedPrefix
        );
        await act(async () => {
            finishTranslations();
        });
        expect(
            screen.getByText(`${expectedPrefix}/interviews/pilot001?q=term`)
        ).toBeInTheDocument();
        expect(setLocale).toHaveBeenCalledWith('de');
    }
);

test('indexing keeps project-only links out of the umbrella and respects edit permission', () => {
    const { rerender } = render(
        <MemoryRouter>
            <IndexingTabPanel />
        </MemoryRouter>
    );
    expect(
        screen.getByRole('link', { name: 'edit.interview.new' })
    ).toHaveAttribute('href', '/pilot/en/interviews/new');
    useProject.mockReturnValue({ project: { is_umbrella: true } });
    rerender(
        <MemoryRouter>
            <IndexingTabPanel />
        </MemoryRouter>
    );
    expect(
        screen.queryByRole('link', { name: 'edit.interview.new' })
    ).not.toBeInTheDocument();
    expect(
        screen.getByRole('link', { name: 'edit.upload.upload' })
    ).toBeInTheDocument();
    useAuthorization.mockReturnValue({ isAuthorized: () => false });
    rerender(
        <MemoryRouter>
            <IndexingTabPanel />
        </MemoryRouter>
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
});

test('search panel uses the project role for its title and help', () => {
    const { rerender } = render(
        <MemoryRouter>
            <ArchiveSearchTabPanel />
        </MemoryRouter>
    );
    expect(screen.getByRole('heading')).toHaveTextContent('archive_search');
    expect(screen.getByText('archive_search_page')).toBeInTheDocument();
    useProject.mockReturnValue({ project: { is_umbrella: true } });
    rerender(
        <MemoryRouter>
            <ArchiveSearchTabPanel />
        </MemoryRouter>
    );
    expect(screen.getByRole('heading')).toHaveTextContent(
        'modules.sidebar.search'
    );
    expect(screen.getByText('search_page')).toBeInTheDocument();
});

test('session links use the project shortname and retain public-project logout', () => {
    const { rerender } = render(
        <MemoryRouter>
            <SessionButtons />
        </MemoryRouter>
    );
    expect(
        new URL(screen.getByTestId('login-link').href).searchParams.get(
            'project'
        )
    ).toBe('pilot');
    expect(screen.getByTestId('register-link')).toHaveAttribute(
        'href',
        '/pilot/en/register'
    );
    getIsLoggedIn.mockReturnValue(true);
    rerender(
        <MemoryRouter>
            <SessionButtons />
        </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'account_page' })).toHaveAttribute(
        'href',
        '/pilot/en/users/current'
    );
    fireEvent.click(screen.getByRole('button', { name: 'logout' }));
    expect(submitLogout).toHaveBeenCalledWith('/pilot/en/users/sign_out');
    expect(mockDispatch).toHaveBeenLastCalledWith({ type: 'logout' });
});

test('unshared-project logout supplies navigation after server success', () => {
    getIsLoggedIn.mockReturnValue(true);
    useProject.mockReturnValue({ project: { workflow_state: 'unshared' } });
    render(
        <MemoryRouter>
            <SessionButtons />
        </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'logout' }));
    expect(submitLogout).toHaveBeenCalledWith(
        '/pilot/en/users/sign_out',
        expect.any(Function)
    );
});
