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

    const handleEditStart = useCallback(
        (segmentId) => {
            const {
                editingSegmentId: currentId,
                editingSegmentHasUnsavedChanges: hasUnsaved,
            } = editingStateRef.current;
            if (currentId !== null && hasUnsaved) {
                setShowUnsavedWarning(true);
                return false;
            }
            togglePlayerWidth(true); // Switch to compact player when editing starts
            setEditingSegmentId(segmentId);
            setEditingSegmentHasUnsavedChanges(false);
            return true;
        },
        [] // no deps — all mutable values are read from editingStateRef; setters are stable
    );

    const handleEditEnd = useCallback(() => {
        setEditingSegmentId(null);
        setEditingSegmentHasUnsavedChanges(false);
    }, []);

    return {
        editingSegmentId,
        setEditingSegmentId,
        editingSegmentHasUnsavedChanges,
        setEditingSegmentHasUnsavedChanges,
        showUnsavedWarning,
        setShowUnsavedWarning,
        editingSegmentIdRef,
        handleEditStart,
        handleEditEnd,
    };
}
