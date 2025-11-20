export default function sortSegmentRefs(refGroups) {
    refGroups.forEach((group) => {
        group.refs.sort(compareFunction);
    });

    return refGroups;
}

function compareFunction(a, b) {
    const tapeDiff = a.tape_nbr - b.tape_nbr;

    if (tapeDiff === 0) {
        return a.time - b.time;
    } else {
        return tapeDiff;
    }
}
