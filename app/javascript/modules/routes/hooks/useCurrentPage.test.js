import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { shallow } from 'enzyme';
import { useLocation } from 'react-router-dom';

import useProject from '../useProject';
import { useCurrentPage } from './useCurrentPage';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}));

jest.mock('../useProject', () => ({
    __esModule: true,
    default: jest.fn(),
}));

/**
 * Renders current page context as JSON to simplify assertions.
 */
function HookReader() {
    const currentPage = useCurrentPage();
    return <pre>{JSON.stringify(currentPage)}</pre>;
}

/**
 * Returns hook output using the mocked location object.
 */
function readHookResult(location, project = null) {
    useLocation.mockReturnValue(location);
    useProject.mockReturnValue({ project });
    const wrapper = shallow(<HookReader />);
    return JSON.parse(wrapper.text());
}

describe('useCurrentPage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns startpage context for locale root route', () => {
        const result = readHookResult({ pathname: '/de', search: '' });

        expect(result.pageType).toBe('project_startpage');
        expect(result.params).toEqual({
            locale: 'de',
            projectId: null,
        });
        expect(result.pathBase).toBe('/de');
        expect(result.isKnown).toBe(true);
    });

    it('returns site_startpage context for locale root route on ohd project', () => {
        const result = readHookResult(
            { pathname: '/de', search: '' },
            { is_ohd: true }
        );

        expect(result.pageType).toBe('site_startpage');
        expect(result.params).toEqual({
            locale: 'de',
            projectId: null,
        });
        expect(result.pathBase).toBe('/de');
        expect(result.isKnown).toBe(true);
    });

    it('returns interview context with archive id', () => {
        const result = readHookResult({
            pathname: '/mog/de/interviews/ARC-1',
            search: '',
        });

        expect(result.pageType).toBe('interview_detail');
        expect(result.params).toEqual({
            projectId: 'mog',
            locale: 'de',
            archiveId: 'ARC-1',
        });
        expect(result.pathBase).toBe('/mog/de');
        expect(result.isKnown).toBe(true);
    });

    it('returns unknown context for unmatched route', () => {
        const result = readHookResult({
            pathname: '/mog/de/this-route-does-not-exist',
            search: '?q=test',
        });

        expect(result.pageType).toBe('unknown');
        expect(result.params).toEqual({
            projectId: 'mog',
            locale: 'de',
        });
        expect(result.pathBase).toBe('/mog/de');
        expect(result.search).toBe('?q=test');
        expect(result.isKnown).toBe(false);
    });
});
