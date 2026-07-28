import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import useGetProjects from './useGetProjects';
import { useHydrateAllProjects } from './useHydrateAllProjects';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('modules/data', () => ({
    RECEIVE_DATA: 'RECEIVE_DATA',
    getProjects: (state) => state.data.projects,
}));

jest.mock('./useGetProjects', () => jest.fn());

function TestComponent({ options }) {
    useHydrateAllProjects(options);
    return null;
}

TestComponent.propTypes = {
    options: PropTypes.object,
};

describe('useHydrateAllProjects', () => {
    let wrapper;
    let mockDispatch;

    function renderHook({ projects = {}, fetchedProjects = [], options } = {}) {
        useSelector.mockImplementation((selector) =>
            selector({ data: { projects } })
        );
        useGetProjects.mockReturnValue({
            projects: fetchedProjects,
            isLoading: false,
        });

        wrapper = mount(<TestComponent options={options} />);
    }

    beforeEach(() => {
        jest.clearAllMocks();
        mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
            wrapper = null;
        }
    });

    it('requests the complete project list', () => {
        renderHook();

        expect(useGetProjects).toHaveBeenCalledWith({
            all: true,
            enabled: true,
            includeUmbrella: false,
        });
    });

    it('passes options on to useGetProjects', () => {
        renderHook({ options: { enabled: false, includeUmbrella: true } });

        expect(useGetProjects).toHaveBeenCalledWith({
            all: true,
            enabled: false,
            includeUmbrella: true,
        });
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('backfills projects that are missing from the store', () => {
        renderHook({
            projects: { 1: { id: 1, name: { de: 'Projekt 1' } } },
            fetchedProjects: [
                { id: 1, name: 'Projekt 1' },
                { id: 2, name: 'Projekt 2' },
            ],
        });

        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'RECEIVE_DATA',
            dataType: 'projects',
            data: { 2: { id: 2, name: 'Projekt 2', type: 'Project' } },
        });
    });

    it('does not dispatch when all projects are already in the store', () => {
        renderHook({
            projects: { 1: { id: 1 }, 2: { id: 2 } },
            fetchedProjects: [{ id: 1 }, { id: 2 }],
        });

        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch when the list is empty', () => {
        renderHook({ fetchedProjects: [] });

        expect(mockDispatch).not.toHaveBeenCalled();
    });
});
