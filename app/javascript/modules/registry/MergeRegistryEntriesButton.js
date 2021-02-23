import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';

export default function MergeRegistryEntriesButton({
    locale,
    projectId,
    projects,
    selectedRegistryEntryIds,
    submitData,
}) {
    const { t } = useI18n();

    const mergeRegistryEntries = () => {
        const firstId = selectedRegistryEntryIds.slice(0, 1);
        const restIds = selectedRegistryEntryIds.slice(1);

        submitData({ locale, projectId, projects }, {merge_registry_entry: {id: firstId, ids: restIds}});
    }

    if (selectedRegistryEntryIds.length < 2) {
        return null;
    }

    return (
        <Modal
            title={t('activerecord.models.registry_entries.actions.merge')}
            trigger={t('activerecord.models.registry_entries.actions.merge')}
            triggerClassName="flyout-sub-tabs-content-ico-link"
        >
            {
                close => (
                    <div>
                        <button
                            type="button"
                            className="any-button"
                            onClick={() => {
                                mergeRegistryEntries();
                                close();
                            }}
                        >
                            {t('submit')}
                        </button>
                    </div>
                )
            }
        </Modal>
    );
}

MergeRegistryEntriesButton.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    selectedRegistryEntryIds: PropTypes.array.isRequired,
    submitData: PropTypes.func.isRequired,
};
