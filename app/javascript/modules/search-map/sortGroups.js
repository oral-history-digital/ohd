export default function sortGroups(referenceTypes, referenceGroups) {
    if (!Array.isArray(referenceTypes)) {
        throw new TypeError('referenceTypes must be Array');
    }

    if (!Array.isArray(referenceGroups)) {
        throw new TypeError('referenceGroups must be Array');
    }

    const positionOfGroup = group => referenceTypes.findIndex(type => type.id === group.id);

    const sortedGroups = referenceGroups.sort((a, b) => positionOfGroup(a) - positionOfGroup(b));

    return sortedGroups;
}
