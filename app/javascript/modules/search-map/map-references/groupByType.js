import groupBy from 'lodash.groupby';
import keyBy from 'lodash.keyby';

export default function groupByType(referenceTypes, references) {
    if (!Array.isArray(referenceTypes)) {
        throw new TypeError('referenceTypes must be Array');
    }
    if (!Array.isArray(references)) {
        throw new TypeError('references must be Array');
    }

    const typesById = keyBy(referenceTypes, (type) => type.id);

    const groupedReferences = groupBy(
        references,
        (ref) => ref.registry_reference_type_id
    );

    const groupArray = Object.keys(groupedReferences).map((typeId) => ({
        id: Number.parseInt(typeId),
        name: typesById[typeId].name,
        references: groupedReferences[typeId],
    }));

    return groupArray;
}
