import { useEffect } from 'react';

import { getEditView } from 'modules/archive';
import {
    AuthShowContainer,
    AuthorizedContent,
    useAuthorization,
    useProjectAccessStatus,
} from 'modules/auth';
import { fetchData, getInterviewsStatus, getStatuses } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { getIsLoggedIn } from 'modules/user';
import { useDispatch, useSelector } from 'react-redux';

export default function useLoadInterviewData({ interview, archiveId }) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const { isAuthorized } = useAuthorization();
    const dispatch = useDispatch();
    const statuses = useSelector(getInterviewsStatus);
    const editView = useSelector(getEditView);
    const isLoggedIn = useSelector(getIsLoggedIn);
    const status = statuses[archiveId];
    const metadataFieldObservations = Object.values(
        project.metadata_fields
    ).find((m) => m.name === 'observations');
    const metadataFieldDescription = Object.values(
        project.metadata_fields
    ).find((m) => m.name === 'description');

    useEffect(() => {
        if (!status) {
            dispatch(
                fetchData(
                    { projectId, locale, project },
                    'interviews',
                    archiveId
                )
            );
        }
        if (interview && metadataFieldObservations?.display_on_landing_page) {
            dispatch(
                fetchData(
                    { projectId, locale, project },
                    'interviews',
                    archiveId,
                    'observations'
                )
            );
        }
        if (interview && metadataFieldDescription?.display_on_landing_page) {
            dispatch(
                fetchData(
                    { projectId, locale, project },
                    'interviews',
                    archiveId,
                    'description'
                )
            );
        }
        if (interview && projectAccessGranted) {
            dispatch(
                fetchData(
                    { projectId, locale, project },
                    'interviews',
                    archiveId,
                    'title'
                )
            );
            dispatch(
                fetchData(
                    { projectId, locale, project },
                    'interviews',
                    archiveId,
                    'short_title'
                )
            );
            dispatch(
                fetchData(
                    { projectId, locale, project },
                    'interviews',
                    archiveId,
                    'photos'
                )
            );
            dispatch(
                fetchData(
                    { projectId, locale, project },
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
                        { projectId, locale, project },
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
                        { projectId, locale, project },
                        'interviews',
                        archiveId,
                        'description'
                    )
                );
            }
        }
        if (isAuthorized(interview, 'update')) {
            dispatch(
                fetchData(
                    { projectId, locale, project },
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
                        { projectId, locale, project },
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
                        { projectId, locale, project },
                        'interviews',
                        archiveId,
                        'description'
                    )
                );
            }
        }
    }, [
        interview?.primary_language_id,
        projectId,
        locale,
        archiveId,
        isLoggedIn,
        editView,
        metadataFieldObservations,
        metadataFieldDescription,
    ]);
}
