export default function buildMediaUrl(path, archiveId, numTapes, tape) {
    const url = path
        .replace(/INTERVIEW_ID/g, archiveId)
        .replace(/TAPE_COUNT/g, numTapes)
        .replace(/TAPE_NUMBER/g, tape.toString().padStart(2, '0'));

    return url;
}
