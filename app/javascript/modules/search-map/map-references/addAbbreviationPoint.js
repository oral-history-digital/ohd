export default function addAbbreviationPoint(references) {
    if (!Array.isArray(references)) {
        throw new TypeError('references must be Array');
    }

    const transformedReferences = references.map(ref => ({
        ...ref,
        last_name: ref.last_name.length === 1 ? `${ref.last_name}.` : ref.last_name,
    }));

    return transformedReferences;
}
