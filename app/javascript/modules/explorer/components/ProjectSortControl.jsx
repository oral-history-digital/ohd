import PropTypes from 'prop-types';

import { SORT_OPTIONS } from '../utils';
import { SortControl } from './SortControl';

export function ProjectSortControl({ value, onChange }) {
    return (
        <SortControl options={SORT_OPTIONS} value={value} onChange={onChange} />
    );
}

ProjectSortControl.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ProjectSortControl;
