import React from 'react';
import PropTypes from 'prop-types';

import { useI18n } from '../hooks/i18n';

export default function MergeRegistryEntriesButton({
    locale,
    projectId,
    selectedRegistryEntryIds,
    submitData,
    openArchivePopup,
    closeArchivePopup,
}) {
    const { t } = useI18n();

    const mergeRegistryEntries = () => {
        const firstId = selectedRegistryEntryIds.slice(0, 1);
        const restIds = selectedRegistryEntryIds.slice(1);

        submitData({ locale, projectId }, {merge_registry_entry: {id: firstId, ids: restIds}});
        closeArchivePopup();
    }

    if (selectedRegistryEntryIds.length < 2) {
        return null;
    }

    return (
        <div
            className="flyout-sub-tabs-content-ico-link"
            onClick={() => openArchivePopup({
                title: t('activerecord.models.registry_entries.actions.merge'),
                content: (
                    <div>
                        <div
                            className="any-button"
                            onClick={mergeRegistryEntries}
                        >
                            {t('submit')}
                        </div>
                    </div>
                )
            })}
        >
            {t('activerecord.models.registry_entries.actions.merge')}
        </div>
    );
}

MergeRegistryEntriesButton.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    selectedRegistryEntryIds: PropTypes.array.isRequired,
    submitData: PropTypes.func.isRequired,
    openArchivePopup: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
};
