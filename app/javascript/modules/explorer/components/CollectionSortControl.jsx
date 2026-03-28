import PropTypes from 'prop-types';

import { COLLECTION_SORT_OPTIONS } from '../utils';
import { SortControl } from './SortControl';

export function CollectionSortControl({ value, onChange }) {
    return (
        <SortControl
            options={COLLECTION_SORT_OPTIONS}
            value={value}
            onChange={onChange}
        />
    );
}

CollectionSortControl.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CollectionSortControl;
