export default function sortByFacetOrder(metadataFields) {
    return metadataFields.sort(compareFunction);
}

function compareFunction(a, b) {
    return a.facet_order - b.facet_order;
}
