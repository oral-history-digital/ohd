import { useCallback } from 'react';

import { submitData } from 'modules/data';
import { sendTimeChangeRequest, updateIsPlaying } from 'modules/media-player';
import { useDispatch } from 'react-redux';

/**
 * Manages all user interaction handlers for a segment.
 *
 * Consolidates handlers for:
 * - Form changes and submissions
 * - Segment clicking
 * - Edit mode lifecycle
 *
 * @param {Object} options - Configuration options
 * @param {Object} options.segment - The segment with id, tape_nbr, time
 * @param {Object} options.interview - Interview object with transcript_coupled flag
 * @param {Array} options.tabs - Tab objects available in edit mode
 * @param {Function} options.onUnsavedChangesChange - Parent callback for form dirty state
 * @param {Function} options.onEditStart - Parent callback when entering edit mode
 * @param {Function} options.onEditEnd - Parent callback when exiting edit mode
 * @param {Function} options.setTabIndex - State setter for active tab
 *
 * @returns {Object} Object with handler functions:
 *   - handleFormChange
 *   - handleSubmitData
 *   - handleSegmentClick
 *   - handleEditStart
 *   - handleEditCancel
 *   - handleEditSubmit
 */
export function useSegmentInteraction({
    segment,
    interview,
    tabs,
    onUnsavedChangesChange,
    onEditStart,
    onEditEnd,
    setTabIndex,
}) {
    const dispatch = useDispatch();

    const handleFormChange = useCallback(
        ({ isDirty, hasValidationErrors }) => {
            onUnsavedChangesChange?.(isDirty || hasValidationErrors);
            // dirtyFields is available if needed for more granular control
        },
        [onUnsavedChangesChange]
    );

    const handleSubmitData = useCallback(
        (props, params) => dispatch(submitData(props, params)),
        [dispatch]
    );

    const handleSegmentClick = useCallback(() => {
        if (interview?.transcript_coupled) {
            dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
        }
    }, [
        dispatch,
        interview?.transcript_coupled,
        segment.tape_nbr,
        segment.time,
    ]);

    const handleEditStart = useCallback(
        (buttonType = 'edit') => {
            // Stop playback when entering edit mode
            dispatch(updateIsPlaying(false));
            // Jump to this segment's time when entering edit mode
            if (interview?.transcript_coupled) {
                dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
            }
            onEditStart?.(segment.id);
            // Set the tab index based on which button was clicked
            const index = tabs.findIndex((tab) => tab.id === buttonType);
            if (index !== -1) {
                setTabIndex(index);
            }
        },
        [
            dispatch,
            interview?.transcript_coupled,
            segment.tape_nbr,
            segment.time,
            segment.id,
            onEditStart,
            tabs,
            setTabIndex,
        ]
    );

    const handleEditCancel = useCallback(() => {
        onEditEnd?.();
    }, [onEditEnd]);

    const handleEditSubmit = useCallback(() => {
        // Keep edit mode active after save for consistent behavior across tabs.
    }, []);

    return {
        handleFormChange,
        handleSubmitData,
        handleSegmentClick,
        handleEditStart,
        handleEditCancel,
        handleEditSubmit,
    };
}
