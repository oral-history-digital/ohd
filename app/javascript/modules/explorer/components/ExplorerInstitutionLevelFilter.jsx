import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export function ExplorerInstitutionLevelFilter({ value, onChange }) {
    const { t } = useI18n();

    return (
        <div className="ExplorerInstitutionLevelFilter">
            <div className="ExplorerInstitutionLevelFilter-label">
                <span>{t('explorer.institution_level_filter.label')}</span>
            </div>
            <div className="ExplorerInstitutionLevelFilter-options">
                <label className="ExplorerInstitutionLevelFilter-option">
                    <input
                        type="radio"
                        name="explorer-institution-level"
                        value="all"
                        checked={value === 'all'}
                        onChange={onChange}
                    />
                    <span>
                        {t('explorer.institution_level_filter.option.all')}
                    </span>
                </label>
                <label className="ExplorerInstitutionLevelFilter-option">
                    <input
                        type="radio"
                        name="explorer-institution-level"
                        value="top_level"
                        checked={value === 'top_level'}
                        onChange={onChange}
                    />
                    <span>
                        {t(
                            'explorer.institution_level_filter.option.top_level'
                        )}
                    </span>
                </label>
                <label className="ExplorerInstitutionLevelFilter-option">
                    <input
                        type="radio"
                        name="explorer-institution-level"
                        value="with_parent"
                        checked={value === 'with_parent'}
                        onChange={onChange}
                    />
                    <span>
                        {t(
                            'explorer.institution_level_filter.option.with_parent'
                        )}
                    </span>
                </label>
            </div>
        </div>
    );
}

ExplorerInstitutionLevelFilter.propTypes = {
    value: PropTypes.oneOf(['all', 'top_level', 'with_parent']).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ExplorerInstitutionLevelFilter;
