import { fetchData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import { useDispatch } from 'react-redux';

export default function TreeSelectComponent({ isLoading, tree, handleChange }) {
    const dispatch = useDispatch();
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();

    const onChange = (_, selectedNodes) => {
        const registryEntryId = selectedNodes[0]?.value;
        fetchSelectedRegistryEntryData(registryEntryId);
        handleChange('registry_entry_id', registryEntryId);
    };

    function fetchSelectedRegistryEntryData(registryEntryId) {
        if (typeof registryEntryId !== 'undefined') {
            dispatch(
                fetchData(
                    { locale, projectId, project },
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
