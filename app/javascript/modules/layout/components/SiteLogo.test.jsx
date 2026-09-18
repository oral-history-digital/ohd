import { render, screen } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import SiteLogo from './SiteLogo';

jest.mock('modules/archive', () => ({
    getProjectId: (state) => state.archive?.projectId,
    setProjectId: jest.fn(),
}));
jest.mock('modules/constants', () => ({
    OHD_DOMAINS: { test: 'https://portal.example' },
}));
jest.mock('modules/data', () => ({
    getCurrentUser: (state) => state.currentAccount,
    getProjectBrandName: (project, locale) => {
        const name = project?.name?.[locale] || project?.display_name?.[locale];

        if (!name) return null;

        return project.display_shortname
            ? `${name} (${project.display_shortname})`
            : name;
    },
    getUmbrellaProject: (state) => state.umbrellaProject,
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ locale: 'en' }) }));
jest.mock('modules/routes', () => ({
    useCurrentPage: () => ({ pageType: 'site_startpage' }),
    useProject: () => ({
        project: {
            archive_domain: 'https://archive.example',
            display_ohd_link: true,
        },
    }),
}));
jest.mock('react-redux', () => ({
    connect: () => (Component) => Component,
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

beforeAll(() => {
    globalThis.railsMode = 'test';
});

beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn());
});

function renderSiteLogo(umbrellaProject) {
    useSelector.mockImplementation((selector) =>
        selector({ currentAccount: null, umbrellaProject })
    );

    return render(
        <MemoryRouter>
            <SiteLogo />
        </MemoryRouter>
    );
}

test('uses the configured umbrella project logo and name', () => {
    renderSiteLogo({
        name: { en: 'Portal archive' },
        display_shortname: 'portal',
        default_locale: 'en',
        logos: { 1: { locale: 'en', src: '/logos/portal.svg' } },
    });

    expect(screen.getByRole('img')).toHaveAttribute('src', '/logos/portal.svg');
    expect(screen.getByRole('img')).toHaveAccessibleName(
        'Portal archive (portal)'
    );
});

test('uses the built-in logo when the umbrella project has no logo', () => {
    renderSiteLogo({ name: { en: 'Portal archive' }, logos: {} });

    expect(screen.getByRole('img')).toHaveAttribute('src', '/logo-ohd.svg');
});
