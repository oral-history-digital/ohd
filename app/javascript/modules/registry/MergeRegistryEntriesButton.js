import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';

/**
 * Offers merging when at least two registry entries are selected.
 *
 * @param {Object} props - Merge action properties.
 * @param {number[]} props.selectedRegistryEntryIds - Target entry followed by entries to merge.
 * @param {Function} props.submitData - Starts the merge through Redux using the current route.
 * @returns {React.ReactElement|null} Merge dialog, or null with fewer than two selected entries.
 */
export default function MergeRegistryEntriesButton({
    selectedRegistryEntryIds,
    submitData,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();

    /** Uses the first selected entry as the merge target, preserving selection order. */
    const mergeRegistryEntries = () => {
        const firstId = selectedRegistryEntryIds.slice(0, 1);
        const restIds = selectedRegistryEntryIds.slice(1);

        submitData(
            { pathBase },
            { merge_registry_entry: { id: firstId, ids: restIds } }
        );
    };

    if (selectedRegistryEntryIds.length < 2) {
        return null;
    }

    return (
        <Modal
            title={t('activerecord.models.registry_entry.actions.merge')}
            trigger={t('activerecord.models.registry_entry.actions.merge')}
            triggerClassName="flyout-sub-tabs-content-ico-link"
        >
            {(close) => (
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
            )}
        </Modal>
    );
}

MergeRegistryEntriesButton.propTypes = {
    selectedRegistryEntryIds: PropTypes.array.isRequired,
    submitData: PropTypes.func.isRequired,
};
