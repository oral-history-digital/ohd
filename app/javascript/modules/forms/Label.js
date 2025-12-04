import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

function Label({ label, labelKey, mandatory = false, htmlFor, className }) {
    const { t } = useI18n();

    const l = label ? label : t(labelKey);

    return (
        <div className={classNames('form-label', className)}>
            <label className="FormLabel" htmlFor={htmlFor}>
                {`${l}${mandatory ? ' *' : ''}`}
            </label>
        </div>
    );
}

Label.propTypes = {
    label: PropTypes.string,
    labelKey: PropTypes.string,
    mandatory: PropTypes.bool,
    htmlFor: PropTypes.string,
    className: PropTypes.string,
};

export default Label;
