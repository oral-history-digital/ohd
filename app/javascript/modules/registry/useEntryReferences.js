import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import groupBy from 'lodash.groupby';

import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { getStatuses } from 'modules/data';
import { getInterviews, fetchData } from 'modules/data';
import { getIsLoggedIn } from 'modules/user';

export default function useEntryReferences(registryEntry) {
    const { locale } = useI18n();
    const { project, projectId } = useProject();
    const dispatch = useDispatch();
    const statuses = useSelector(getStatuses);
    const isLoggedIn = useSelector(getIsLoggedIn);
    const interviews = useSelector(getInterviews);

    useEffect(() => {
        archiveIds.forEach(archiveId => {
            if (!statuses['interviews'][archiveId]) {
                dispatch(
                    fetchData({ projectId, locale, project }, 'interviews', archiveId)
                );
            }
        })
    }, [isLoggedIn]);

    useEffect(() => {
        archiveIds.forEach(archiveId => {
            if (!statuses['title']?.[`for_interviews_${archiveId}`]) {
                dispatch(
                    fetchData({ projectId, locale, project }, 'interviews', archiveId, 'title')
                );
            }
        })
    }, [isLoggedIn]);

    const groupedReferences = groupBy(registryEntry.registry_references, 'archive_id');
    const referencesCount = Object.values(registryEntry.registry_references).length;
    const archiveIds = Object.keys(groupedReferences);
    const data = transformArchiveIds();
    data.sort((a, b) => a.title?.localeCompare(b.title));

    return {
        isLoading: loading(data),
        referencesCount,
        data,
    };

    function transformArchiveIds() {
        return archiveIds.map((archiveId) => ({
            archiveId,
            title: interviewTitleFor(archiveId),
            projectId: projectIdFor(archiveId),
            loaded: interviewLoaded(archiveId),
            segmentReferences: segmentReferencesFor(archiveId),
        }));
    }

    function interviewTitleFor(archiveId) {
        return isLoggedIn
            ? interviews[archiveId]?.title?.[locale]
            : interviews[archiveId]?.anonymous_title[locale];
    }

    function projectIdFor(archiveId) {
        return interviews[archiveId]?.project_id;
    }

    function interviewLoaded(archiveId) {
        return interviews[archiveId]?.project_id !== undefined;
    }

    function segmentReferencesFor(archiveId) {
        return groupedReferences[archiveId].filter(ref => ref.ref_object_type === 'Segment');
    }

    function loading(data) {
        return data.some(({ loaded }) => loaded === false);
    }
}
