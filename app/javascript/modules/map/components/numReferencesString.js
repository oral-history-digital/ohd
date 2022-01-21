export default function numReferencesString(numMetadataReferences, numSegmentReferences) {
    if (numMetadataReferences === 0) {
        return numSegmentReferences.toString();
    } else if (numSegmentReferences === 0) {
        return numMetadataReferences.toString();
    } else {
        return `${numMetadataReferences} + ${numSegmentReferences}`;
    }
}
