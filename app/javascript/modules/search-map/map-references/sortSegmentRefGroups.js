export default function sortSegmentRefGroups(refGroups) {
    return refGroups.sort(compareFunction);
}

function compareFunction(a, b) {
    const nameA = `${a.last_name}${a.first_name}`.toLocaleLowerCase();
    const nameB = `${b.last_name}${b.first_name}`.toLocaleLowerCase();

    return nameA.localeCompare(nameB);
}
