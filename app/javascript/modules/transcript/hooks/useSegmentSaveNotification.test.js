import { act, renderHook } from '@testing-library/react';
import { useSelector } from 'react-redux';

import { useSegmentSaveNotification } from './useSegmentSaveNotification';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

jest.mock('modules/i18n', () => ({
    useI18n: jest.fn(() => ({
        t: (key) => key,
    })),
}));

describe('useSegmentSaveNotification', () => {
    let result;
    let rerenderHook;
    let currentProps;
    let mockStatuses;

    beforeEach(() => {
        jest.clearAllMocks();
        mockStatuses = {};
        useSelector.mockImplementation(() => mockStatuses);
    });

    const render = (props = {}) => {
        currentProps = { segmentId: 1, ...props };
        const renderedHook = renderHook(
            ({ segmentId }) => useSegmentSaveNotification(segmentId),
            { initialProps: currentProps }
        );
        result = renderedHook.result;
        rerenderHook = renderedHook.rerender;
    };

    const rerender = (props = {}) => {
        currentProps = { ...currentProps, ...props };
        rerenderHook(currentProps);
    };

    afterEach(() => {
        result = null;
        rerenderHook = null;
        currentProps = null;
    });

    it('initializes with no notification and not saving', () => {
        render();

        expect(result.current.isSaving).toBe(false);
        expect(result.current.saveNotification).toBeNull();
    });

    it('sets success notification after pending save resolves as fetched', () => {
        render();

        act(() => {
            result.current.handleSaveStart();
        });

        mockStatuses = { segments: { 1: 'fetching' } };
        rerender({ segmentId: 1 });
        expect(result.current.isSaving).toBe(true);
        expect(result.current.saveNotification).toBeNull();

        mockStatuses = { segments: { 1: 'fetched-123' } };
        rerender({ segmentId: 1 });

        expect(result.current.isSaving).toBe(false);
        expect(result.current.saveNotification).toEqual({
            variant: 'success',
            title: 'modules.forms.save_success',
            autoHideDuration: 1000,
        });
    });

    it('sets error notification after pending save resolves as error', () => {
        render();

        act(() => {
            result.current.handleSaveStart();
        });

        mockStatuses = { segments: { 1: 'fetching' } };
        rerender({ segmentId: 1 });

        mockStatuses = { segments: { 1: 'error-123' } };
        rerender({ segmentId: 1 });

        expect(result.current.isSaving).toBe(false);
        expect(result.current.saveNotification).toEqual({
            variant: 'error',
            title: 'modules.forms.save_error',
        });
    });

    it('dismisses notification', () => {
        render();

        act(() => {
            result.current.handleSaveStart();
        });
        mockStatuses = { segments: { 1: 'fetching' } };
        rerender({ segmentId: 1 });
        mockStatuses = { segments: { 1: 'fetched-123' } };
        rerender({ segmentId: 1 });

        expect(result.current.saveNotification).not.toBeNull();

        act(() => {
            result.current.dismissSaveNotification();
        });

        expect(result.current.saveNotification).toBeNull();
    });

    it('resets notification when segment id changes', () => {
        render({ segmentId: 1 });

        act(() => {
            result.current.handleSaveStart();
        });
        mockStatuses = { segments: { 1: 'fetching' } };
        rerender({ segmentId: 1 });
        mockStatuses = { segments: { 1: 'fetched-123' } };
        rerender({ segmentId: 1 });
        expect(result.current.saveNotification).not.toBeNull();

        mockStatuses = { segments: { 2: 'fetched-456' } };
        rerender({ segmentId: 2 });

        expect(result.current.saveNotification).toBeNull();
    });

    it('does not show success from stale fetched status before a new request starts', () => {
        render();

        // Existing fetched status from a previous save should not trigger success.
        mockStatuses = { segments: { 1: 'fetched-previous' } };
        rerender({ segmentId: 1 });

        act(() => {
            result.current.handleSaveStart();
        });
        rerender({ segmentId: 1 });

        expect(result.current.saveNotification).toBeNull();
        expect(result.current.isSaving).toBe(false);

        // After a real request cycle (fetching -> fetched), success appears.
        mockStatuses = { segments: { 1: 'fetching' } };
        rerender({ segmentId: 1 });
        mockStatuses = { segments: { 1: 'fetched-current' } };
        rerender({ segmentId: 1 });

        expect(result.current.saveNotification).toEqual({
            variant: 'success',
            title: 'modules.forms.save_success',
            autoHideDuration: 1000,
        });
    });

    it('shows error notification when only global segment status transitions to error', () => {
        render();

        act(() => {
            result.current.handleSaveStart();
        });

        mockStatuses = { segments: { all: 'fetching' } };
        rerender({ segmentId: 1 });
        expect(result.current.isSaving).toBe(true);

        mockStatuses = { segments: { all: 'error-404' } };
        rerender({ segmentId: 1 });

        expect(result.current.isSaving).toBe(false);
        expect(result.current.saveNotification).toEqual({
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
            result.current.handleSaveStart();
        });

        // New request goes through global status path (e.g. POST fallback).
        mockStatuses = { segments: { 1: 'fetched-previous', all: 'fetching' } };
        rerender({ segmentId: 1 });
        expect(result.current.isSaving).toBe(true);

        mockStatuses = {
            segments: { 1: 'fetched-previous', all: 'error-404' },
        };
        rerender({ segmentId: 1 });

        expect(result.current.isSaving).toBe(false);
        expect(result.current.saveNotification).toEqual({
            variant: 'error',
            title: 'modules.forms.save_error',
        });
    });
});
