import React from 'react';

import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { prepareRegistryNameAttributes, prepareNormDataAttributes,
    updateRegistryEntryTranslationsAttributes } from './updateRegistryEntryAttributes';
import { Modal } from 'modules/ui';

function UpdateRegistryEntryAttributesModal({
    entry,
    registryEntryAttributes,
    registryNameTypes,
    normDataProviders,
    setRegistryEntryAttributes,
    setShowElementsInForm,
    replaceNestedFormValues,
}) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();

    const show = (entry) => {
        const alternateName = entry.AlternativeNames?.AlternativeName;
        const name = Array.isArray(alternateName) ?
            alternateName.find(n => n.Lang === locale && n.Name)?.Name :
            alternateName?.Name;
        const description = Array.isArray(entry.Description) ?
            entry.Description.find(n => n.Lang === locale && n.Description)?.Description :
            entry.Description?.Description;
        return (
            name || entry.Name + ', ' + description
        );
    }

    return (
        <Modal
            title={t('normdata.update_registry_entry_attributes')}
            trigger={show(entry)}
            triggerClassName="flyout-sub-tabs-content-ico-link"
        >
            {close => (
                <div id="overwrite_registry_entry">
                    <div className="Form-footer u-mt">
                        <button
                            type="button"
                            className="Button Button--primaryAction"
                            onClick={() => {
                                setRegistryEntryAttributes({
                                    latitude: entry.Location?.Latitude,
                                    longitude: entry.Location?.Longitude,
                                    has_geo_coords: !!(entry.Location?.Latitude && entry.Location?.Longitude),
                                    delete_persistent_values: true,
                                    ...updateRegistryEntryTranslationsAttributes(entry, project),
                                });
                                replaceNestedFormValues('registry_names_attributes', prepareRegistryNameAttributes(entry, registryNameTypes, project, locale)),
                                replaceNestedFormValues('norm_data_attributes', prepareNormDataAttributes(entry, normDataProviders)),
                                setShowElementsInForm(true);
                                close();
                            }}
                        >
                            {t('ok')}
                        </button>
                        <button
                            type="button"
                            className="Button Button--secondaryAction"
                            onClick={() => { close(); }}
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}

export default UpdateRegistryEntryAttributesModal;
