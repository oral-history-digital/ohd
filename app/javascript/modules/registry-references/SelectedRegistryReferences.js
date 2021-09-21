import PropTypes from 'prop-types';

import { underscore } from 'modules/strings';
import { useI18n } from 'modules/i18n';
import RegistryReferencesContainer from './RegistryReferencesContainer';
import { useProjectAccessStatus } from 'modules/auth';

export default function SelectedRegistryReferences({
    project,
    refObject,
}) {
    const { t, locale } = useI18n();
    const { projectAccessGranted } = useProjectAccessStatus();

    const fields = Object.values(project.metadata_fields)
        .filter(field => field.registry_entry_id)
        .filter(field => field.ref_object_type === refObject.type)
        .filter(field => (field.display_on_landing_page && !projectAccessGranted) || (field.use_in_details_view && projectAccessGranted));

    return fields.map(field => (
        <div
            key={field.id}
            className="RegistryReferences u-mb-small"
        >
            <span className="RegistryReferences-label flyout-content-label">
                {field.label[locale] || t(`activerecord.attributes.${underscore(refObject.type)}.${field.name}`)}
                :
            </span>
            <RegistryReferencesContainer
                refObject={refObject}
                lowestAllowedRegistryEntryId={(field.registry_entry_id) || 1}
                registryReferenceTypeId={field.registry_reference_type_id}
                locale={locale}
            />
        </div>
    ));
}

SelectedRegistryReferences.propTypes = {
    project: PropTypes.object.isRequired,
    refObject: PropTypes.object.isRequired,
};
