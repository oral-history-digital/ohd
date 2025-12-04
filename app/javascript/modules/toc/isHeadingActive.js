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
        (currentTape === thisHeadingTape && currentTime >= thisHeadingTime) ||
        currentTape > thisHeadingTape
    ) {
        isBehindThisHeading = true;
    }

    if (
        (typeof nextHeadingTape === 'undefined' &&
            typeof nextHeadingTime === 'undefined') ||
        (currentTape === nextHeadingTape && currentTime < nextHeadingTime) ||
        currentTape < nextHeadingTape
    ) {
        isBeforeNextHeading = true;
    }

    return isBehindThisHeading && isBeforeNextHeading;
}
