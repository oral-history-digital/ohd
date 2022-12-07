const APPROX_MARKER_COUNT = 9;
const MIN_INTERVAL = 1;

export default function getRangeMarks(min, max) {
    let marks = {};

    const interval = Math.max(
        Math.round((max - min) / (APPROX_MARKER_COUNT - 1)),
        MIN_INTERVAL
    );

    // Set first mark.
    marks[min] = min.toString();

    // Set inbetween marks.
    for (let i = min; i <= max; i += interval) {
        if (max - i < interval / 2) {
            continue;
        }

        marks[i] = i.toString();
    }

    // Set last mark.
    marks[max] = max.toString();

    return marks;
}
