import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import SiteFooter from './SiteFooter';

jest.mock('modules/constants', () => ({
    GITHUB_URL: 'https://github.com/example/ohd',
    OHD_DOMAINS: { test: 'https://portal.example' },
}));
jest.mock('modules/data', () => ({ getUmbrellaProject: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/routes', () => ({
    usePathBase: () => '/archive/en',
    useProject: () => ({
        project: {
            shortname: 'ohd',
            is_umbrella: false,
            name: { en: 'Archive' },
        },
        projectId: 'ohd',
    }),
}));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('./ProjectFooter', () => () => null);

beforeAll(() => {
    globalThis.railsMode = 'test';
    globalThis.VERSION = '1.0.0';
});

function renderFooter() {
    return render(
        <MemoryRouter>
            <SiteFooter />
        </MemoryRouter>
    );
}

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
