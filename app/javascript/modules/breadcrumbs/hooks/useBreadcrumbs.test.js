import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { shallow } from 'enzyme';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

import { useBreadcrumbModel } from './useBreadcrumbModel';
import { useBreadcrumbs } from './useBreadcrumbs';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('modules/i18n', () => ({
    useI18n: jest.fn(),
}));

jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
}));

jest.mock('./useBreadcrumbModel', () => ({
    useBreadcrumbModel: jest.fn(),
}));

function HookReader() {
    const crumbs = useBreadcrumbs();
    return <pre>{JSON.stringify(crumbs)}</pre>;
}

function renderHookResult({ project, modelItems, currentPage = {} }) {
    useI18n.mockReturnValue({ locale: 'de' });
    useProject.mockReturnValue({ project });
    useBreadcrumbModel.mockReturnValue({
        currentPage,
        items: modelItems,
    });

    const wrapper = shallow(<HookReader />);
    return JSON.parse(wrapper.text());
}

describe('useBreadcrumbs', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns project breadcrumb on project start page even when model items are empty', () => {
        const result = renderHookResult({
            project: {
                is_ohd: false,
                default_locale: 'de',
                display_name: { de: 'Projekt Alpha' },
            },
            currentPage: { pageType: 'project_startpage', pathBase: '/de' },
            modelItems: [],
        });

        expect(result).toEqual([
            {
                key: 'archive',
                label: 'Projekt Alpha',
                isProjectRoot: true,
            },
        ]);
    });

    it('prepends project breadcrumb for non-ohd pages when archive root is missing', () => {
        const result = renderHookResult({
            project: {
                is_ohd: false,
                default_locale: 'de',
                display_name: { de: 'Projekt Alpha' },
            },
            currentPage: { pageType: 'search_archive', pathBase: '/de' },
            modelItems: [
                {
                    key: 'search_archive',
                    label: 'Interviews',
                    to: '/de/searches/archive',
                },
            ],
        });

        expect(result).toEqual([
            {
                key: 'archive',
                label: 'Projekt Alpha',
                to: '/de',
                isProjectRoot: true,
            },
            {
                key: 'search_archive',
                label: 'Interviews',
                to: '/de/searches/archive',
                isProjectRoot: false,
            },
        ]);
    });

    it('does not prepend a duplicate project breadcrumb when archive root already exists', () => {
        const result = renderHookResult({
            project: {
                is_ohd: false,
                default_locale: 'de',
                display_name: { de: 'Projekt Alpha' },
            },
            currentPage: { pageType: 'search_archive' },
            modelItems: [
                {
                    key: 'archive',
                    label: 'Projekt Alpha',
                    to: '/de',
                },
                {
                    key: 'search_archive',
                    label: 'Interviews',
                    to: '/de/searches/archive',
                },
            ],
        });

        expect(result).toEqual([
            {
                key: 'archive',
                label: 'Projekt Alpha',
                to: '/de',
                isProjectRoot: true,
            },
            {
                key: 'search_archive',
                label: 'Interviews',
                to: '/de/searches/archive',
                isProjectRoot: false,
            },
        ]);
    });
});
