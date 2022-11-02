import range from 'lodash.range';

export default function getPageRange(pageCount, currentPage, windowSize) {
    const actualWindowSize = Math.min(pageCount, windowSize);

    let start = currentPage - Math.ceil(actualWindowSize / 2) + 1;
    if (start < 1) {
        start = 1;
    }

    let end = start + actualWindowSize - 1;
    if (end > pageCount) {
        end = pageCount;
        start = end - actualWindowSize + 1;
    }

    return range (start, end + 1);
}
