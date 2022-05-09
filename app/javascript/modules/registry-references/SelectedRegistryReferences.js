import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { underscore } from 'modules/strings';
import { useI18n } from 'modules/i18n';
import RegistryReferencesContainer from './RegistryReferencesContainer';
import { useProjectAccessStatus } from 'modules/auth';

export default function SelectedRegistryReferences({
    project,
    projects,
    projectId,
    locale,
    refObject,
    fetchData,
    registryEntriesStatus,
    editView,
}) {
    const { t } = useI18n();
    const { projectAccessGranted } = useProjectAccessStatus(project);

    useEffect(() => {
        loadRegistryEntries();
        loadRootRegistryEntry();
    })

    function loadRegistryEntries() {
        if (!registryEntriesStatus[`ref_object_type_${refObject.type}_ref_object_id_${refObject.id}`]) {
            fetchData({ projectId, locale, projects }, 'registry_entries', null, null, `ref_object_type=${refObject.type}&ref_object_id=${refObject.id}`);
        }
    }

    function loadRootRegistryEntry() {
        if (
            !registryEntriesStatus[project.root_registry_entry_id] ||
            registryEntriesStatus[project.root_registry_entry_id].split('-')[0] === 'reload'
        ) {
            fetchData({ projectId, locale, projects }, 'registry_entries', project.root_registry_entry_id);
        }
    }

    const fields = Object.values(project.metadata_fields)
        .filter(field => field.registry_entry_id)
        .filter(field => field.ref_object_type === refObject.type)
        .filter(field => (field.display_on_landing_page && !projectAccessGranted) || (field.use_in_details_view && projectAccessGranted));

    return fields.map(field => {
        if (
            editView || refObject.registry_references && Object.values(refObject.registry_references).
            find(r => r.registry_reference_type_id === field.registry_reference_type_id)
        ) {
            return (
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
            );
        } else {
            return null;
        }
    });
}

SelectedRegistryReferences.propTypes = {
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    refObject: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
};
