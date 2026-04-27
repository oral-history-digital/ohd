/**
 * Returns whether short interview titles should be visible for the current user.
 *
 * TODO: Use this helper in the following places to replace the current interview title visibility logic:
 * - app/javascript/modules/interview-preview/InterviewPreviewInner.js
 * - app/javascript/modules/interview-preview/InterviewListRow.js
 * - app/javascript/modules/auth/AuthShow.js
 * - possibly others
 */
export default function canShowFullInterviewTitle(
    interview,
    projectAccessGranted,
    currentUser,
    isAuthorized
) {
    if (!interview) {
        return false;
    }

    if (!interview.workflow_state) {
        return isAuthorized(interview, 'update');
    }

    const permitted = currentUser?.interview_permissions?.some(
        (permission) => permission.interview_id === interview.id
    );
    const isPublic = interview.workflow_state === 'public';
    const isRestricted = interview.workflow_state === 'restricted';

    if (isAuthorized(interview, 'update')) {
        return true;
    }

    if (isPublic) {
        return true;
    }

    return projectAccessGranted && isRestricted && permitted;
}
