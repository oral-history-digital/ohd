import buildMediaUrl from './buildMediaUrl';
import { DEFAULT_VIDEO_RESOLUTION, DEFAULT_AUDIO_RESOLUTION } from './constants';

export default function mediaStreamsToSources(mediaStreams, mediaType,
    archiveId, numTapes, tape) {
    if (mediaType !== 'audio' && mediaType != 'video') {
        throw new TypeError("mediaType must be 'audio' or 'video'");
    }

    const filteredStreams = mediaStreams.filter(stream =>
        stream.media_type === mediaType);
    let sources;

    switch (mediaType) {
    case 'video':
        sources = filteredStreams.map(stream => ({
            src: buildMediaUrl(stream.path, archiveId, numTapes, tape),
            type: 'video/mp4',
            label: stream.resolution,
            selected: stream.resolution === DEFAULT_VIDEO_RESOLUTION,
        }));
        return sources;
    case 'audio':
    default:
        sources = filteredStreams.map(stream => ({
            src: buildMediaUrl(stream.path, archiveId, numTapes, tape),
            type: 'audio/mp3',
            label: stream.resolution,
            selected: stream.resolution === DEFAULT_AUDIO_RESOLUTION,
        }));
        return sources;
    }
}
