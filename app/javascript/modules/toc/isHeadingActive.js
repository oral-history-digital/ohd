export default function isHeadingActive({
    thisHeadingTape,
    thisHeadingTime,
    nextHeadingTape,
    nextHeadingTime,
    currentTape,
    currentTime,
}) {
    let isBehindThisHeading = false;
    let isBeforeNextHeading = false;

    if (
        currentTape === thisHeadingTape && currentTime >= thisHeadingTime ||
        currentTape > thisHeadingTape
    ) {
        isBehindThisHeading = true;
    }

    if (
        currentTape === nextHeadingTape && currentTime < nextHeadingTime ||
        currentTape < nextHeadingTape ||
        typeof nextHeadingTape === 'undefined' && typeof nextHeadingTime === 'undefined'
    ) {
        isBeforeNextHeading = true;
    }

    return isBehindThisHeading && isBeforeNextHeading;
}
