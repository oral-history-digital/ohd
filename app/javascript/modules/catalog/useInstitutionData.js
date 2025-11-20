import { useMemo } from 'react';

import curry from 'lodash.curry';
import { getCollections, getInstitutions, getProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useSelector } from 'react-redux';

import mapInstitution from './mappers/mapInstitution';
import addChildCollections from './tree-builders/addChildCollections';
import addChildProjects from './tree-builders/addChildProjects';
import buildInstitutionTree from './tree-builders/buildInstitutionTree';

export default function useInstitutionData(institutionId) {
    const institutions = Object.values(useSelector(getInstitutions));
    const projects = Object.values(useSelector(getProjects));
    const collections = Object.values(useSelector(getCollections));
    const { locale } = useI18n();

    const data = useMemo(() => {
        const curriedMapInstitution = curry(mapInstitution)(locale);
        const curriedAddChildCollections =
            curry(addChildCollections)(collections);
        const projectsWithChildren = projects.map(curriedAddChildCollections);
        const curriedAddChildProjects =
            curry(addChildProjects)(projectsWithChildren);
        const institutionsWithChildren = institutions.map(
            curriedAddChildProjects
        );
        const rootInstitution = institutionsWithChildren.find(
            (i) => i.id === institutionId
        );
        const institutionAsTree = buildInstitutionTree(
            [rootInstitution],
            institutionsWithChildren
        );
        const institutionRows = institutionAsTree.map(curriedMapInstitution);

        return institutionRows[0].subRows;
    }, [institutionId, JSON.stringify(institutions), locale]);

    return data;
}
