import React from 'react';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useIsSegmentActive } from './useIsSegmentActive';

Enzyme.configure({ adapter: new Adapter() });

// Mock Redux
jest.mock('react-redux', () => ({
    useDispatch: () => {},
    useSelector: jest.fn(),
}));

// Mock interview helpers
jest.mock('modules/interview', () => ({
    getAutoScroll: (state) => state.autoScroll,
}));

jest.mock('modules/interview-helpers', () => ({
    isSegmentActive: jest.fn(),
}));

jest.mock('modules/media-player', () => ({
    getCurrentTape: (state) => state.currentTape,
    getMediaTime: (state) => state.currentTime,
}));

function TestComponent({ onRender, ...props }) {
    const result = useIsSegmentActive(props);

    React.useEffect(() => {
        onRender(result);
    }, [result, onRender]);

    return null;
}

TestComponent.propTypes = {
    segment: PropTypes.object.isRequired,
    interview: PropTypes.object,
    nextSegmentTape: PropTypes.number,
    nextSegmentTime: PropTypes.number,
    editingSegmentIdRef: PropTypes.object,
    onRender: PropTypes.func.isRequired,
};

describe('useIsSegmentActive', () => {
    let wrapper;
    let result;
    let isSegmentActiveMock;

    beforeAll(() => {
        const mockModule = jest.requireMock('modules/interview-helpers');
        isSegmentActiveMock = mockModule.isSegmentActive;
    });

    const render = (props) => {
        wrapper = mount(
            <TestComponent
                {...props}
                onRender={(r) => {
                    result = r;
                }}
            />
        );
    };

    afterEach(() => {
        if (wrapper) wrapper.unmount();
        result = null;
        jest.clearAllMocks();
    });

    it('returns false when interview is not transcript_coupled', () => {
        useSelector.mockImplementation((selector) => {
            const mockState = {
                autoScroll: true,
                currentTape: 1,
                currentTime: 15,
            };
            return selector(mockState);
        });

        const props = {
            segment: { tape_nbr: 1, time: 10 },
            interview: { transcript_coupled: false },
            nextSegmentTape: 1,
            nextSegmentTime: 20,
            editingSegmentIdRef: { current: null },
        };

        render(props);
        expect(result).toBe(false);
    });

    it('returns false when editingSegmentIdRef.current is not null', () => {
        isSegmentActiveMock.mockReturnValue(true);

        useSelector.mockImplementation((selector) => {
            const mockState = {
                autoScroll: true,
                currentTape: 1,
                currentTime: 15,
            };
            return selector(mockState);
        });

        const props = {
            segment: { tape_nbr: 1, time: 10 },
            interview: { transcript_coupled: true },
            nextSegmentTape: 1,
            nextSegmentTime: 20,
            editingSegmentIdRef: { current: 123 }, // Non-null
        };

        render(props);
        expect(result).toBe(false);
    });

    it('returns true when isSegmentActive returns true and editing ref is null', () => {
        isSegmentActiveMock.mockReturnValue(true);

        useSelector.mockImplementation((selector) => {
            const mockState = {
                autoScroll: true,
                currentTape: 1,
                currentTime: 15,
            };
            return selector(mockState);
        });

        const props = {
            segment: { tape_nbr: 1, time: 10 },
            interview: { transcript_coupled: true },
            nextSegmentTape: 1,
            nextSegmentTime: 20,
            editingSegmentIdRef: { current: null },
        };

        render(props);
        expect(result).toBe(true);
    });

    it('returns false when isSegmentActive returns false', () => {
        isSegmentActiveMock.mockReturnValue(false);

        useSelector.mockImplementation((selector) => {
            const mockState = {
                autoScroll: true,
                currentTape: 1,
                currentTime: 15,
            };
            return selector(mockState);
        });

        const props = {
            segment: { tape_nbr: 1, time: 10 },
            interview: { transcript_coupled: true },
            nextSegmentTape: 1,
            nextSegmentTime: 20,
            editingSegmentIdRef: { current: null },
        };

        render(props);
        expect(result).toBe(false);
    });

    it('passes correct parameters to isSegmentActive', () => {
        isSegmentActiveMock.mockReturnValue(true);

        useSelector.mockImplementation((selector) => {
            const mockState = {
                autoScroll: true,
                currentTape: 2,
                currentTime: 35,
            };
            return selector(mockState);
        });

        const segment = { tape_nbr: 2, time: 30 };
        const props = {
            segment,
            interview: { transcript_coupled: true },
            nextSegmentTape: 3,
            nextSegmentTime: 45,
            editingSegmentIdRef: { current: null },
        };

        render(props);

        expect(isSegmentActiveMock).toHaveBeenCalledWith(
            expect.objectContaining({
                thisSegmentTape: 2,
                thisSegmentTime: 30,
                nextSegmentTape: 3,
                nextSegmentTime: 45,
                currentTape: 2,
                currentTime: 35,
            })
        );
        expect(result).toBe(true);
    });

    it('handles null interview gracefully', () => {
        useSelector.mockImplementation((selector) => {
            const mockState = {
                autoScroll: true,
                currentTape: 1,
                currentTime: 15,
            };
            return selector(mockState);
        });

        const props = {
            segment: { tape_nbr: 1, time: 10 },
            interview: null,
            nextSegmentTape: 1,
            nextSegmentTime: 20,
            editingSegmentIdRef: { current: null },
        };

        render(props);
        expect(result).toBe(false);
    });

    it('handles missing editingSegmentIdRef gracefully', () => {
        isSegmentActiveMock.mockReturnValue(true);

        useSelector.mockImplementation((selector) => {
            const mockState = {
                autoScroll: true,
                currentTape: 1,
                currentTime: 15,
            };
            return selector(mockState);
        });

        const props = {
            segment: { tape_nbr: 1, time: 10 },
            interview: { transcript_coupled: true },
            nextSegmentTape: 1,
            nextSegmentTime: 20,
            editingSegmentIdRef: undefined, // Missing ref returns false (safe default)
        };

        render(props);
        expect(result).toBe(false);
    });
});
