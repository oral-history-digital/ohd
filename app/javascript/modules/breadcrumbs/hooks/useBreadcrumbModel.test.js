import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { shallow } from 'enzyme';
import { useAuthorization, useProjectAccessStatus } from 'modules/auth';
import {
    getCurrentInterview,
    getCurrentUser,
    getUsersStatus,
    useGetCollection,
    useGetInstitution,
    useGetProject,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useSelector } from 'react-redux';

import { useCurrentPage } from '../../routes/hooks/useCurrentPage';
import useProject from '../../routes/useProject';
import { useBreadcrumbModel } from './useBreadcrumbModel';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('../../routes/hooks/useCurrentPage', () => ({
    useCurrentPage: jest.fn(),
}));

jest.mock('../../routes/useProject', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('modules/i18n', () => ({
    useI18n: jest.fn(),
}));

jest.mock('modules/auth', () => ({
    useAuthorization: jest.fn(),
    useProjectAccessStatus: jest.fn(),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

jest.mock('modules/data', () => ({
    getCurrentInterview: jest.fn(),
    getCurrentUser: jest.fn(),
    getUsersStatus: jest.fn(),
    useGetCollection: jest.fn(),
    useGetInstitution: jest.fn(),
    useGetProject: jest.fn(),
}));

/**
 * Renders the breadcrumb model hook and returns parsed JSON output.
 */
function HookReader() {
    const model = useBreadcrumbModel();
    return <pre>{JSON.stringify(model)}</pre>;
}

/**
 * Returns hook output for the given mocked routing and data context.
 */
function getHookResult({
    currentPage,
    project,
    interview,
    collections,
    institutions,
    projects,
    currentUser,
    usersStatus,
    authCanUpdate,
    projectAccessGranted,
    translations,
}) {
    useCurrentPage.mockReturnValue(currentPage);
    useProject.mockReturnValue({ project });
    useI18n.mockReturnValue({
        locale: 'de',
        t: (key) => translations[key] || key,
    });
    useAuthorization.mockReturnValue({
        isAuthorized: () => Boolean(authCanUpdate),
    });
    useProjectAccessStatus.mockReturnValue({
        projectAccessGranted: projectAccessGranted !== false,
    });

    getCurrentInterview.mockImplementation(() => interview);
    getCurrentUser.mockImplementation(() => currentUser || null);
    getUsersStatus.mockImplementation(() => usersStatus || 'fetched');
    useGetCollection.mockImplementation((id) => ({
        collection:
            (id && (collections?.[id] || collections?.[Number(id)])) || null,
    }));
    useGetInstitution.mockImplementation((id) => ({
        institution:
            (id && (institutions?.[id] || institutions?.[Number(id)])) || null,
    }));
    useGetProject.mockImplementation((params = {}) => {
        const projectIdentifier = params.id || params.shortname;
        return {
            project:
                (projectIdentifier &&
                    (projects?.[projectIdentifier] ||
                        projects?.[Number(projectIdentifier)])) ||
                null,
        };
    });
    useSelector.mockImplementation((selector) => selector({}));

    const wrapper = shallow(<HookReader />);
    return JSON.parse(wrapper.text());
}

describe('useBreadcrumbModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns empty items for unknown pages', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'unknown',
                isKnown: false,
                params: { locale: 'de', projectId: 'mog' },
                pathBase: '/mog/de',
                pathname: '/mog/de/unknown',
                search: '',
            },
            project: null,
            interview: null,
            collections: {},
            institutions: {},
            projects: {},
            currentUser: null,
            translations: {
                home: 'Start',
            },
        });

        expect(result.items).toEqual([]);
    });

    it('builds Collection -> Interview for interview pages', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'interview_detail',
                isKnown: true,
                params: {
                    projectId: 'mog',
                    locale: 'de',
                    archiveId: 'za001',
                },
                pathBase: '/mog/de',
                pathname: '/mog/de/interviews/za001',
                search: '',
            },
            project: {
                shortname: 'mog',
                default_locale: 'de',
                display_name: { de: 'Archiv Alpha' },
            },
            interview: {
                id: 101,
                archive_id: 'za001',
                workflow_state: 'public',
                short_title: { de: 'Interview Titel' },
                collection_id: 7,
            },
            collections: {
                7: {
                    id: 7,
                    default_locale: 'de',
                    name: { de: 'Sammlung A' },
                },
            },
            institutions: {},
            projects: {},
            currentUser: null,
            translations: {
                home: 'Start',
                'activerecord.models.interview.one': 'Interview',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'collection',
                label: 'Sammlung A',
                to: '/mog/de/searches/archive?collection_id[]=7&sort=random',
                isCurrent: false,
            },
            {
                key: 'interview',
                label: 'Interview Titel',
                to: '/mog/de/interviews/za001',
                isCurrent: true,
                loading: false,
            },
        ]);
    });

    it('falls back to archiveId and loading=true while interview is not loaded', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'interview_detail',
                isKnown: true,
                params: {
                    projectId: 'mog',
                    locale: 'de',
                    archiveId: 'za001',
                },
                pathBase: '/mog/de',
                pathname: '/mog/de/interviews/za001',
                search: '',
            },
            project: {
                shortname: 'mog',
                default_locale: 'de',
                display_name: { de: 'Archiv Alpha' },
            },
            interview: null,
            collections: {},
            institutions: {},
            projects: {},
            currentUser: null,
            translations: {
                home: 'Start',
                'activerecord.models.interview.one': 'Interview',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'search_archive',
                label: 'Search',
                to: '/mog/de/searches/archive',
                isCurrent: false,
            },
            {
                key: 'interview',
                label: 'za001',
                to: '/mog/de/interviews/za001',
                isCurrent: true,
                loading: true,
            },
        ]);
    });

    it('uses translated static page labels when available', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'static_text_page',
                isKnown: true,
                params: {
                    locale: 'de',
                    projectId: null,
                    staticPageCode: 'contact',
                },
                pathBase: '/de',
                pathname: '/de/contact',
                search: '',
            },
            project: null,
            interview: null,
            collections: {},
            institutions: {},
            projects: {},
            currentUser: null,
            translations: {
                home: 'Start',
                contact: 'Kontakt',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'static_text_page',
                label: 'Kontakt',
                to: '/de/contact',
                isCurrent: true,
                loading: false,
            },
        ]);
    });

    it('resolves archive name for catalog archives detail pages', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'catalog_page',
                isKnown: true,
                params: {
                    locale: 'de',
                    projectId: null,
                    catalogType: 'archives',
                    id: '456146',
                },
                pathBase: '/de',
                pathname: '/de/catalog/archives/456146',
                search: '',
            },
            project: null,
            interview: null,
            collections: {},
            institutions: {},
            currentUser: null,
            projects: {
                456146: {
                    id: 456146,
                    shortname: 'fvv',
                    default_locale: 'de',
                    name: { de: 'Zeitzeugenarchiv FVV' },
                },
            },
            translations: {
                home: 'Start',
                'modules.catalog.breadcrumb_title': 'Archive & Sammlungen',
                'activerecord.models.project.other': 'Archive',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'catalog',
                label: 'Archive & Sammlungen',
                to: '/de/catalog',
                isCurrent: false,
            },
            {
                key: 'catalog_item_456146',
                label: 'Zeitzeugenarchiv FVV',
                to: null,
                isCurrent: true,
                loading: false,
            },
        ]);
    });

    it('includes parent archive before collection on catalog collection detail pages', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'catalog_page',
                isKnown: true,
                params: {
                    locale: 'de',
                    projectId: null,
                    catalogType: 'collections',
                    id: '87579294',
                },
                pathBase: '/de',
                pathname: '/de/catalog/collections/87579294',
                search: '',
            },
            project: null,
            interview: null,
            currentUser: null,
            collections: {
                87579294: {
                    id: 87579294,
                    project_id: 456146,
                    project_name: 'Zeitzeugenarchiv FVV',
                    default_locale: 'de',
                    name: {
                        de: "Colonia Dignidad - Collection 'Deutsche Seelen'",
                    },
                },
            },
            institutions: {},
            projects: {
                456146: {
                    id: 456146,
                    shortname: 'fvv',
                    default_locale: 'de',
                    name: { de: 'Zeitzeugenarchiv FVV' },
                },
            },
            translations: {
                home: 'Start',
                'modules.catalog.breadcrumb_title': 'Archive & Sammlungen',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'catalog',
                label: 'Archive & Sammlungen',
                to: '/de/catalog',
                isCurrent: false,
            },
            {
                key: 'catalog_archive_456146',
                label: 'Zeitzeugenarchiv FVV',
                to: '/de/catalog/archives/456146',
                isCurrent: false,
                loading: false,
            },
            {
                key: 'catalog_item_87579294',
                label: "Colonia Dignidad - Collection 'Deutsche Seelen'",
                to: null,
                isCurrent: true,
                loading: false,
            },
        ]);
    });

    it('uses parent project id fallback while parent archive label is still loading', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'catalog_page',
                isKnown: true,
                params: {
                    locale: 'de',
                    projectId: null,
                    catalogType: 'collections',
                    id: '87579294',
                },
                pathBase: '/de',
                pathname: '/de/catalog/collections/87579294',
                search: '',
            },
            project: null,
            interview: null,
            currentUser: null,
            collections: {
                87579294: {
                    id: 87579294,
                    project_id: 456146,
                    default_locale: 'de',
                    name: {
                        de: "Colonia Dignidad - Collection 'Deutsche Seelen'",
                    },
                },
            },
            institutions: {},
            projects: {},
            translations: {
                home: 'Start',
                'modules.catalog.breadcrumb_title': 'Archive & Sammlungen',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'catalog',
                label: 'Archive & Sammlungen',
                to: '/de/catalog',
                isCurrent: false,
            },
            {
                key: 'catalog_archive_456146',
                label: '456146',
                to: '/de/catalog/archives/456146',
                isCurrent: false,
                loading: true,
            },
            {
                key: 'catalog_item_87579294',
                label: "Colonia Dignidad - Collection 'Deutsche Seelen'",
                to: null,
                isCurrent: true,
                loading: false,
            },
        ]);
    });

    it('uses anonymous interview title when restricted and not permitted', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'interview_detail',
                isKnown: true,
                params: {
                    projectId: 'mog',
                    locale: 'de',
                    archiveId: 'za001',
                },
                pathBase: '/mog/de',
                pathname: '/mog/de/interviews/za001',
                search: '',
            },
            project: {
                shortname: 'mog',
                default_locale: 'de',
                display_name: { de: 'Archiv Alpha' },
            },
            interview: {
                id: 101,
                archive_id: 'za001',
                workflow_state: 'restricted',
                short_title: { de: 'Full Visible Name' },
                anonymous_title: { de: 'A. Person' },
            },
            currentUser: {
                interview_permissions: [],
            },
            collections: {},
            institutions: {},
            projects: {},
            projectAccessGranted: true,
            authCanUpdate: false,
            translations: {
                home: 'Start',
                'activerecord.models.interview.one': 'Interview',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'search_archive',
                label: 'Search',
                to: '/mog/de/searches/archive',
                isCurrent: false,
            },
            {
                key: 'interview',
                label: 'A. Person',
                to: '/mog/de/interviews/za001',
                isCurrent: true,
                loading: false,
            },
        ]);
    });

    it('keeps interview breadcrumb in loading state until restricted access is resolved', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'interview_detail',
                isKnown: true,
                params: {
                    projectId: 'mog',
                    locale: 'de',
                    archiveId: 'za001',
                },
                pathBase: '/mog/de',
                pathname: '/mog/de/interviews/za001',
                search: '',
            },
            project: {
                shortname: 'mog',
                default_locale: 'de',
                display_name: { de: 'Archiv Alpha' },
            },
            interview: {
                id: 101,
                archive_id: 'za001',
                workflow_state: 'restricted',
                short_title: { de: 'Full Visible Name' },
                anonymous_title: { de: 'A. Person' },
            },
            currentUser: {
                interview_permissions: [],
            },
            usersStatus: 'fetching',
            collections: {},
            institutions: {},
            projects: {},
            projectAccessGranted: true,
            authCanUpdate: false,
            translations: {
                home: 'Start',
                'activerecord.models.interview.one': 'Interview',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'search_archive',
                label: 'Search',
                to: '/mog/de/searches/archive',
                isCurrent: false,
            },
            {
                key: 'interview',
                label: 'A. Person',
                to: '/mog/de/interviews/za001',
                isCurrent: true,
                loading: true,
            },
        ]);
    });

    it('resolves institution name for catalog institutions detail pages', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'catalog_page',
                isKnown: true,
                params: {
                    locale: 'de',
                    projectId: null,
                    catalogType: 'institutions',
                    id: '14',
                },
                pathBase: '/de',
                pathname: '/de/catalog/institutions/14',
                search: '',
            },
            project: null,
            interview: null,
            currentUser: null,
            collections: {},
            institutions: {
                14: {
                    id: 14,
                    default_locale: 'de',
                    name: { de: 'Stiftung Beispiel' },
                },
            },
            projects: {},
            translations: {
                home: 'Start',
                'modules.catalog.breadcrumb_title': 'Archive & Sammlungen',
                'activerecord.models.institution.other': 'Institutionen',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'catalog',
                label: 'Institutionen',
                to: '/de/catalog/institutions',
                isCurrent: false,
            },
            {
                key: 'catalog_item_14',
                label: 'Stiftung Beispiel',
                to: null,
                isCurrent: true,
                loading: false,
            },
        ]);
    });

    it('shows institutions label for catalog institutions index page', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'catalog_page',
                isKnown: true,
                params: {
                    locale: 'de',
                    projectId: null,
                    catalogType: 'institutions',
                    id: null,
                },
                pathBase: '/de',
                pathname: '/de/catalog/institutions',
                search: '',
            },
            project: null,
            interview: null,
            currentUser: null,
            collections: {},
            institutions: {},
            projects: {},
            translations: {
                home: 'Start',
                'modules.catalog.breadcrumb_title': 'Archive & Sammlungen',
                'activerecord.models.institution.other': 'Institutionen',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'catalog',
                label: 'Institutionen',
                to: '/de/catalog/institutions',
                isCurrent: true,
            },
        ]);
    });

    it('builds project-scoped archive search pages without global roots', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'search_archive',
                subtype: 'collection_search',
                isKnown: true,
                params: {
                    locale: 'de',
                    projectId: 'adg',
                    collectionId: '21894736',
                },
                pathBase: '/adg/de',
                pathname: '/adg/de/searches/archive',
                search: '?collection_id[]=21894736',
            },
            project: {
                shortname: 'adg',
                is_ohd: false,
                default_locale: 'de',
                display_name: { de: 'Archiv Deutsches Gedaechtnis' },
            },
            interview: null,
            currentUser: null,
            collections: {
                21894736: {
                    id: 21894736,
                    default_locale: 'de',
                    name: { de: 'Sammlung ADG 1' },
                },
            },
            institutions: {},
            projects: {},
            translations: {
                home: 'Start',
                interviews: 'Interviews',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'search_archive',
                label: 'Sammlung ADG 1',
                to: '/adg/de/searches/archive',
                isCurrent: true,
                loading: false,
            },
        ]);
    });

    it('builds OHD archive search pages without global roots', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'search_archive',
                subtype: 'main_site_search',
                isKnown: true,
                params: {
                    locale: 'de',
                    projectId: null,
                    collectionId: null,
                },
                pathBase: '/de',
                pathname: '/de/searches/archive',
                search: '?sort=random',
            },
            project: null,
            interview: null,
            currentUser: null,
            collections: {},
            institutions: {},
            projects: {},
            translations: {
                home: 'Start',
                interviews: 'Interviews',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'search_archive',
                label: 'Interviews',
                to: '/de/searches/archive',
                isCurrent: true,
                loading: false,
            },
        ]);
    });

    it('builds project-scoped map search pages without global roots', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'search_map',
                isKnown: true,
                params: {
                    locale: 'de',
                    projectId: 'adg',
                },
                pathBase: '/adg/de',
                pathname: '/adg/de/searches/map',
                search: '',
            },
            project: {
                shortname: 'adg',
                is_ohd: false,
                default_locale: 'de',
                display_name: { de: 'Archiv Deutsches Gedaechtnis' },
            },
            interview: null,
            currentUser: null,
            collections: {},
            institutions: {},
            projects: {},
            translations: {
                home: 'Start',
                'modules.search_map.title': 'Kartenansicht',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'search_map',
                label: 'Kartenansicht',
                to: '/adg/de/searches/map',
                isCurrent: true,
                loading: false,
            },
        ]);
    });

    it('builds OHD map search pages without global roots', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'search_map',
                isKnown: true,
                params: {
                    locale: 'de',
                    projectId: null,
                },
                pathBase: '/de',
                pathname: '/de/searches/map',
                search: '',
            },
            project: null,
            interview: null,
            currentUser: null,
            collections: {},
            institutions: {},
            projects: {},
            translations: {
                home: 'Start',
                'modules.search_map.title': 'Kartenansicht',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'search_map',
                label: 'Kartenansicht',
                to: '/de/searches/map',
                isCurrent: true,
                loading: false,
            },
        ]);
    });

    it('uses translated register label on register pages', () => {
        const result = getHookResult({
            currentPage: {
                pageType: 'register_page',
                isKnown: true,
                params: {
                    locale: 'de',
                    projectId: 'adg',
                },
                pathBase: '/adg/de',
                pathname: '/adg/de/register',
                search: '',
            },
            project: {
                shortname: 'adg',
                is_ohd: false,
                default_locale: 'de',
                display_name: { de: 'Archiv Deutsches Gedaechtnis' },
            },
            interview: null,
            currentUser: null,
            collections: {},
            institutions: {},
            projects: {},
            translations: {
                home: 'Start',
                'user.registration': 'Registrierung',
            },
        });

        expect(result.items).toEqual([
            {
                key: 'register_page',
                label: 'Registrierung',
                to: '/adg/de/register',
                isCurrent: true,
                loading: false,
            },
        ]);
    });
});
