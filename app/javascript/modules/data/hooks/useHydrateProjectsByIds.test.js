import { renderHook } from '@testing-library/react';
import { fetchData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useDispatch, useSelector } from 'react-redux';

import { useHydrateProjectsByIds } from './useHydrateProjectsByIds';

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

describe('useHydrateProjectsByIds', () => {
    let mockDispatch;

    function renderUseHydrateProjectsByIds({
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

        renderHook(() => useHydrateProjectsByIds(projectIds, options));
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

    it('does nothing when currentProject is missing', () => {
        renderUseHydrateProjectsByIds({ projectIds: [1, 2] });

        expect(fetchData).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('hydrates unique truthy project IDs by default', () => {
        const currentProject = { id: 99, shortname: 'ohd' };

        renderUseHydrateProjectsByIds({
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

        renderUseHydrateProjectsByIds({
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

        renderUseHydrateProjectsByIds({
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
