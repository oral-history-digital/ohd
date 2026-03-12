import PropTypes from 'prop-types';

import { InstitutionDropdown } from './InstitutionDropdown';

export function ExplorerInstitutionFilter({
    institutions,
    values,
    onChange,
    onClearAll,
}) {
    return (
        <div className="ExplorerSidebarSearch-institutionSection">
            <div className="ExplorerSidebarSearch-rangeLabel">
                <span>Institution</span>
            </div>
            <InstitutionDropdown
                institutions={institutions}
                values={values}
                onChange={onChange}
                onClearAll={onClearAll}
            />
        </div>
    );
}

ExplorerInstitutionFilter.propTypes = {
    institutions: PropTypes.array.isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
    onChange: PropTypes.func.isRequired,
    onClearAll: PropTypes.func.isRequired,
};

export default ExplorerInstitutionFilter;
