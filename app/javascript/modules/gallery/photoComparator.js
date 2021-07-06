export default function photoComparator(a, b) {
    const aId = a.public_id;
    const bId = b.public_id;

    if (!aId && !bId) {
        return a.id - b.id;
    }

    if (aId && !bId) {
        return -1;
    }

    if (!aId && bId) {
        return 1;
    }

    return aId.localeCompare(bId);
}
