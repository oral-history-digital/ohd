import { useEffect } from 'react';

import { getEditView } from 'modules/archive';
import { useAuthorization, useProjectAccessStatus } from 'modules/auth';
import { fetchData, getInterviewsStatus } from 'modules/data';
import { usePathBase, useProject } from 'modules/routes';
import { getIsLoggedIn } from 'modules/user';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Loads interview fields according to Redux project metadata and the user's access.
 * Waits for project settings; interview records continue through the existing request flow.
 *
 * @param {Object} options - Interview loading context.
 * @param {Object|undefined} options.interview - Cached interview, if available.
 * @param {string} options.archiveId - Public interview identifier.
 */
export default function useLoadInterviewData({ interview, archiveId }) {
    const { project, error } = useProject({ include: ['metadata_fields'] });
    const pathBase = usePathBase();
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const { isAuthorized } = useAuthorization();
    const canEditInterview = isAuthorized(interview, 'update');
    const hasInterview = Boolean(interview);
    const dispatch = useDispatch();
    const statuses = useSelector(getInterviewsStatus);
    const editView = useSelector(getEditView);
    const isLoggedIn = useSelector(getIsLoggedIn);
    const needsInterview = !statuses[archiveId];
    const metadataFields = project?.metadata_fields;

    useEffect(() => {
        if (!metadataFields || error || !archiveId) return;

        const metadataFieldObservations = metadataFields.find(
            (field) => field.name === 'observations'
        );
        const metadataFieldDescription = metadataFields.find(
            (field) => field.name === 'description'
        );
        if (needsInterview) {
            dispatch(fetchData({ pathBase }, 'interviews', archiveId));
        }
        if (
            hasInterview &&
            metadataFieldObservations?.display_on_landing_page
        ) {
            dispatch(
                fetchData({ pathBase }, 'interviews', archiveId, 'observations')
            );
        }
        if (hasInterview && metadataFieldDescription?.display_on_landing_page) {
            dispatch(
                fetchData({ pathBase }, 'interviews', archiveId, 'description')
            );
        }
        if (hasInterview && projectAccessGranted) {
            dispatch(fetchData({ pathBase }, 'interviews', archiveId, 'title'));
            dispatch(
                fetchData({ pathBase }, 'interviews', archiveId, 'short_title')
            );
            dispatch(
                fetchData({ pathBase }, 'interviews', archiveId, 'photos')
            );
            dispatch(
                fetchData(
                    { pathBase },
                    'interviews',
                    archiveId,
                    'registry_references'
                )
            );
            if (
                metadataFieldObservations?.use_in_details_view &&
                !metadataFieldObservations?.display_on_landing_page
            ) {
                dispatch(
                    fetchData(
                        { pathBase },
                        'interviews',
                        archiveId,
                        'observations'
                    )
                );
            }
            if (
                metadataFieldDescription?.use_in_details_view &&
                !metadataFieldDescription?.display_on_landing_page
            ) {
                dispatch(
                    fetchData(
                        { pathBase },
                        'interviews',
                        archiveId,
                        'description'
                    )
                );
            }
        }
        if (canEditInterview) {
            dispatch(
                fetchData(
                    { pathBase },
                    'interviews',
                    archiveId,
                    'reload_translations'
                )
            );
            if (
                !metadataFieldObservations?.use_in_details_view &&
                !metadataFieldObservations?.display_on_landing_page
            ) {
                dispatch(
                    fetchData(
                        { pathBase },
                        'interviews',
                        archiveId,
                        'observations'
                    )
                );
            }
            if (
                !metadataFieldDescription?.use_in_details_view &&
                !metadataFieldDescription?.display_on_landing_page
            ) {
                dispatch(
                    fetchData(
                        { pathBase },
                        'interviews',
                        archiveId,
                        'description'
                    )
                );
            }
        }
    }, [
        interview?.primary_language_id,
        dispatch,
        metadataFields,
        error,
        pathBase,
        archiveId,
        isLoggedIn,
        editView,
        hasInterview,
        needsInterview,
        projectAccessGranted,
        canEditInterview,
    ]);
}
