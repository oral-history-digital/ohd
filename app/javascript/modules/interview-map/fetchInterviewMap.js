export default function fetchInterviewMap(pathBase, archiveId) {
    return fetch(`${pathBase}/locations.json?archive_id=${archiveId}`)
        .then(res => res.json());
}
