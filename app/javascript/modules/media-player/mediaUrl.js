export default function mediaUrl({
    archiveId,
    mediaStreams,
    mediaType = 'video',
    resolution = '480p',
    tape,
    tapeCount,
}) {
    const mediaStream = Object.values(mediaStreams)
        .find(m => m.media_type === mediaType && m.resolution === resolution);

    const url = mediaStream?.path
        .replace(/INTERVIEW_ID/g, archiveId)
        .replace(/TAPE_COUNT/g, tapeCount)
        .replace(/TAPE_NUMBER/g, tape.toString().padStart(2, '0'));

    return url;
}
