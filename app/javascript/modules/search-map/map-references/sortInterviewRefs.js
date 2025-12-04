export default function sortInterviewRefs(refGroups) {
    refGroups.forEach((group) => {
        group.references.sort(compareFunction);
    });

    return refGroups;
}

function compareFunction(a, b) {
    const nameA = `${a.last_name}${a.first_name}`.toLocaleLowerCase();
    const nameB = `${b.last_name}${b.first_name}`.toLocaleLowerCase();

    return nameA.localeCompare(nameB);
}
