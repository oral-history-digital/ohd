import { useEffect } from 'react';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { act } from 'react-dom/test-utils';
import { useSelector } from 'react-redux';

import { useSegmentSaveNotification } from './useSegmentSaveNotification';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

jest.mock('modules/i18n', () => ({
    useI18n: jest.fn(() => ({
        t: (key) => key,
    })),
}));

function TestComponent({ segmentId, onRender }) {
    const result = useSegmentSaveNotification(segmentId);

    useEffect(() => {
        onRender(result);
    }, [result, onRender]);

    return null;
}

TestComponent.propTypes = {
    segmentId: PropTypes.number,
    onRender: PropTypes.func.isRequired,
};

describe('useSegmentSaveNotification', () => {
    let wrapper;
    let lastResult;
    let mockStatuses;

    beforeEach(() => {
        jest.clearAllMocks();
        mockStatuses = {};
        useSelector.mockImplementation(() => mockStatuses);
    });

    const render = (props = {}) => {
        const mergedProps = { segmentId: 1, ...props };
        wrapper = mount(
            <TestComponent
                {...mergedProps}
                onRender={(r) => {
                    lastResult = r;
                }}
            />
        );
    };

    const rerender = (props = {}) => {
        wrapper.setProps({
            ...props,
            onRender: (r) => {
                lastResult = r;
            },
        });
        wrapper.update();
    };

    afterEach(() => {
        if (wrapper) wrapper.unmount();
        lastResult = null;
    });

    it('initializes with no notification and not saving', () => {
        render();

        expect(lastResult.isSaving).toBe(false);
        expect(lastResult.saveNotification).toBeNull();
    });

    it('sets success notification after pending save resolves as fetched', () => {
        render();

        lastResult.handleSaveStart();

        mockStatuses = { segments: { 1: 'fetching' } };
        rerender({ segmentId: 1 });
        expect(lastResult.isSaving).toBe(true);
        expect(lastResult.saveNotification).toBeNull();

        mockStatuses = { segments: { 1: 'fetched-123' } };
        rerender({ segmentId: 1 });

        expect(lastResult.isSaving).toBe(false);
        expect(lastResult.saveNotification).toEqual({
            variant: 'success',
            title: 'modules.forms.save_success',
            autoHideDuration: 1000,
        });
    });

    it('sets error notification after pending save resolves as error', () => {
        render();

        lastResult.handleSaveStart();

        mockStatuses = { segments: { 1: 'fetching' } };
        rerender({ segmentId: 1 });

        mockStatuses = { segments: { 1: 'error-123' } };
        rerender({ segmentId: 1 });

        expect(lastResult.isSaving).toBe(false);
        expect(lastResult.saveNotification).toEqual({
            variant: 'error',
            title: 'modules.forms.save_error',
        });
    });

    it('dismisses notification', () => {
        render();

        act(() => {
            lastResult.handleSaveStart();
        });
        mockStatuses = { segments: { 1: 'fetching' } };
        rerender({ segmentId: 1 });
        mockStatuses = { segments: { 1: 'fetched-123' } };
        rerender({ segmentId: 1 });

        expect(lastResult.saveNotification).not.toBeNull();

        act(() => {
            lastResult.dismissSaveNotification();
        });
        wrapper.update();

        expect(lastResult.saveNotification).toBeNull();
    });

    it('resets notification when segment id changes', () => {
        render({ segmentId: 1 });

        act(() => {
            lastResult.handleSaveStart();
        });
        mockStatuses = { segments: { 1: 'fetching' } };
        rerender({ segmentId: 1 });
        mockStatuses = { segments: { 1: 'fetched-123' } };
        rerender({ segmentId: 1 });
        expect(lastResult.saveNotification).not.toBeNull();

        mockStatuses = { segments: { 2: 'fetched-456' } };
        rerender({ segmentId: 2 });

        expect(lastResult.saveNotification).toBeNull();
    });

    it('does not show success from stale fetched status before a new request starts', () => {
        render();

        // Existing fetched status from a previous save should not trigger success.
        mockStatuses = { segments: { 1: 'fetched-previous' } };
        rerender({ segmentId: 1 });

        act(() => {
            lastResult.handleSaveStart();
        });
        rerender({ segmentId: 1 });

        expect(lastResult.saveNotification).toBeNull();
        expect(lastResult.isSaving).toBe(false);

        // After a real request cycle (fetching -> fetched), success appears.
        mockStatuses = { segments: { 1: 'fetching' } };
        rerender({ segmentId: 1 });
        mockStatuses = { segments: { 1: 'fetched-current' } };
        rerender({ segmentId: 1 });

        expect(lastResult.saveNotification).toEqual({
            variant: 'success',
            title: 'modules.forms.save_success',
            autoHideDuration: 1000,
        });
    });

    it('shows error notification when only global segment status transitions to error', () => {
        render();

        act(() => {
            lastResult.handleSaveStart();
        });

        mockStatuses = { segments: { all: 'fetching' } };
        rerender({ segmentId: 1 });
        expect(lastResult.isSaving).toBe(true);

        mockStatuses = { segments: { all: 'error-404' } };
        rerender({ segmentId: 1 });

        expect(lastResult.isSaving).toBe(false);
        expect(lastResult.saveNotification).toEqual({
            variant: 'error',
            title: 'modules.forms.save_error',
        });
    });

    it('shows global error even when segment status is stale fetched', () => {
        render();

        // Previous successful segment status is still present.
        mockStatuses = { segments: { 1: 'fetched-previous' } };
        rerender({ segmentId: 1 });

        act(() => {
            lastResult.handleSaveStart();
        });

        // New request goes through global status path (e.g. POST fallback).
        mockStatuses = { segments: { 1: 'fetched-previous', all: 'fetching' } };
        rerender({ segmentId: 1 });
        expect(lastResult.isSaving).toBe(true);

        mockStatuses = {
            segments: { 1: 'fetched-previous', all: 'error-404' },
        };
        rerender({ segmentId: 1 });

        expect(lastResult.isSaving).toBe(false);
        expect(lastResult.saveNotification).toEqual({
            variant: 'error',
            title: 'modules.forms.save_error',
        });
    });
});
