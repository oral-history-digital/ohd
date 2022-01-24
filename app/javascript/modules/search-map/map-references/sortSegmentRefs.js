export default function sortSegmentRefs(refGroups) {
    refGroups.forEach(group => {
        group.refs.sort(compareFunction);
    });

    return refGroups;
}

function compareFunction(a, b) {
    const tapeDiff = a.tape - b.tape;

    if (tapeDiff === 0) {
        return a.time - b.time;
    } else {
        return tapeDiff;
    }
}
