import cloneDeep from 'lodash.clonedeep';
import PropTypes from 'prop-types';

import TreeSelectComponentWrapper from './TreeSelectComponentWrapper';
import useRegistryTree from './useRegistryTree';

export default function TreeSelect(props) {
    const { isLoading, data: tree } = useRegistryTree(
        props.loadOhdTree,
        props.data?.registry_entry_id
    );

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
