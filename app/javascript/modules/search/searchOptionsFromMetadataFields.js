export default function searchOptionsFromMetadataFields(
    isAdminMode,
    metadataFields
) {
    const searchOptions = metadataFields
        .filter(
            (field) =>
                field.use_in_results_table ||
                field.use_in_results_list ||
                isAdminMode
        )
        .map((field) => field.name);

    return searchOptions;
}
