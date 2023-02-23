import keyBy from 'lodash.keyby';

/**
 * IN: collections array, project
 * OUT: project
 */

export default function addChildCollections(collections, project) {
    if (!('collection_ids' in project)) {
        throw new ReferenceError('Project must contain collection_ids property');
    }

    const collectionsById = keyBy(collections, 'id');

    const clonedProject = {
        ...project,
        collections: project.collection_ids.map(id => collectionsById[id])
            .filter(collection => typeof collection !== 'undefined'),
    };
    return clonedProject;
}
