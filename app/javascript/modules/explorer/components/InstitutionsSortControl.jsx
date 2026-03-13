import PropTypes from 'prop-types';

import { INST_SORT_OPTIONS } from '../utils';
import { SortControl } from './SortControl';

export function InstitutionsSortControl({ value, onChange }) {
    return (
        <SortControl
            options={INST_SORT_OPTIONS}
            value={value}
            onChange={onChange}
        />
    );
}

InstitutionsSortControl.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
