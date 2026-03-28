import PropTypes from 'prop-types';

import { SORT_OPTIONS } from '../utils';
import { SortControl } from './SortControl';

export function ArchivesSortControl({ value, onChange }) {
    return (
        <SortControl options={SORT_OPTIONS} value={value} onChange={onChange} />
    );
}

ArchivesSortControl.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ArchivesSortControl;
