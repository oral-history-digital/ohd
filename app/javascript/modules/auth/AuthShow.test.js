import { useProject } from 'modules/routes';
import { renderToStaticMarkup } from 'react-dom/server';

import AuthShow from './AuthShow';
import { useAuthorization } from './authorization-hook';

jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
}));

jest.mock('./authorization-hook', () => ({
    useAuthorization: jest.fn(),
}));

function renderAuthShow(overrides = {}) {
    const props = {
        isLoggedIn: false,
        ifLoggedIn: false,
        hasProjectAccess: false,
        ifLoggedOut: false,
        ifNoProject: false,
        ifCatalog: false,
        user: null,
        interview: null,
        children: <span>VISIBLE</span>,
        ...overrides,
    };

    return renderToStaticMarkup(<AuthShow {...props} />);
}

function buildProject(overrides = {}) {
    return {
        id: 1,
        shortname: 'project',
        is_ohd: false,
        is_catalog_project: false,
        grant_access_without_login: false,
        grant_project_access_instantly: false,
        ...overrides,
    };
}

function buildUser(overrides = {}) {
    return {
        admin: false,
        user_projects: {},
        interview_permissions: [],
        ...overrides,
    };
}

describe('AuthShow', () => {
    beforeEach(() => {
        useProject.mockReturnValue({ project: buildProject() });
        useAuthorization.mockReturnValue({
            isAuthorized: jest.fn(() => false),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders children for logged in users when ifLoggedIn is set', () => {
        const html = renderAuthShow({
            isLoggedIn: true,
            ifLoggedIn: true,
            user: buildUser({ user_projects: {} }),
        });

        expect(html).toContain('VISIBLE');
    });

    it('renders children for project-access users with explicit project_access_granted', () => {
        useProject.mockReturnValue({
            project: buildProject({ id: 42 }),
        });

        const user = buildUser({
            user_projects: {
                a: { project_id: 42, workflow_state: 'project_access_granted' },
            },
        });

        const html = renderAuthShow({
            isLoggedIn: true,
            hasProjectAccess: true,
            user,
        });

        expect(html).toContain('VISIBLE');
    });

    it('renders children for logged out users when ifLoggedOut is set', () => {
        const html = renderAuthShow({
            isLoggedIn: false,
            ifLoggedOut: true,
            user: null,
        });

        expect(html).toContain('VISIBLE');
    });

    it('renders children for logged in users without project access when ifNoProject is set', () => {
        const user = buildUser({ user_projects: {} });

        const html = renderAuthShow({
            isLoggedIn: true,
            ifNoProject: true,
            user,
        });

        expect(html).toContain('VISIBLE');
    });

    it('renders children for catalog projects when ifCatalog is set', () => {
        useProject.mockReturnValue({
            project: buildProject({ is_catalog_project: true }),
        });

        const html = renderAuthShow({
            ifCatalog: true,
        });

        expect(html).toContain('VISIBLE');
    });

    it('renders children for logged in OHD users when grant_access_without_login is true', () => {
        useProject.mockReturnValue({
            project: buildProject({
                id: 21894749,
                shortname: 'ohd',
                is_ohd: true,
                grant_access_without_login: true,
            }),
        });

        const html = renderAuthShow({
            isLoggedIn: true,
            hasProjectAccess: true,
            user: buildUser(),
        });

        expect(html).toContain('VISIBLE');
    });

    it('renders fallback children for denied restricted interviews when ifLoggedOut is enabled', () => {
        const user = buildUser({ interview_permissions: [] });

        const html = renderAuthShow({
            isLoggedIn: true,
            ifLoggedOut: true,
            user,
            interview: { id: 7, workflow_state: 'restricted' },
        });

        expect(html).toContain('VISIBLE');
    });

    it('returns null for logged out users when ifLoggedOut is not set', () => {
        const html = renderAuthShow({
            isLoggedIn: false,
            ifLoggedOut: false,
            user: null,
        });

        expect(html).toBe('');
    });

    it('returns null for logged in users without access when only hasProjectAccess is set', () => {
        const html = renderAuthShow({
            isLoggedIn: true,
            hasProjectAccess: true,
            user: buildUser({ user_projects: {} }),
        });

        expect(html).toBe('');
    });

    it('returns null for non-catalog projects when only ifCatalog is set', () => {
        useProject.mockReturnValue({
            project: buildProject({ is_catalog_project: false }),
        });

        const html = renderAuthShow({
            ifCatalog: true,
        });

        expect(html).toBe('');
    });

    it('returns null for restricted interviews in project-access mode when user lacks permission', () => {
        const html = renderAuthShow({
            isLoggedIn: true,
            hasProjectAccess: true,
            user: buildUser({ interview_permissions: [] }),
            interview: { id: 7, workflow_state: 'restricted' },
        });

        expect(html).toBe('');
    });
});
