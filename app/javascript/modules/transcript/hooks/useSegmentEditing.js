import { useCallback, useRef, useState } from 'react';

import { togglePlayerWidth } from 'modules/media-player';

/**
 * Hook to manage the state and refs for segment editing.
 *
 * Provides:
 * - State for which segment is being edited
 * - State for unsaved changes tracking
 * - State for unsaved warning dialog
 * - Stable refs for reading editing state without causing re-renders
 * - Callbacks for starting and ending segment edits
 */
export function useSegmentEditing() {
    const [editingSegmentId, setEditingSegmentId] = useState(null);
    const [
        editingSegmentHasUnsavedChanges,
        setEditingSegmentHasUnsavedChanges,
    ] = useState(false);
    const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
    const pendingUnsavedActionRef = useRef(null);

    // Stable ref so EditableSegment can read whether any segment is being
    // edited without subscribing to it as a prop (which would cause all
    // segments to re-render when one edit opens/closes).
    const editingSegmentIdRef = useRef(editingSegmentId);
    editingSegmentIdRef.current = editingSegmentId;

    // Ref keeps the latest editing state readable inside stable callbacks
    // without listing them as deps (which would create a new function on every
    // edit-state change and defeat memo() on all segments).
    const editingStateRef = useRef({
        editingSegmentId,
        editingSegmentHasUnsavedChanges,
    });
    editingStateRef.current = {
        editingSegmentId,
        editingSegmentHasUnsavedChanges,
    };

    const handleUnsavedChangesAttempt = useCallback(
        (onContinue) => {
            const { editingSegmentHasUnsavedChanges: hasUnsaved } =
                editingStateRef.current;

            if (hasUnsaved) {
                pendingUnsavedActionRef.current =
                    typeof onContinue === 'function' ? onContinue : null;
                setShowUnsavedWarning(true);
                return false;
            }

            return true;
        },
        [] // no deps — reads mutable editing state through ref
    );

    const dismissUnsavedWarning = useCallback(() => {
        pendingUnsavedActionRef.current = null;
        setShowUnsavedWarning(false);
    }, []);

    const continueAfterUnsavedWarning = useCallback(() => {
        const pendingAction = pendingUnsavedActionRef.current;
        pendingUnsavedActionRef.current = null;
        setShowUnsavedWarning(false);
        setEditingSegmentHasUnsavedChanges(false);

        if (typeof pendingAction === 'function') {
            pendingAction();
        }
    }, []);

    const handleEditStart = useCallback(
        (segmentId) => {
            const { editingSegmentId: currentId } = editingStateRef.current;
            const startEditing = () => {
                togglePlayerWidth(true); // Switch to compact player when editing starts
                setEditingSegmentId(segmentId);
                setEditingSegmentHasUnsavedChanges(false);
            };

            if (
                currentId !== null &&
                !handleUnsavedChangesAttempt(startEditing)
            ) {
                return false;
            }

            startEditing();
            return true;
        },
        [handleUnsavedChangesAttempt]
    );

    const handleEditEnd = useCallback(() => {
        const endEditing = () => {
            setEditingSegmentId(null);
            setEditingSegmentHasUnsavedChanges(false);
        };

        if (!handleUnsavedChangesAttempt(endEditing)) {
            return false;
        }

        endEditing();
        return true;
    }, [handleUnsavedChangesAttempt]);

    return {
        editingSegmentId,
        setEditingSegmentId,
        editingSegmentHasUnsavedChanges,
        setEditingSegmentHasUnsavedChanges,
        showUnsavedWarning,
        setShowUnsavedWarning,
        dismissUnsavedWarning,
        continueAfterUnsavedWarning,
        editingSegmentIdRef,
        handleUnsavedChangesAttempt,
        handleEditStart,
        handleEditEnd,
    };
}
