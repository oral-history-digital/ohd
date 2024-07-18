import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import curry from 'lodash.curry';

import { getPublicProjects, getCollections } from 'modules/data';
import { useI18n } from 'modules/i18n';
import addChildCollections from './tree-builders/addChildCollections';
import mapCollection from './mappers/mapCollection';
import rowComparator from './rowComparator';

export default function useArchiveData(projectId) {
    const projects = useSelector(getPublicProjects);
    const collections = Object.values(useSelector(getCollections));
    const { locale } = useI18n();

    const data = useMemo(() => {
        const project = projects.find(p => p.id === projectId);
        const projectWithChildren = addChildCollections(collections, project);
        const curriedMapCollection = curry(mapCollection)(locale);
        const collectionRows = projectWithChildren.collections
            .filter((collection) => collection.num_interviews > 0)
            .map(curriedMapCollection)
            .sort(rowComparator);

        return collectionRows;
    }, [projectId, JSON.stringify(projects), locale]);

    return data;
}
