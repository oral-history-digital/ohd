import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import { Dropdown } from './Dropdown';

export function SortControl({ options, value, onChange }) {
    const { t } = useI18n();
    const selected = options.find((o) => o.value === value);

    return (
        <div className="SortControl">
            <span className="SortControl-label">{t('explorer.sort_by')}</span>
            <Dropdown label={t(selected?.labelKey ?? '')} align="right">
                <ul className="SortControl-list">
                    {options.map((opt) => (
                        <li key={opt.value} className="SortControl-item">
                            <button
                                type="button"
                                className={classNames('SortControl-option', {
                                    'SortControl-option--active':
                                        opt.value === value,
                                })}
                                onClick={() => onChange(opt.value)}
                            >
                                {t(opt.labelKey)}
                            </button>
                        </li>
                    ))}
                </ul>
            </Dropdown>
        </div>
    );
}

SortControl.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            labelKey: PropTypes.string.isRequired,
        })
    ).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default SortControl;
