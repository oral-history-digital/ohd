import { SPREADSHEET_EXTENSIONS } from '../constants/transcriptImport';

/**
 * Reads the last filename extension without a dot, regardless of case.
 * @param {string} filename - Source filename.
 * @returns {string} Lowercase extension, or an empty string when absent.
 */
export function getFileExtension(filename) {
    const dot = filename.lastIndexOf('.');
    return dot === -1 ? '' : filename.slice(dot + 1).toLowerCase();
}

/**
 * Removes frontend-only controls and sends a frame rate only for explicit spreadsheet frame mode.
 * @param {Object} values - Current transcript form values.
 * @returns {Object} Rails upload parameters shared by validation and import.
 */
export function prepareTranscriptParams(values) {
    const { use_frame_timecodes, timecode_frame_rate, ...transcript } = values;
    if (
        SPREADSHEET_EXTENSIONS.includes(
            getFileExtension(values.data?.name || '')
        ) &&
        use_frame_timecodes
    ) {
        transcript.timecode_frame_rate = timecode_frame_rate;
    }
    return { transcript };
}
