export default function groupSegmentRefs(refs) {
    const groupObject = {};

    refs.forEach((ref) => {
        if (!(ref.archive_id in groupObject)) {
            groupObject[ref.archive_id] = {
                archive_id: ref.archive_id,
                last_name: ref.last_name,
                first_name: ref.first_name,
                display_name: ref.display_name,
                refs: [],
            };
        }

        groupObject[ref.archive_id].refs.push(ref);
    });

    return Object.values(groupObject);
}
