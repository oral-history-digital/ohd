import React from 'react';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { useSegmentInteraction } from './useSegmentInteraction';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('modules/media-player', () => ({
    sendTimeChangeRequest: jest.fn((tape, time) => ({
        type: 'SEND_TIME_CHANGE_REQUEST',
        payload: { tape, time },
    })),
    updateIsPlaying: jest.fn((isPlaying) => ({
        type: 'UPDATE_IS_PLAYING',
        payload: isPlaying,
    })),
}));

jest.mock('modules/data', () => ({
    submitData: jest.fn((props, params) => ({
        type: 'SUBMIT_DATA',
        payload: { props, params },
    })),
}));

function TestComponent({ onRender, ...props }) {
    const result = useSegmentInteraction(props);

    React.useEffect(() => {
        onRender(result);
    }, [result, onRender]);

    return null;
}

TestComponent.propTypes = {
    segment: PropTypes.object.isRequired,
    interview: PropTypes.object,
    tabs: PropTypes.array.isRequired,
    onUnsavedChangesChange: PropTypes.func,
    onEditStart: PropTypes.func,
    onEditEnd: PropTypes.func,
    setTabIndex: PropTypes.func.isRequired,
    onRender: PropTypes.func.isRequired,
};

describe('useSegmentInteraction', () => {
    let wrapper;
    let lastResult;
    let mockDispatch;
    let defaultProps;

    beforeEach(() => {
        jest.clearAllMocks();
        mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);

        defaultProps = {
            segment: { id: 1, tape_nbr: 2, time: 30 },
            interview: { transcript_coupled: true },
            tabs: [
                { id: 'edit', label: 'Edit' },
                { id: 'annotations', label: 'Annotations' },
            ],
            onUnsavedChangesChange: jest.fn(),
            onEditStart: jest.fn(),
            onEditEnd: jest.fn(),
            setTabIndex: jest.fn(),
        };
    });

    const render = (props = {}) => {
        const mergedProps = { ...defaultProps, ...props };
        wrapper = mount(
            <TestComponent
                {...mergedProps}
                onRender={(r) => {
                    lastResult = r;
                }}
            />
        );
    };

    afterEach(() => {
        if (wrapper) wrapper.unmount();
        lastResult = null;
    });

    it('returns object with all handler functions', () => {
        render();

        expect(lastResult).toHaveProperty('handleFormChange');
        expect(lastResult).toHaveProperty('handleSubmitData');
        expect(lastResult).toHaveProperty('handleSegmentClick');
        expect(lastResult).toHaveProperty('handleEditStart');
        expect(lastResult).toHaveProperty('handleEditCancel');
        expect(lastResult).toHaveProperty('handleEditSubmit');
    });

    it('handleFormChange calls onUnsavedChangesChange when isDirty is true', () => {
        render();

        lastResult.handleFormChange({
            isDirty: true,
            hasValidationErrors: false,
        });
        expect(defaultProps.onUnsavedChangesChange).toHaveBeenCalledWith(true);
    });

    it('handleFormChange calls onUnsavedChangesChange when hasValidationErrors is true', () => {
        render();

        lastResult.handleFormChange({
            isDirty: false,
            hasValidationErrors: true,
        });
        expect(defaultProps.onUnsavedChangesChange).toHaveBeenCalledWith(true);
    });

    it('handleFormChange calls onUnsavedChangesChange with false when neither isDirty nor hasValidationErrors', () => {
        render();

        lastResult.handleFormChange({
            isDirty: false,
            hasValidationErrors: false,
        });
        expect(defaultProps.onUnsavedChangesChange).toHaveBeenCalledWith(false);
    });

    it('handleSubmitData dispatches submitData action', () => {
        render();

        const props = { field: 'value' };
        const params = { param: 'param_value' };

        lastResult.handleSubmitData(props, params);
        expect(mockDispatch).toHaveBeenCalled();
    });

    it('handleSegmentClick dispatches sendTimeChangeRequest when transcript_coupled', () => {
        render();

        lastResult.handleSegmentClick();
        expect(mockDispatch).toHaveBeenCalled();

        const dispatchedAction = mockDispatch.mock.calls[0][0];
        expect(dispatchedAction.type).toBe('SEND_TIME_CHANGE_REQUEST');
        expect(dispatchedAction.payload).toEqual({ tape: 2, time: 30 });
    });

    it('handleSegmentClick does not dispatch when transcript_coupled is false', () => {
        render({ interview: { transcript_coupled: false } });
        mockDispatch.mockClear();

        lastResult.handleSegmentClick();
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('handleSegmentClick does not dispatch when interview is null', () => {
        render({ interview: null });
        mockDispatch.mockClear();

        lastResult.handleSegmentClick();
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('handleEditStart stops playback', () => {
        render();
        mockDispatch.mockClear();

        lastResult.handleEditStart();

        const dispatchedActions = mockDispatch.mock.calls.map(
            (call) => call[0].type
        );
        expect(dispatchedActions).toContain('UPDATE_IS_PLAYING');
    });

    it('handleEditStart sends time change request when transcript_coupled', () => {
        render();
        mockDispatch.mockClear();

        lastResult.handleEditStart();

        const dispatchedActions = mockDispatch.mock.calls.map(
            (call) => call[0].type
        );
        expect(dispatchedActions).toContain('SEND_TIME_CHANGE_REQUEST');
    });

    it('handleEditStart calls onEditStart with segment id', () => {
        render();

        lastResult.handleEditStart();
        expect(defaultProps.onEditStart).toHaveBeenCalledWith(1);
    });

    it('handleEditStart sets tab index to 0 by default (edit tab)', () => {
        render();

        lastResult.handleEditStart();
        expect(defaultProps.setTabIndex).toHaveBeenCalledWith(0);
    });

    it('handleEditStart sets tab index based on buttonType', () => {
        render();

        lastResult.handleEditStart('annotations');
        expect(defaultProps.setTabIndex).toHaveBeenCalledWith(1);
    });

    it('handleEditStart does not set tab index if buttonType not found', () => {
        render();

        lastResult.handleEditStart('nonexistent');
        expect(defaultProps.setTabIndex).not.toHaveBeenCalled();
    });

    it('handleEditCancel calls onEditEnd', () => {
        render();

        lastResult.handleEditCancel();
        expect(defaultProps.onEditEnd).toHaveBeenCalled();
    });

    it('handleEditSubmit keeps edit mode active', () => {
        render();

        lastResult.handleEditSubmit();
        expect(defaultProps.onEditEnd).not.toHaveBeenCalled();
    });

    it('handles missing callbacks gracefully', () => {
        render({
            onUnsavedChangesChange: undefined,
            onEditStart: undefined,
            onEditEnd: undefined,
        });

        expect(() => {
            lastResult.handleFormChange({
                isDirty: true,
                hasValidationErrors: false,
            });
            lastResult.handleEditStart();
            lastResult.handleEditCancel();
            lastResult.handleEditSubmit();
        }).not.toThrow();
    });

    it('maintains stable function references', () => {
        render();
        const firstHandleFormChange = lastResult.handleFormChange;

        wrapper.setProps({
            onRender: (r) => {
                lastResult = r;
            },
        });

        expect(lastResult.handleFormChange).toBe(firstHandleFormChange);
    });
});
