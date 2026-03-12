import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import { InstitutionDropdown } from './InstitutionDropdown';

export function ExplorerInstitutionFilter({
    institutions,
    values,
    onChange,
    onClearAll,
}) {
    const { t } = useI18n();

    return (
        <div className="ExplorerSidebarSearch-institutionSection">
            <div className="ExplorerSidebarSearch-rangeLabel">
                <span>{t('explorer.institution_filter.label')}</span>
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
