import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import curry from 'lodash.curry';

import { getInstitutions, getProjects, getCollections } from 'modules/data';
import { useI18n } from 'modules/i18n';
import addChildProjects from './tree-builders/addChildProjects';
import addChildCollections from './tree-builders/addChildCollections';
import buildInstitutionTree from './tree-builders/buildInstitutionTree';
import mapInstitution from './mappers/mapInstitution';
import rowComparator from './rowComparator';

export default function useData() {
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
        const rootInstitutions = institutionsWithChildren.filter(
            (i) => i.parent_id === null
        );
        const institutionsAsTree = buildInstitutionTree(
            rootInstitutions,
            institutionsWithChildren
        );

        const institutionRows = institutionsAsTree
            .map(curriedMapInstitution)
            .sort(rowComparator);

        return institutionRows;
    }, [
        JSON.stringify(institutions),
        JSON.stringify(projects),
        JSON.stringify(collections),
        locale,
    ]);

    return data;
}
