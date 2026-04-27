import { useMemo, useState } from 'react';

import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

export function InstitutionDropdown({
    institutions,
    values,
    onChange,
    onClearAll,
}) {
    const { t } = useI18n();
    const [filter, setFilter] = useState('');
    const hasSelection = values.length > 0;

    const filteredInstitutions = useMemo(() => {
        const normalizedFilter = filter.trim().toLowerCase();
        if (!normalizedFilter) return institutions;

        return institutions.filter((inst) =>
            inst.name?.toLowerCase().includes(normalizedFilter)
        );
    }, [filter, institutions]);

    const handleFilterKeyDown = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    };

    return (
        <div className="ExplorerInstitutionList">
            {institutions.length >= 10 && (
                <div className="facet-filter">
                    <FaSearch className="Icon Icon--primary Icon--small" />
                    <input
                        type="text"
                        className={classNames('filter', 'forced_labor_group')}
                        value={filter}
                        onChange={(event) => setFilter(event.target.value)}
                        onKeyDown={handleFilterKeyDown}
                        style={{
                            borderBottom: '1px solid ',
                            marginBottom: '0.7rem',
                        }}
                    />
                </div>
            )}

            {hasSelection && (
                <button
                    type="button"
                    className="ExplorerInstitutionList-clear"
                    onClick={onClearAll}
                >
                    {t('explorer.institution_dropdown.all')}
                </button>
            )}

            <ul className="InstitutionDropdown-list">
                {filteredInstitutions.map((inst) => (
                    <li key={inst.id} className="InstitutionDropdown-item">
                        <label className="InstitutionDropdown-label">
                            <input
                                type="checkbox"
                                checked={values.includes(inst.id)}
                                onChange={() => onChange(inst.id)}
                            />
                            <span>{inst.name}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

InstitutionDropdown.propTypes = {
    institutions: PropTypes.arrayOf(
        PropTypes.shape({ id: PropTypes.number, name: PropTypes.string })
    ).isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
    onChange: PropTypes.func.isRequired,
    onClearAll: PropTypes.func.isRequired,
};

export default InstitutionDropdown;
