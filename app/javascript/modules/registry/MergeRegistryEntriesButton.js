import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Modal } from 'modules/ui';

export default function MergeRegistryEntriesButton({
    selectedRegistryEntryIds,
    submitData,
}) {
    const { project, projectId } = useProject();
    const { t, locale } = useI18n();

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
    selectedRegistryEntryIds: PropTypes.array.isRequired,
    submitData: PropTypes.func.isRequired,
};
