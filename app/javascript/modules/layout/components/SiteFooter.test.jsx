import { render, screen } from '@testing-library/react';
import { useProject } from 'modules/routes';
import { useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import ProjectFooter from './ProjectFooter';
import SiteFooter from './SiteFooter';

let mockLocale = 'en';

jest.mock('modules/constants', () => ({
    GITHUB_URL: 'https://github.com/example/ohd',
    OHD_DOMAINS: { test: 'https://portal.example' },
}));
jest.mock('modules/data', () => ({
    useUmbrellaProject: () => ({
        project: jest.requireMock('react-redux').useSelector(),
    }),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: mockLocale, t: (key) => key }),
}));
jest.mock('modules/routes', () => ({
    usePathBase: () => `/archive/${mockLocale}`,
    useProject: jest.fn(),
}));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('./ProjectFooter', () => jest.fn(() => null));

beforeAll(() => {
    globalThis.railsMode = 'test';
    globalThis.VERSION = '1.0.0';
});

/** @returns {Object} Rendered footer with router context. */
function renderFooter() {
    return render(
        <MemoryRouter>
            <SiteFooter />
        </MemoryRouter>
    );
}

const project = {
    id: 7,
    shortname: 'ohd',
    is_umbrella: false,
    grant_project_access_instantly: false,
    grant_access_without_login: false,
    name: 'Archive',
    external_links: [],
    sponsor_logos: [],
};

beforeEach(() => {
    jest.clearAllMocks();
    mockLocale = 'en';
    useSelector.mockReturnValue({
        shortname: 'portal',
        display_shortname: 'Portal',
        is_umbrella: true,
    });
    useProject.mockReturnValue({ projectShortname: 'ohd', project });
});

test('uses configured umbrella display shortname for global conditions', () => {
    useSelector.mockReturnValue({
        shortname: 'portal',
        display_shortname: 'Portal',
        is_umbrella: true,
    });

    renderFooter();

    expect(
        screen.getByRole('link', { name: 'conditions (Portal)' })
    ).toHaveAttribute('href', 'https://portal.example/en/conditions');
    expect(
        screen.getByRole('link', { name: 'conditions (ohd)' })
    ).toHaveAttribute('href', '/archive/en/conditions');
});

test('falls back to umbrella shortname when display shortname is blank', () => {
    useSelector.mockReturnValue({
        shortname: 'portal',
        display_shortname: null,
        is_umbrella: true,
    });

    renderFooter();

    expect(
        screen.getByRole('link', { name: 'conditions (portal)' })
    ).toBeInTheDocument();
});

test('keeps global navigation visible while project footer data loads or is denied', () => {
    useProject.mockReturnValue({ projectShortname: 'ohd', isLoading: true });
    const { rerender } = renderFooter();
    expect(useProject).toHaveBeenCalledWith({ include: ['footer'] });
    expect(
        screen.getByRole('link', { name: 'privacy_protection' })
    ).toHaveAttribute('href', 'https://portal.example/en/privacy_protection');
    expect(screen.getByRole('link', { name: 'contact' })).toHaveAttribute(
        'href',
        '/archive/en/contact'
    );
    expect(screen.getByRole('link', { name: /oh.d v/ })).toBeInTheDocument();
    expect(screen.queryByText('Archive')).not.toBeInTheDocument();
    expect(
        screen.queryByRole('link', { name: 'conditions (ohd)' })
    ).not.toBeInTheDocument();
    useProject.mockReturnValue({
        projectShortname: 'ohd',
        error: { status: 403, message: 'Denied' },
    });
    rerender(
        <MemoryRouter>
            <SiteFooter />
        </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'contact' })).toBeInTheDocument();
    expect(screen.queryByText('Archive')).not.toBeInTheDocument();
});

test('uses localized footer arrays and image URLs and updates them after language changes and refresh', () => {
    const english = {
        ...project,
        external_links: [
            {
                id: 12,
                name: 'English partner',
                url: 'https://partner.example/en',
            },
        ],
        sponsor_logos: [
            {
                id: 20,
                locale: 'en',
                href: 'https://sponsor.example',
                title: 'Sponsor EN',
                url: '/sponsor-en.png',
            },
        ],
    };
    useProject.mockReturnValue({ projectShortname: 'ohd', project: english });
    const { rerender } = renderFooter();
    expect(
        screen.getByRole('link', { name: 'English partner' })
    ).toHaveAttribute('href', 'https://partner.example/en');
    expect(
        screen.getByRole('link', { name: 'Sponsor EN' }).querySelector('img')
    ).toHaveAttribute('src', '/sponsor-en.png');
    expect(ProjectFooter.mock.lastCall[0]).toMatchObject({
        project: english,
        locale: 'en',
    });
    mockLocale = 'de';
    useProject.mockReturnValue({ projectShortname: 'ohd', isLoading: true });
    rerender(
        <MemoryRouter>
            <SiteFooter />
        </MemoryRouter>
    );
    expect(
        screen.queryByRole('link', { name: 'English partner' })
    ).not.toBeInTheDocument();
    expect(
        screen.queryByRole('link', { name: 'Sponsor EN' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'contact' })).toHaveAttribute(
        'href',
        '/archive/de/contact'
    );
    const german = {
        ...project,
        name: 'Archiv DE',
        external_links: [
            {
                id: 12,
                name: 'Deutscher Partner',
                url: 'https://partner.example/de',
            },
        ],
        sponsor_logos: [
            {
                id: 21,
                locale: 'de',
                href: 'https://sponsor.example',
                title: 'Sponsor DE',
                url: '/sponsor-de.png',
            },
        ],
    };
    useProject.mockReturnValue({
        projectShortname: 'ohd',
        project: german,
        isValidating: true,
    });
    rerender(
        <MemoryRouter>
            <SiteFooter />
        </MemoryRouter>
    );
    expect(screen.getByText('Archiv DE')).toBeInTheDocument();
    expect(
        screen.getByRole('link', { name: 'Deutscher Partner' })
    ).toHaveAttribute('href', 'https://partner.example/de');
    expect(
        screen.getByRole('link', { name: 'Sponsor DE' }).querySelector('img')
    ).toHaveAttribute('src', '/sponsor-de.png');
    useProject.mockReturnValue({
        projectShortname: 'ohd',
        project: { ...german, external_links: [], sponsor_logos: [] },
    });
    rerender(
        <MemoryRouter>
            <SiteFooter />
        </MemoryRouter>
    );
    expect(
        screen.queryByRole('link', { name: 'Deutscher Partner' })
    ).not.toBeInTheDocument();
    expect(
        screen.queryByRole('link', { name: 'Sponsor DE' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'contact' })).toBeInTheDocument();
});
