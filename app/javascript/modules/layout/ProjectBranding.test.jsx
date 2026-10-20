/* eslint-disable react/prop-types */
import { act, render, screen } from '@testing-library/react';
import Loader from 'modules/api/Loader';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { dataReducer } from '../data/redux/reducer';
import ThemeProvider from './ThemeProvider';
import SiteHeader from './components/SiteHeader';

let mockPageType = 'interview_detail';
let navigate;

jest.mock('modules/api/Loader', () => ({
    __esModule: true,
    default: { getJson: jest.fn() },
}));
jest.mock('modules/data', () => ({
    getProjects: jest.requireActual('../data/redux/selectors/baseSelectors')
        .getProjects,
    useProjectDetail: jest.requireActual('../data/hooks/useProjectDetail')
        .useProjectDetail,
}));
jest.mock('modules/routes', () => ({
    useProject: jest.requireActual('../routes/useProject').default,
    usePathBase: jest.requireActual('../routes/usePathBase').default,
    useCurrentPage: () => ({ pageType: mockPageType }),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/project-home', () => ({
    ProjectLogo: jest.requireActual('../project-home/ProjectLogo').default,
}));
jest.mock('modules/ui', () => ({
    SmartImage: ({ src, alt }) => <img src={src} alt={alt} />,
}));
jest.mock('modules/breadcrumbs', () => ({
    Breadcrumbs: () => <nav aria-label="breadcrumb" />,
}));
jest.mock(
    './components/SiteLogo',
    () =>
        /** @returns {React.ReactElement} Global home navigation. */
        function MockSiteLogo() {
            return <a href="/en">Portal</a>;
        }
);
jest.mock('react-helmet', () => ({ Helmet: ({ children }) => children }));

/** @returns {React.ReactElement} Header with route controls for project switching. */
function RoutedHeader() {
    navigate = useNavigate();
    return <SiteHeader />;
}

/** @returns {Object} Rendered header and theme sharing a real Redux store. */
function renderBranding() {
    const store = createStore(
        combineReducers({ data: dataReducer }),
        applyMiddleware(thunk)
    );
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/pilot/en/interviews/pilot0001']}>
                <ThemeProvider>
                    <RoutedHeader />
                </ThemeProvider>
            </MemoryRouter>
        </Provider>
    );
}

/**
 * Completes the current project request with display fields.
 *
 * @param {Object} [fields={}] - Response fields overriding the project defaults.
 */
function complete(fields = {}) {
    const [, , dispatch, success] = Loader.getJson.mock.lastCall;
    dispatch(
        success({
            data: {
                id: 7,
                shortname: 'pilot',
                is_umbrella: false,
                display_ohd_link: false,
                logo: { id: 12, url: '/pilot-en.svg' },
                primary_color: '#123456',
                secondary_color: '#234567',
                editorial_color: '#345678',
                aspect_x: 16,
                aspect_y: 9,
                ...fields,
            },
        })
    );
}

beforeEach(() => {
    jest.clearAllMocks();
    mockPageType = 'interview_detail';
});

test('shares one display request and replaces project branding when the route changes', () => {
    const { container } = renderBranding();
    const css = () => container.querySelector('style').textContent;
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
    expect(Loader.getJson.mock.lastCall[0]).toBe(
        '/api/v2/projects/pilot?locale=en'
    );
    expect(css()).toContain('--primary-color: #e01217');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    act(() => complete());
    expect(screen.getByRole('img', { name: 'Project logo' })).toHaveAttribute(
        'src',
        '/pilot-en.svg'
    );
    expect(screen.getByRole('link', { name: 'Project logo' })).toHaveAttribute(
        'href',
        '/pilot/en'
    );
    expect(container.querySelector('header')).toHaveClass(
        'SiteHeader--hasLargeLogo'
    );
    expect(css()).toContain('--primary-color: #123456');
    expect(css()).toContain('--secondary-color: #234567');
    expect(css()).toContain('--editorial-color: #345678');
    expect(css()).toContain('--aspect-x: 16');
    expect(css()).toContain('--aspect-y: 9');

    act(() => navigate('/other/en/interviews/other0001'));
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
    expect(Loader.getJson.mock.lastCall[0]).toBe(
        '/api/v2/projects/other?locale=en'
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(css()).toContain('--primary-color: #e01217');
    expect(css()).toContain('--aspect-x: 4');
    expect(css()).toContain('--aspect-y: 3');
    act(() =>
        complete({
            id: 8,
            shortname: 'other',
            display_ohd_link: true,
            primary_color: '#abcdef',
        })
    );
    expect(
        screen.getByRole('navigation', { name: 'breadcrumb' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('header')).toHaveClass(
        'SiteHeader--hasBreadcrumbs'
    );
    expect(css()).toContain('--primary-color: #abcdef');
});

test('retains home navigation and default theme after a denied display read', () => {
    mockPageType = 'site_startpage';
    const { container } = renderBranding();
    const [, , dispatch, , failure] = Loader.getJson.mock.lastCall;
    act(() => dispatch(failure({ status: 403, message: 'Access denied.' })));
    expect(screen.getByRole('link', { name: 'Portal' })).toBeInTheDocument();
    expect(container.querySelector('header')).toHaveClass(
        'SiteHeader--hasLargeLogo'
    );
    expect(container.querySelector('style')).toHaveTextContent(
        '--primary-color: #e01217'
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
});
