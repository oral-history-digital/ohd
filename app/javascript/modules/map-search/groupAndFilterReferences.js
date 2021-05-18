import groupBy from 'lodash.groupby';

export default function groupAndFilterReferences(references, filter) {
    const filteredReferences = references.filter(ref =>
        filter.includes(ref.registry_reference_type_id));
    const groupedReferences = groupBy(filteredReferences, ref => ref.registry_reference_type_id);

    return groupedReferences;
}
