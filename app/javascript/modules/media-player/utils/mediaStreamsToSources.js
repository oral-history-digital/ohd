import { buildMediaUrl } from './buildMediaUrl';
import {
    DEFAULT_VIDEO_RESOLUTION,
    DEFAULT_AUDIO_RESOLUTION,
} from '../constants';

/**
 * Converts an array of media stream objects into a list of source objects for VideoJS.
 *
 * @param {Array} mediaStreams - Array of media stream objects to convert.
 * @param {string} pathBase - Base path for building media URLs.
 * @param {'audio'|'video'} mediaType - The type of media ('audio' or 'video').
 * @param {string|number} archiveId - Archive identifier for the media.
 * @param {number} numTapes - Number of tapes (not used in this function, but may be required for URL building).
 * @param {number} tape - Tape number for the media.
 * @returns {Array} Array of source objects for use with VideoJS.
 * @throws {TypeError} If mediaType is not 'audio' or 'video'.
 */
export function mediaStreamsToSources(
    mediaStreams,
    pathBase,
    mediaType,
    archiveId,
    numTapes,
    tape
) {
    if (mediaType !== 'audio' && mediaType != 'video') {
        throw new TypeError("mediaType must be 'audio' or 'video'");
    }

    const filteredStreams = mediaStreams.filter(
        (stream) => stream.media_type === mediaType
    );
    let sources;

    // Omit 'type' in sources because VideoJS can guess it from file extension.
    switch (mediaType) {
        case 'video':
            sources = filteredStreams.map((stream) => ({
                src: buildMediaUrl(
                    stream.path,
                    pathBase,
                    archiveId,
                    tape,
                    stream.resolution
                ),
                label: stream.resolution || 'default',
                selected:
                    stream.resolution === DEFAULT_VIDEO_RESOLUTION ||
                    filteredStreams.length === 1,
            }));
            break;
        case 'audio':
        default:
            sources = filteredStreams.map((stream) => ({
                src: buildMediaUrl(
                    stream.path,
                    pathBase,
                    archiveId,
                    tape,
                    stream.resolution
                ),
                label: stream.resolution || 'default',
                selected:
                    stream.resolution === DEFAULT_AUDIO_RESOLUTION ||
                    filteredStreams.length === 1,
            }));
            break;
    }

    return sources;
}
