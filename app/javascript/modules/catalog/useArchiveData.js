import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import { useSelector } from 'react-redux';
import curry from 'lodash.curry';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { getProjects, getCollections } from 'modules/data';
import { useI18n } from 'modules/i18n';
import addChildInterviews from './tree-builders/addChildInterviews';
import addChildCollections from './tree-builders/addChildCollections';
import mapCollection from './mappers/mapCollection';
import mapInterview from './mappers/mapInterview';
import rowComparator from './rowComparator';

export default function useArchiveData(projectId) {
    const pathBase = usePathBase();
    const path = `${pathBase}/catalog/archives/${projectId}`;

    const { isValidating, isLoading, data, error } = useSWRImmutable(path,
        fetcher);

    const projects = useSelector(getProjects);
    const projectsArray = Object.values(projects);
    const collections = Object.values(useSelector(getCollections));
    const { locale } = useI18n();

    const transformedData = useMemo(() => {
        if (!data) {
            return [];
        }

        const curriedAddChildInterviews = curry(addChildInterviews)(data);
        const collectionsWithChildren = collections.map(curriedAddChildInterviews);
        const project = projectsArray.find(p => p.id === projectId);
        const projectWithChildren = addChildCollections(collectionsWithChildren, project);
        const curriedMapCollection = curry(mapCollection)(locale);
        const collectionRows = projectWithChildren.collections
            .map(curriedMapCollection)
            .sort(rowComparator);

        const additionalInterviewRows = data
            .filter(interview => interview.collection_id === null)
            .map(interview => mapInterview(locale, interview))
            .sort(rowComparator);

        return collectionRows.concat(additionalInterviewRows);
    }, [projectId, projectsArray, data, locale]);

    return {
        data: transformedData,
        error,
        isLoading,
    };
}
