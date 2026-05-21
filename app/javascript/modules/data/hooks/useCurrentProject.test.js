import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { shallow } from 'enzyme';
import isLocaleValid from 'modules/routes/isLocaleValid';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';

import { normalizeProjectDbId, resolveCurrentProject } from '../utils';
import { useCurrentProject } from './useCurrentProject';
import { useGetProject } from './useGetProject';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useMatch: jest.fn(),
}));

jest.mock('modules/data', () => ({
    getProjects: (state) => state.data.projects,
}));

jest.mock('modules/routes/isLocaleValid', () => jest.fn());

jest.mock('../utils', () => ({
    normalizeProjectDbId: jest.fn(),
    resolveCurrentProject: jest.fn(),
}));

jest.mock('./useGetProject', () => ({
    useGetProject: jest.fn(),
}));

function HookReader({ options }) {
    const result = useCurrentProject(options);
    return <pre>{JSON.stringify(result)}</pre>;
}

HookReader.propTypes = {
    options: PropTypes.object,
};

function renderHookResult({
    projects = {},
    match = null,
    localeValid = false,
    cacheResolution,
    swrResult,
    options,
}) {
    useSelector.mockImplementation((selector) =>
        selector({ data: { projects: projects } })
    );
    useMatch.mockReturnValue(match);
    isLocaleValid.mockReturnValue(localeValid);
    resolveCurrentProject.mockReturnValue(cacheResolution);
    useGetProject.mockReturnValue(swrResult);
    normalizeProjectDbId.mockImplementation((id) => Number(id));

    const wrapper = shallow(<HookReader options={options} />);
    return JSON.parse(wrapper.text());
}

describe('useCurrentProject', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        delete window.location;
        window.location = { origin: 'https://example.org' };
    });

    it('returns cached project resolution without loading when cache is resolved', () => {
        const cached = {
            project: { id: 12, shortname: 'abc' },
            projectShortname: 'abc',
            projectDbId: 12,
            source: 'route-cache',
        };

        const result = renderHookResult({
            projects: { 12: cached.project },
            match: { params: { projectId: 'abc', locale: 'de' } },
            localeValid: true,
            cacheResolution: cached,
            swrResult: { project: null, loading: true, error: null },
        });

        expect(useGetProject).toHaveBeenCalledWith({
            shortname: null,
            lite: true,
        });
        expect(result).toEqual({
            ...cached,
            isResolved: true,
            isLoading: false,
            error: null,
        });
    });

    it('falls back to SWR by route shortname when cache is unresolved', () => {
        const swrProject = { id: '25', shortname: 'hist' };

        const result = renderHookResult({
            match: { params: { projectId: 'hist', locale: 'de' } },
            localeValid: true,
            cacheResolution: {
                project: null,
                projectShortname: 'hist',
                projectDbId: null,
                source: 'unresolved',
            },
            swrResult: { project: swrProject, loading: false, error: null },
            options: { lite: false },
        });

        expect(useGetProject).toHaveBeenCalledWith({
            shortname: 'hist',
            lite: false,
        });
        expect(result).toEqual({
            project: swrProject,
            projectShortname: 'hist',
            projectDbId: 25,
            source: 'swr',
            isResolved: true,
            isLoading: false,
            error: null,
        });
    });

    it('reports loading state while unresolved and SWR fetch is in progress', () => {
        const result = renderHookResult({
            match: { params: { projectId: 'hist', locale: 'de' } },
            localeValid: true,
            cacheResolution: {
                project: null,
                projectShortname: 'hist',
                projectDbId: null,
                source: 'unresolved',
            },
            swrResult: { project: null, loading: true, error: null },
        });

        expect(result).toEqual({
            project: null,
            projectShortname: 'hist',
            projectDbId: null,
            source: 'unresolved',
            isResolved: false,
            isLoading: true,
            error: null,
        });
    });

    it('does not fetch by shortname when SWR fallback is disabled', () => {
        renderHookResult({
            match: { params: { projectId: 'hist', locale: 'de' } },
            localeValid: true,
            cacheResolution: {
                project: null,
                projectShortname: 'hist',
                projectDbId: null,
                source: 'unresolved',
            },
            swrResult: { project: null, loading: false, error: null },
            options: { enableSWRFallback: false },
        });

        expect(useGetProject).toHaveBeenCalledWith({
            shortname: null,
            lite: true,
        });
    });
});
