import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import { fetchData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { useHydrateProjectsByIds } from './useHydrateProjectsByIds';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('modules/i18n', () => ({
    useI18n: jest.fn(),
}));

jest.mock('modules/data', () => ({
    fetchData: jest.fn(),
    getCurrentProject: (state) => state.data.currentProject,
    getProjects: (state) => state.data.projects,
    getProjectsStatus: (state) => state.data.projectsStatus,
}));

function TestComponent({ projectIds, options }) {
    useHydrateProjectsByIds(projectIds, options);
    return null;
}

TestComponent.propTypes = {
    projectIds: PropTypes.array,
    options: PropTypes.object,
};

describe('useHydrateProjectsByIds', () => {
    let wrapper;
    let mockDispatch;

    function renderHook({
        currentProject = null,
        projects = {},
        projectsStatus = {},
        projectIds = [],
        options = undefined,
    } = {}) {
        useSelector.mockImplementation((selector) =>
            selector({
                data: {
                    currentProject,
                    projects,
                    projectsStatus,
                },
            })
        );

        wrapper = mount(
            <TestComponent projectIds={projectIds} options={options} />
        );
    }

    beforeEach(() => {
        jest.clearAllMocks();
        mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);
        useI18n.mockReturnValue({ locale: 'de' });
        fetchData.mockImplementation((...args) => ({
            type: 'FETCH_DATA',
            args,
        }));
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
            wrapper = null;
        }
    });

    it('does nothing when currentProject is missing', () => {
        renderHook({ projectIds: [1, 2] });

        expect(fetchData).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('hydrates unique truthy project IDs by default', () => {
        const currentProject = { id: 99, shortname: 'ohd' };

        renderHook({
            currentProject,
            projectIds: [1, 1, '2', null, undefined, 0, ''],
            projects: {},
            projectsStatus: {},
        });

        expect(fetchData).toHaveBeenCalledTimes(2);
        expect(fetchData).toHaveBeenNthCalledWith(
            1,
            { locale: 'de', project: currentProject },
            'projects',
            1
        );
        expect(fetchData).toHaveBeenNthCalledWith(
            2,
            { locale: 'de', project: currentProject },
            'projects',
            2
        );
        expect(mockDispatch).toHaveBeenCalledTimes(2);
    });

    it('skips IDs that are already fetching', () => {
        const currentProject = { id: 99, shortname: 'ohd' };

        renderHook({
            currentProject,
            projectIds: [1, 2],
            projects: {},
            projectsStatus: { 1: 'fetching-2024-01-01' },
        });

        expect(fetchData).toHaveBeenCalledTimes(1);
        expect(fetchData).toHaveBeenCalledWith(
            { locale: 'de', project: currentProject },
            'projects',
            2
        );
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('supports custom needsHydration predicate for existing projects', () => {
        const currentProject = { id: 99, shortname: 'ohd' };
        const needsHydration = jest.fn(
            (project) => project && project.isLite === true
        );

        renderHook({
            currentProject,
            projectIds: [5],
            projects: { 5: { id: 5, isLite: true } },
            projectsStatus: {},
            options: { needsHydration },
        });

        expect(needsHydration).toHaveBeenCalledWith({ id: 5, isLite: true });
        expect(fetchData).toHaveBeenCalledTimes(1);
        expect(fetchData).toHaveBeenCalledWith(
            { locale: 'de', project: currentProject },
            'projects',
            5
        );
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
});
