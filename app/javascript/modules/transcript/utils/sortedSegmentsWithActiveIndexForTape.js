import { sortedSegmentsForTape } from './sortedSegmentsForTape';

export function sortedSegmentsWithActiveIndexForTape(time, props) {
    let found = false;
    //let sortedSegments = Object.values(segments(props)).sort(function(a, b) {return a.time - b.time})
    let sorted = sortedSegmentsForTape(props, props.tape);
    //
    // aproximation based on the asumption that the mean or median segment duration is 7s
    //
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
