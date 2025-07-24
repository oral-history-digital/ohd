import { sortedSegmentsForTape } from './sortedSegmentsForTape';

/**
 * Returns the active segment, sorted segments array, and active index for a given time and tape.
 *
 * Uses a heuristic to estimate the active segment index based on time, then adjusts to find the segment
 * whose time is closest to the input time. If no segments exist, returns null for the active segment.
 *
 * @param {number} time - The time to find the active segment for.
 * @param {Object} props - The props object containing interview, tape, and related metadata.
 * @returns {[Object|null, Array, number]} An array containing the active segment (or null), all sorted segments, and the active index.
 */
export function sortedSegmentsWithActiveIndexForTape(time, props) {
    let found = false;
    let sorted = sortedSegmentsForTape(props, props.tape);

    // Aproximation based on the asumption that the mean or median segment duration is 7s
    let index = Math.round(time / 7);
    let firstSegment = sorted[0];

    if (!firstSegment) {
        return [null, sorted, 0];
    }

    if (index === 0) {
        return [firstSegment, sorted, index];
    }

    if (index >= sorted.length) {
        index = sorted.length - 1;
    }

    if (sorted[index].time > time) {
        while (!found) {
            if (sorted[index].time <= time || index === 0) {
                found = true;
                break;
            }
            index--;
        }
    } else if (sorted[index].time < time) {
        while (!found) {
            if (sorted[index].time >= time || index === sorted.length - 1) {
                found = true;
                break;
            }
            index++;
        }
    }

    return [sorted[index], sorted, index];
}
