import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DropdownTreeSelect from 'react-dropdown-tree-select';

import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import styles from './TreeSelect.module.scss';

export default function TreeSelect({
    locale,
    dataAvailable,
    tree,
    handleChange,
    fetchRegistryTree,
}) {
    const { t } = useI18n();

    useEffect(() => {
        if (!dataAvailable) {
            fetchRegistryTree();
        }
    }, [])

    const onChange = (_, selectedNodes) => {
        handleChange('registry_entry_id', selectedNodes[0]?.value);
    }

    if (!dataAvailable) {
        return <Spinner/>;
    }

    return (
        <div>
            <label
                id="tree-select-label"
                className="form-label"
                htmlFor="tree-select"
            >
                {t('activerecord.models.registry_entries.one')}
            </label>
            <DropdownTreeSelect
                id="tree-select"
                className={styles.treeSelect}
                mode="radioSelect"
                data={tree.children}
                onChange={onChange}
                keepTreeOnSearch
                keepChildrenOnSearch
                clearSearchOnChange
                texts={{
                    placeholder: t('choose'),
                    noMatches: t('modules.tree_select.no_matches'),
                    label: '#tree-select-label',
                    labelRemove: t('modules.tree_select.remove_entry'),
                }}
            />
        </div>
    );
}

TreeSelect.propTypes = {
    locale: PropTypes.string.isRequired,
    dataAvailable: PropTypes.bool.isRequired,
    tree: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    fetchRegistryTree: PropTypes.func.isRequired,
};
