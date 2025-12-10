export default function filterReferences(filter, references) {
    if (!Array.isArray(filter)) {
        throw new TypeError('filter must be Array');
    }
    if (!Array.isArray(references)) {
        throw new TypeError('references must be Array');
    }

    const filteredReferences = references.filter((reference) =>
        filter.includes(reference.registry_reference_type_id.toString())
    );

    return filteredReferences;
}
