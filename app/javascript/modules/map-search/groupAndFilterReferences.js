import groupBy from 'lodash.groupby';

export default function groupAndFilterReferences(references, filter, referenceTypes) {
    const filteredReferences = references.filter(ref =>
        filter.includes(ref.registry_reference_type_id));

    const groupedReferences = groupBy(filteredReferences, ref => ref.registry_reference_type_id);

    const groupsAsArray = Object.keys(groupedReferences).map(typeId => ({
        id: Number.parseInt(typeId),
        references: groupedReferences[typeId],
    }));

    const positionOfGroup = group => referenceTypes.findIndex(type => type.id === group.id);

    const sortedGroups = groupsAsArray.sort((a, b) => positionOfGroup(a) - positionOfGroup(b));

    return sortedGroups;
}
