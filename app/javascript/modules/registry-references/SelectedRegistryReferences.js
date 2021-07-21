import PropTypes from 'prop-types';

import { underscore } from 'modules/strings';
import { useI18n } from 'modules/i18n';
import RegistryReferencesContainer from './RegistryReferencesContainer';

export default function SelectedRegistryReferences({
    isLoggedIn,
    project,
    refObject,
}) {
    const { t, locale } = useI18n();

    const fields = Object.values(project.metadata_fields)
        .filter(field => field.registry_entry_id)
        .filter(field => field.ref_object_type === refObject.type)
        .filter(field => field.display_on_landing_page || (field.use_in_details_view && isLoggedIn));

    return fields.map(field => (
        <div
            key={field.id}
            className="RegistryReferences u-mb-small"
        >
            <span className="RegistryReferences-label flyout-content-label">
                {field.label[locale] ||
                    t(`activerecord.attributes.${underscore(refObject.type)}.${field.name}`)}
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
    isLoggedIn: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
    refObject: PropTypes.object,
};
