import useSWRImmutable from 'swr/immutable';
import { useSelector } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { useProject } from 'modules/routes';
import { getIsLoggedIn } from 'modules/user';

export default function useEntryReferencesAlt(registryEntry) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const { project } = useProject();
    const isLoggedIn = useSelector(getIsLoggedIn);

    const path = `${pathBase}/registry_references/for_reg_entry/${registryEntry.id}?signed_in=${isLoggedIn}`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(path, fetcher);

    let interviewReferences, segmentReferences;


    if (data) {
        interviewReferences = data?.interview_references;
        segmentReferences = data?.segment_references;

        // Todo: Filter out duplicate interviews.

        // Create missing reference objects
        segmentReferences.forEach((segmentRef) => {
            if (!interviewReferences.find((interviewRef) =>
                interviewRef.archive_id === segmentRef.archiveId)) {
                interviewReferences.push({
                    archive_id: segmentRef.archive_id,
                    display_name: segmentRef.display_name,
                    first_name: segmentRef.first_name,
                    last_name: segmentRef.last_name,
                    project_id: segmentRef.project_id,
                });
            }
        });

        // Sort it
        interviewReferences.sort((a, b) =>
            a.last_name.localeCompare(b.last_name));

        console.log(interviewReferences, segmentReferences)

    }

    return {
        isLoading,
        isValidating,
        interviewReferences,
        segmentReferences,
        error,
    };
}
