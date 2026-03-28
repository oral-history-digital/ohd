/**
 * Returns workbook UserAnnotation entries for the given segment.
 *
 * @param {Array} savedSegments - Workbook entries from useWorkbook().savedSegments.
 * @param {number|string} segmentId - Segment identifier.
 * @returns {Array} Segment workbook annotations.
 */
export function getSegmentWorkbookAnnotations(savedSegments, segmentId) {
    return (savedSegments || []).filter(
        (annotation) =>
            annotation.reference_id === segmentId &&
            annotation.reference_type === 'Segment'
    );
}
