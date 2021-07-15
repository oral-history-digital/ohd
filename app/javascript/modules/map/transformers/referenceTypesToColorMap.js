export default function referenceTypesToColorMap(referenceTypes) {
    if (!Array.isArray(referenceTypes)) {
        throw new TypeError('referenceTypes must be Array');
    }

    const colorMap = new Map();
    referenceTypes.forEach(type => {
        colorMap.set(type.id, type.color);
    });

    return colorMap;
}
