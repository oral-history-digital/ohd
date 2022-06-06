import buildMediaUrl from './buildMediaUrl';
import { DEFAULT_VIDEO_RESOLUTION, DEFAULT_AUDIO_RESOLUTION } from './constants';

export default function mediaStreamsToSources(mediaStreams, pathBase, mediaType,
    archiveId, numTapes, tape) {
    if (mediaType !== 'audio' && mediaType != 'video') {
        throw new TypeError("mediaType must be 'audio' or 'video'");
    }

    const filteredStreams = mediaStreams.filter(stream =>
        stream.media_type === mediaType);
    let sources;

    // Omit 'type' in sources because VideoJS can guess it from file extension.
    switch (mediaType) {
    case 'video':
        sources = filteredStreams.map(stream => ({
            src: buildMediaUrl(stream.path, pathBase, archiveId, tape, stream.resolution),
            label: stream.resolution || 'default',
            selected: stream.resolution === DEFAULT_VIDEO_RESOLUTION || filteredStreams.length === 1,
        }));
        break;
    case 'audio':
    default:
        sources = filteredStreams.map(stream => ({
            src: buildMediaUrl(stream.path, pathBase, archiveId, tape, stream.resolution),
            label: stream.resolution || 'default',
            selected: stream.resolution === DEFAULT_AUDIO_RESOLUTION || filteredStreams.length === 1,
        }));
        break;
    }

    return sources;
}
