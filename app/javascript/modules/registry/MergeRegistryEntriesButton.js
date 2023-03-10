import PropTypes from 'prop-types';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';

export default function MergeRegistryEntriesButton({
    locale,
    projectId,
    project,
    selectedRegistryEntryIds,
    submitData,
}) {
    const { t } = useI18n();

    const mergeRegistryEntries = () => {
        const firstId = selectedRegistryEntryIds.slice(0, 1);
        const restIds = selectedRegistryEntryIds.slice(1);

        submitData({ locale, projectId, project }, {merge_registry_entry: {id: firstId, ids: restIds}});
    }

    if (selectedRegistryEntryIds.length < 2) {
        return null;
    }

    return (
        <Modal
            title={t('activerecord.models.registry_entry.actions.merge')}
            trigger={t('activerecord.models.registry_entry.actions.merge')}
            triggerClassName="flyout-sub-tabs-content-ico-link"
        >
            {
                close => (
                    <div>
                        <button
                            type="button"
                            className="Button any-button"
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
    project: PropTypes.object.isRequired,
    selectedRegistryEntryIds: PropTypes.array.isRequired,
    submitData: PropTypes.func.isRequired,
};
