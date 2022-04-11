export default function searchOptionsFromMetadataFields(metadataFields) {
    const searchOptions = metadataFields
        .filter(field => field.use_in_results_table || field.use_in_results_list)
        .map(field => field.name);

    return searchOptions;
}
