import React from 'react';

import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { updateRegistryNameAttributes, updateNormDataAttributes,
    updateRegistryEntryTranslationsAttributes } from './updateRegistryEntryAttributes';
import { Modal } from 'modules/ui';

function UpdateRegistryEntryAttributesModal({
    entry,
    registryEntryAttributes,
    registryNameTypes,
    normDataProviders,
    setRegistryEntryAttributes,
    setShowElementsInForm,
}) {
    const { t, locale } = useI18n();
    const { project } = useProject();

    const show = (entry) => {
        const alternateName = Array.isArray(entry.AlternateName) ?
            entry.AlternateName.find(n => n.Lang === locale && n.Name)?.Name :
            entry.AlternateName?.Name;
        const description = Array.isArray(entry.Description) ?
            entry.Description.find(n => n.Lang === locale && n.Description)?.Description :
            entry.Description?.Description;
        return (
            alternateName + ', ' + description
        );
    }

    return (
        <Modal
            title={t('normdata.update_registry_entry_attributes')}
            trigger={show(entry)}
            triggerClassName="flyout-sub-tabs-content-ico-link"
        >
            {close => (
                <div>
                    <div className="Form-footer u-mt">
                        <button
                            type="button"
                            className="Button Button--primaryAction"
                            onClick={() => {
                                setRegistryEntryAttributes({
                                    latitude: entry.Location?.Latitude,
                                    longitude: entry.Location?.Longitude,
                                    ...updateRegistryEntryTranslationsAttributes(entry, registryEntryAttributes, project),
                                    ...updateRegistryNameAttributes(entry, registryNameTypes, registryEntryAttributes, project, locale),
                                    ...updateNormDataAttributes(entry, normDataProviders, registryEntryAttributes),
                                });
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
