import {
    METADATA_SOURCE_EVENT_TYPE,
    METADATA_SOURCE_PERSON,
} from 'modules/constants';

export default function getDisplayedMetadataFields(
    metadataFields,
    isProjectAccessGranted
) {
    const filteredFields = metadataFields.filter((field) => {
        const isPersonType =
            field.source === METADATA_SOURCE_PERSON ||
            (field.source === METADATA_SOURCE_EVENT_TYPE &&
                field.eventable_type === 'Person');

        const isAllowed =
            (isProjectAccessGranted && field.use_in_details_view) ||
            (!isProjectAccessGranted && field.display_on_landing_page);

        return isPersonType && isAllowed;
    });

    return filteredFields;
}
