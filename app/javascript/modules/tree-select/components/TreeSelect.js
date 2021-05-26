import { useEffect } from 'react';
import PropTypes from 'prop-types';
import DropdownTreeSelect from 'react-dropdown-tree-select';

import { useI18n } from 'modules/i18n';
import styles from './TreeSelect.module.scss';

export default function TreeSelect({
    locale,
    projectId,
    projects,
    dataAvailable,
    tree,
    handleChange,
    fetchRegistryTree,
    fetchData,
}) {
    const { t } = useI18n();

    useEffect(() => {
        if (!dataAvailable) {
            fetchRegistryTree();
        }
    }, [])

    const onChange = (_, selectedNodes) => {
        const registryEntryId = selectedNodes[0]?.value

        if (typeof registryEntryId !== 'undefined') {
            fetchData({ locale, projectId, projects }, 'registry_entries', registryEntryId, null,
                'with_associations=true');
        }

        handleChange('registry_entry_id', registryEntryId);
    }

    return (
        <div className={styles.container}>
            <label
                id="tree-select-label"
                className="form-label"
                htmlFor="tree-select"
            >
                {t('activerecord.models.registry_entry.one')}
            </label>
            <DropdownTreeSelect
                id="tree-select"
                className={styles.treeSelect}
                mode="radioSelect"
                data={tree ? tree.children : []}
                onChange={onChange}
                keepTreeOnSearch
                keepChildrenOnSearch
                clearSearchOnChange
                texts={dataAvailable ? {
                    placeholder: t('modules.tree_select.enter_or_choose'),
                    noMatches: t('modules.tree_select.no_matches'),
                    label: '#tree-select-label',
                    labelRemove: t('modules.tree_select.remove_entry'),
                } : { placeholder: t('modules.tree_select.loading') }}
                disabled={!dataAvailable}
            />
            <p className="help-block">
                {t('modules.tree_select.help_text')}
            </p>
        </div>
    );
}

TreeSelect.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    dataAvailable: PropTypes.bool.isRequired,
    tree: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    fetchRegistryTree: PropTypes.func.isRequired,
};
