import { render, screen } from '@testing-library/react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import NotFoundPage from './NotFoundPage';
import RouteDivider from './RouteDivider';
import useProject from './useProject';

jest.mock('./useProject', () => jest.fn());
jest.mock('./usePathBase', () => () => '/pilot/en');
jest.mock('./Routes', () => ({}));
jest.mock('modules/analytics', () => ({}));
jest.mock('modules/layout', () => ({}));
jest.mock('react-redux', () => ({ useSelector: jest.fn(() => false) }));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));
jest.mock('modules/ui', () => ({}));
jest.mock('modules/constants', () => ({
    OHD_DOMAINS: { test: 'https://portal.test' },
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));

test.each([403, 404])(
    'renders a standalone page for project HTTP %s',
    (status) => {
        globalThis.railsMode = 'test';
        useProject.mockReturnValue({ error: { status, message: 'Forbidden' } });
        render(<RouteDivider />);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
            status === 403 ? 'error 403' : 'modules.routes.not_found.title'
        );
        expect(screen.getByRole('main')).toHaveClass('Main');
        expect(screen.getByRole('heading').closest('section')).toHaveClass(
            'Section',
            'Section--warning'
        );
        expect(Helmet.peek().linkTags).toContainEqual({
            rel: 'stylesheet',
            href: '/error.css',
        });
        expect(
            screen.getByRole('link', { name: 'modules.routes.not_found.link' })
        ).toHaveAttribute('href', 'https://portal.test/en');
        expect(Boolean(screen.queryByRole('link', { name: 'login' }))).toBe(
            status === 403
        );
        expect(screen.queryByText('Forbidden')).toBeNull();
    }
);

test('denied-project login preserves the project and return path', () => {
    globalThis.railsMode = 'test';
    useProject.mockReturnValue({
        error: { status: 403 },
        projectShortname: 'pilot',
    });
    render(<RouteDivider />);
    expect(screen.getByText('unauthorized')).toBeInTheDocument();
    const login = new URL(screen.getByRole('link', { name: 'login' }).href);
    expect(login.searchParams.get('project')).toBe('pilot');
    expect(login.searchParams.get('path')).toBe(window.location.pathname);
});

test('existing not-found routes retain their project homepage link', () => {
    globalThis.railsMode = 'test';
    render(
        <MemoryRouter>
            <NotFoundPage />
        </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'modules.routes.not_found.title'
    );
    expect(
        screen.getByRole('link', { name: 'modules.routes.not_found.link' })
    ).toHaveAttribute('href', '/pilot/en');
});

test('hides forbidden responses while logout navigation is pending', () => {
    useSelector.mockReturnValueOnce(true);
    useProject.mockReturnValue({ error: { status: 403 } });
    render(<RouteDivider />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    expect(screen.queryByRole('heading')).toBeNull();
});
