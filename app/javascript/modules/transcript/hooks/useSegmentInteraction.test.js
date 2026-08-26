import { renderHook } from '@testing-library/react';
import { useDispatch } from 'react-redux';

import { useSegmentInteraction } from './useSegmentInteraction';

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

describe('useSegmentInteraction', () => {
    let result;
    let rerender;
    let currentProps;
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
        currentProps = { ...defaultProps, ...props };
        const renderedHook = renderHook(
            (hookProps) => useSegmentInteraction(hookProps),
            { initialProps: currentProps }
        );
        result = renderedHook.result;
        rerender = renderedHook.rerender;
    };

    afterEach(() => {
        result = null;
        rerender = null;
        currentProps = null;
    });

    it('returns object with all handler functions', () => {
        render();

        expect(result.current).toHaveProperty('handleFormChange');
        expect(result.current).toHaveProperty('handleSubmitData');
        expect(result.current).toHaveProperty('handleSegmentClick');
        expect(result.current).toHaveProperty('handleEditStart');
        expect(result.current).toHaveProperty('handleEditCancel');
        expect(result.current).toHaveProperty('handleEditSubmit');
    });

    it('handleFormChange calls onUnsavedChangesChange when isDirty is true', () => {
        render();

        result.current.handleFormChange({
            isDirty: true,
            hasValidationErrors: false,
        });
        expect(defaultProps.onUnsavedChangesChange).toHaveBeenCalledWith(true);
    });

    it('handleFormChange calls onUnsavedChangesChange when hasValidationErrors is true', () => {
        render();

        result.current.handleFormChange({
            isDirty: false,
            hasValidationErrors: true,
        });
        expect(defaultProps.onUnsavedChangesChange).toHaveBeenCalledWith(true);
    });

    it('handleFormChange calls onUnsavedChangesChange with false when neither isDirty nor hasValidationErrors', () => {
        render();

        result.current.handleFormChange({
            isDirty: false,
            hasValidationErrors: false,
        });
        expect(defaultProps.onUnsavedChangesChange).toHaveBeenCalledWith(false);
    });

    it('handleSubmitData dispatches submitData action', () => {
        render();

        const props = { field: 'value' };
        const params = { param: 'param_value' };

        result.current.handleSubmitData(props, params);
        expect(mockDispatch).toHaveBeenCalled();
    });

    it('handleSegmentClick dispatches sendTimeChangeRequest when transcript_coupled', () => {
        render();

        result.current.handleSegmentClick();
        expect(mockDispatch).toHaveBeenCalled();

        const dispatchedAction = mockDispatch.mock.calls[0][0];
        expect(dispatchedAction.type).toBe('SEND_TIME_CHANGE_REQUEST');
        expect(dispatchedAction.payload).toEqual({ tape: 2, time: 30 });
    });

    it('handleSegmentClick does not dispatch when transcript_coupled is false', () => {
        render({ interview: { transcript_coupled: false } });
        mockDispatch.mockClear();

        result.current.handleSegmentClick();
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('handleSegmentClick does not dispatch when interview is null', () => {
        render({ interview: null });
        mockDispatch.mockClear();

        result.current.handleSegmentClick();
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('handleEditStart stops playback', () => {
        render();
        mockDispatch.mockClear();

        result.current.handleEditStart();

        const dispatchedActions = mockDispatch.mock.calls.map(
            (call) => call[0].type
        );
        expect(dispatchedActions).toContain('UPDATE_IS_PLAYING');
    });

    it('handleEditStart sends time change request when transcript_coupled', () => {
        render();
        mockDispatch.mockClear();

        result.current.handleEditStart();

        const dispatchedActions = mockDispatch.mock.calls.map(
            (call) => call[0].type
        );
        expect(dispatchedActions).toContain('SEND_TIME_CHANGE_REQUEST');
    });

    it('handleEditStart calls onEditStart with segment id', () => {
        render();

        result.current.handleEditStart();
        expect(defaultProps.onEditStart).toHaveBeenCalledWith(1);
    });

    it('handleEditStart sets tab index to 0 by default (edit tab)', () => {
        render();

        result.current.handleEditStart();
        expect(defaultProps.setTabIndex).toHaveBeenCalledWith(0);
    });

    it('handleEditStart sets tab index based on buttonType', () => {
        render();

        result.current.handleEditStart('annotations');
        expect(defaultProps.setTabIndex).toHaveBeenCalledWith(1);
    });

    it('handleEditStart does not set tab index if buttonType not found', () => {
        render();

        result.current.handleEditStart('nonexistent');
        expect(defaultProps.setTabIndex).not.toHaveBeenCalled();
    });

    it('handleEditCancel calls onEditEnd', () => {
        render();

        result.current.handleEditCancel();
        expect(defaultProps.onEditEnd).toHaveBeenCalled();
    });

    it('handleEditSubmit keeps edit mode active', () => {
        render();

        result.current.handleEditSubmit();
        expect(defaultProps.onEditEnd).not.toHaveBeenCalled();
        expect(defaultProps.onUnsavedChangesChange).toHaveBeenCalledWith(false);
    });

    it('handles missing callbacks gracefully', () => {
        render({
            onUnsavedChangesChange: undefined,
            onEditStart: undefined,
            onEditEnd: undefined,
        });

        expect(() => {
            result.current.handleFormChange({
                isDirty: true,
                hasValidationErrors: false,
            });
            result.current.handleEditStart();
            result.current.handleEditCancel();
            result.current.handleEditSubmit();
        }).not.toThrow();
    });

    it('maintains stable function references', () => {
        render();
        const firstHandleFormChange = result.current.handleFormChange;

        rerender(currentProps);

        expect(result.current.handleFormChange).toBe(firstHandleFormChange);
    });
});
