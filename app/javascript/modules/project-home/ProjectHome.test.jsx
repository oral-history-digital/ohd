/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProjectDetail } from 'modules/data';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import ProjectHome from './ProjectHome';

let mockShortname = 'project';
let mockLocale = 'en';
let mockState;
jest.mock('modules/data', () => ({
    useProjectDetail: jest.fn(),
    getCurrentProject: (state) => state.project,
}));
jest.mock('modules/analytics', () => ({ useTrackPageView: () => {} }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: mockLocale }),
}));
jest.mock('modules/routes', () => ({
    useCurrentPage: () => ({ params: { projectShortname: mockShortname } }),
    usePathBase: () => `/${mockShortname}/${mockLocale}`,
    pathBase: jest.requireActual('../routes/pathBase').default,
}));
jest.mock('modules/archive', () => ({
    getLocale: (state) => state.archive.locale,
    getProjectId: (state) => state.archive.projectId,
}));
jest.mock('react-redux', () => ({
    useSelector: (select) => select(mockState),
}));
jest.mock('modules/react-toolbox', () => ({
    usePrevious: jest.requireActual('../react-toolbox/usePrevious').usePrevious,
}));
jest.mock('modules/user', () => ({
    RedirectOnLogin: jest.requireActual('../user/components/RedirectOnLogin')
        .default,
}));
jest.mock('modules/user-agent', () => ({
    ScrollToTop: ({ children }) => children,
}));
jest.mock('modules/ui', () => ({
    SmartImage: ({ src, alt }) => <img src={src} alt={alt} />,
}));
jest.mock('./FeaturedInterviews', () => ({
    __esModule: true,
    default: () => <div>Featured interviews</div>,
}));
jest.mock('./StartPageVideo', () => ({
    __esModule: true,
    default: () => <div>Start page video</div>,
}));

const project = {
    id: 7,
    shortname: 'project',
    name: 'Project home',
    display_ohd_link: true,
    introduction: '<p>Introduction</p><script>unsafe()</script>',
    more_text: '<strong>More home text</strong>',
    institutions: [
        { id: 1, name: 'First institute' },
        { id: 2, name: 'Second institute' },
    ],
    logo: { id: 3, url: '/logo-en.png' },
};

/**
 * Renders the home route and its login redirect destination, preserving router state on rerender.
 *
 * @returns {Object} Testing Library render result.
 */
function renderHome() {
    return render(<ProjectHome />, {
        wrapper: ({ children }) => (
            <MemoryRouter initialEntries={['/project/en']}>
                <Routes>
                    <Route path="/:projectId/:locale" element={children} />
                    <Route
                        path="/:projectId/:locale/searches/archive"
                        element={<div>Search destination</div>}
                    />
                </Routes>
            </MemoryRouter>
        ),
    });
}

beforeEach(() => {
    jest.clearAllMocks();
    mockShortname = 'project';
    mockLocale = 'en';
    mockState = {
        archive: { locale: 'en', projectId: 'project' },
        project: { ...project, archive_domain: null },
        user: { isLoggedIn: false },
    };
    useProjectDetail.mockReturnValue({ project });
});

test('requests project display details by shortname with institutions and renders sanitized home content', () => {
    const { container } = renderHome();
    expect(useProjectDetail).toHaveBeenCalledWith('project', {
        include: ['institutions'],
    });
    expect(
        screen.getByRole('heading', { name: 'Project home' })
    ).toBeInTheDocument();
    expect(
        screen.getByText('First institute, Second institute')
    ).toBeInTheDocument();
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('More home text')).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
    expect(screen.getByRole('img', { name: 'Project logo' })).toHaveAttribute(
        'src',
        '/logo-en.png'
    );
    expect(screen.getByText('Featured interviews')).toBeInTheDocument();
});

test('waits for initial details and retains loaded content during refresh', () => {
    useProjectDetail.mockReturnValue({ isLoading: true });
    const { rerender } = renderHome();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByText('Featured interviews')).not.toBeInTheDocument();
    useProjectDetail.mockReturnValue({
        project,
        isValidating: true,
        isLoading: false,
    });
    rerender(<ProjectHome />);
    expect(
        screen.getByRole('heading', { name: 'Project home' })
    ).toBeInTheDocument();
    expect(screen.getByText('Featured interviews')).toBeInTheDocument();
});

test('updates localized content and logo after the display locale changes', () => {
    const { rerender } = renderHome();
    mockLocale = 'de';
    mockState.archive.locale = 'de';
    useProjectDetail.mockReturnValue({
        project: {
            ...project,
            name: 'Projektstart',
            introduction: 'Einleitung',
            more_text: 'Mehr Text',
            institutions: [{ id: 1, name: 'Institut' }],
            logo: { url: '/logo-de.png' },
        },
    });
    rerender(<ProjectHome />);
    expect(
        screen.getByRole('heading', { name: 'Projektstart' })
    ).toBeInTheDocument();
    expect(screen.getByText('Einleitung')).toBeInTheDocument();
    expect(screen.getByText('Mehr Text')).toBeInTheDocument();
    expect(screen.getByText('Institut')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/logo-de.png');
    expect(screen.queryByText('Introduction')).not.toBeInTheDocument();
});

test('redirects after login even when the project cache is cleared for refetching', async () => {
    const { rerender } = renderHome();
    mockState.user.isLoggedIn = true;
    useProjectDetail.mockReturnValue({ isLoading: true });
    rerender(<ProjectHome />);
    expect(await screen.findByText('Search destination')).toBeInTheDocument();
});

test.each([
    {
        displayLink: false,
        logo: project.logo,
        condition: 'logo display is disabled',
    },
    { displayLink: true, logo: null, condition: 'no logo is configured' },
])('hides the logo when $condition', ({ displayLink, logo }) => {
    useProjectDetail.mockReturnValue({
        project: {
            ...project,
            display_ohd_link: displayLink,
            logo,
        },
    });
    renderHome();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

test.each(['mog', 'campscapes'])(
    'preserves project-specific media sections for %s',
    (shortname) => {
        mockShortname = shortname;
        useProjectDetail.mockReturnValue({
            project: { ...project, shortname },
        });
        renderHome();
        expect(
            screen.queryByText('Featured interviews')
        ).not.toBeInTheDocument();
        expect(Boolean(screen.queryByText('Start page video'))).toBe(
            shortname === 'mog'
        );
    }
);

test('shows a project request error and hides previously loaded home content', () => {
    useProjectDetail.mockReturnValue({
        project,
        error: { status: 403, message: 'Access denied' },
    });
    renderHome();
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByText('Featured interviews')).not.toBeInTheDocument();
});
