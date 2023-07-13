import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';

import useRegistryTree from './useRegistryTree';
import TreeSelectComponentWrapper from './TreeSelectComponentWrapper';

export default function TreeSelect(props) {
    const { isLoading, data: tree } = useRegistryTree(props.loadOhdTree, props.data?.registry_entry_id);

    return (
        <TreeSelectComponentWrapper
            isLoading={isLoading}
            tree={cloneDeep(tree)}
            {...props}
        />
    );
}

TreeSelect.propTypes = {
    loadOhdTree: PropTypes.bool.isRequired,
    data: PropTypes.object,
};
