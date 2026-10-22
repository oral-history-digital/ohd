import { fetchData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import { useDispatch } from 'react-redux';

/**
 * Selects a registry entry and loads its associations through the current route.
 *
 * @param {Object} props - Tree selection properties.
 * @param {boolean} props.isLoading - Disables selection while the tree loads.
 * @param {Object} [props.tree] - Tree with selectable children.
 * @param {Function} props.handleChange - Updates the form's registry_entry_id.
 * @returns {React.ReactElement} Registry entry tree selector.
 */
export default function TreeSelectComponent({ isLoading, tree, handleChange }) {
    const dispatch = useDispatch();
    const { t } = useI18n();
    const pathBase = usePathBase();

    const onChange = (_, selectedNodes) => {
        const registryEntryId = selectedNodes[0]?.value;
        fetchSelectedRegistryEntryData(registryEntryId);
        handleChange('registry_entry_id', registryEntryId);
    };

    /**
     * Loads associations for a selected entry; clearing the selection skips loading.
     *
     * @param {number|undefined} registryEntryId - Selected entry ID.
     */
    function fetchSelectedRegistryEntryData(registryEntryId) {
        if (typeof registryEntryId !== 'undefined') {
            dispatch(
                fetchData(
                    { pathBase },
                    'registry_entries',
                    registryEntryId,
                    null,
                    'with_associations=true'
                )
            );
        }
    }

    function selectTexts() {
        return isLoading
            ? { placeholder: t('modules.tree_select.loading') }
            : {
                  placeholder: t('modules.tree_select.enter_or_choose'),
                  noMatches: t('modules.tree_select.no_matches'),
                  label: '#tree-select-label',
                  labelRemove: t('modules.tree_select.remove_entry'),
              };
    }

    return (
        <div className="TreeSelect">
            <label
                id="tree-select-label"
                className="form-label"
                htmlFor="tree-select"
            >
                {t('activerecord.models.registry_entry.one')}
            </label>
            <DropdownTreeSelect
                id="tree-select"
                className="TreeSelect-select"
                mode="radioSelect"
                data={tree?.children || []}
                onChange={onChange}
                keepTreeOnSearch
                keepChildrenOnSearch
                clearSearchOnChange
                texts={selectTexts()}
                disabled={isLoading}
            />
            <p className="help-block">{t('modules.tree_select.help_text')}</p>
        </div>
    );
}

TreeSelectComponent.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    tree: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
};
