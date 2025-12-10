import { useMemo } from 'react';

import curry from 'lodash.curry';
import { getCollections, getPublicProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useSelector } from 'react-redux';

import mapCollection from './mappers/mapCollection';
import rowComparator from './rowComparator';
import addChildCollections from './tree-builders/addChildCollections';

export default function useArchiveData(projectId) {
    const projects = useSelector(getPublicProjects);
    const collections = Object.values(useSelector(getCollections));
    const { locale } = useI18n();

    const data = useMemo(() => {
        const project = projects.find((p) => p.id === projectId);
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
