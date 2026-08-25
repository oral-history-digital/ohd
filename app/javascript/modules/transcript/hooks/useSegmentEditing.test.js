import { act, renderHook } from '@testing-library/react';

import { useSegmentEditing } from './useSegmentEditing';

jest.mock('modules/media-player', () => ({
    togglePlayerWidth: jest.fn(),
}));

describe('useSegmentEditing', () => {
    let result;

    const render = () => {
        result = renderHook(() => useSegmentEditing()).result;
    };

    afterEach(() => {
        result = null;
    });

    it('initializes editingSegmentId to null', () => {
        render();
        expect(result.current.editingSegmentId).toBeNull();
    });

    it('initializes editingSegmentHasUnsavedChanges to false', () => {
        render();
        expect(result.current.editingSegmentHasUnsavedChanges).toBe(false);
    });

    it('initializes showUnsavedWarning to false', () => {
        render();
        expect(result.current.showUnsavedWarning).toBe(false);
    });

    it('provides editingSegmentIdRef', () => {
        render();
        expect(result.current.editingSegmentIdRef).toBeDefined();
        expect(typeof result.current.editingSegmentIdRef.current).not.toBe(
            'undefined'
        );
    });

    it('provides handleEditStart function', () => {
        render();
        expect(typeof result.current.handleEditStart).toBe('function');
    });

    it('provides handleEditEnd function', () => {
        render();
        expect(typeof result.current.handleEditEnd).toBe('function');
    });

    it('provides handleUnsavedChangesAttempt function', () => {
        render();
        expect(typeof result.current.handleUnsavedChangesAttempt).toBe(
            'function'
        );
    });

    it('provides setEditingSegmentId function', () => {
        render();
        expect(typeof result.current.setEditingSegmentId).toBe('function');
    });

    it('provides setEditingSegmentHasUnsavedChanges function', () => {
        render();
        expect(typeof result.current.setEditingSegmentHasUnsavedChanges).toBe(
            'function'
        );
    });

    it('provides setShowUnsavedWarning function', () => {
        render();
        expect(typeof result.current.setShowUnsavedWarning).toBe('function');
    });

    it('provides dismissUnsavedWarning function', () => {
        render();
        expect(typeof result.current.dismissUnsavedWarning).toBe('function');
    });

    it('provides continueAfterUnsavedWarning function', () => {
        render();
        expect(typeof result.current.continueAfterUnsavedWarning).toBe(
            'function'
        );
    });

    it('editingSegmentIdRef.current reflects initial null state', () => {
        render();
        expect(result.current.editingSegmentIdRef.current).toBeNull();
    });

    it('handleEditEnd returns true and closes when there are no unsaved changes', () => {
        render();

        act(() => {
            result.current.setEditingSegmentId(1);
        });

        let editEnded;
        act(() => {
            editEnded = result.current.handleEditEnd();
        });

        expect(editEnded).toBe(true);
    });

    it('handleEditEnd returns false and shows warning when unsaved changes exist', () => {
        render();

        act(() => {
            result.current.setEditingSegmentId(1);
            result.current.setEditingSegmentHasUnsavedChanges(true);
        });

        let editEnded;
        act(() => {
            editEnded = result.current.handleEditEnd();
        });

        expect(editEnded).toBe(false);
        expect(result.current.showUnsavedWarning).toBe(true);
    });

    it('continueAfterUnsavedWarning executes pending action and clears warning', () => {
        render();
        const onContinue = jest.fn();

        act(() => {
            result.current.setEditingSegmentHasUnsavedChanges(true);
        });

        let continued;
        act(() => {
            continued = result.current.handleUnsavedChangesAttempt(onContinue);
        });

        expect(continued).toBe(false);
        expect(result.current.showUnsavedWarning).toBe(true);

        act(() => {
            result.current.continueAfterUnsavedWarning();
        });

        expect(onContinue).toHaveBeenCalledTimes(1);
        expect(result.current.showUnsavedWarning).toBe(false);
        expect(result.current.editingSegmentHasUnsavedChanges).toBe(false);
    });
});
