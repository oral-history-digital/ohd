import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import curry from 'lodash.curry';

import { getInstitutions, getProjects, getCollections } from 'modules/data';
import { useI18n } from 'modules/i18n';
import addChildProjects from './tree-builders/addChildProjects';
import addChildCollections from './tree-builders/addChildCollections';
import buildInstitutionTree from './tree-builders/buildInstitutionTree';
import mapInstitution from './mappers/mapInstitution';

export default function useInstitutionData(institutionId) {
    const data = Object.values(useSelector(getInstitutions));
    const projects = Object.values(useSelector(getProjects));
    const collections = Object.values(useSelector(getCollections));
    const { locale } = useI18n();

    const transformedData = useMemo(() => {
        const curriedMapInstitution = curry(mapInstitution)(locale);
        const curriedAddChildCollections = curry(addChildCollections)(collections);
        const projectsWithChildren = projects.map(curriedAddChildCollections);
        const curriedAddChildProjects = curry(addChildProjects)(projectsWithChildren);
        const institutionsWithChildren = data.map(curriedAddChildProjects);
        const rootInstitution = institutionsWithChildren.find(i => i.id === institutionId);
        const institutionAsTree = buildInstitutionTree([rootInstitution], institutionsWithChildren);
        const institutionRows = institutionAsTree.map(curriedMapInstitution);

        return institutionRows[0].subRows;
    }, [institutionId, data, locale]);

    return {
        data: transformedData,
    };
}
