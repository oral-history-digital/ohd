import PropTypes from 'prop-types';
import classNames from 'classnames';

import Label from './Label';
import { useI18n } from 'modules/i18n';

export default function Element({
    label,
    labelKey,
    className,
    scope,
    attribute,
    elementType,
    htmlFor,
    valid,
    showErrors,
    help,
    hidden,
    mandatory,
    individualErrorMsg,
    children,
}) {
    const { t } = useI18n();

    // Scope is equivalent to model here.
    const key = labelKey || `activerecord.attributes.${scope}.${attribute}`;

    return (
        <div
            className={classNames('form-group', className, {
                hidden: hidden,
                'has-error': !valid && showErrors,
            })}
        >
            <Label
                label={label}
                labelKey={key}
                mandatory={mandatory}
                htmlFor={htmlFor}
            />

            <div className="form-input">
                {children}
                {help && (
                    <p className="help-block">
                        {typeof help === 'string' ? t(help) : help}
                    </p>
                )}
            </div>

            {!valid && showErrors && (
                <div className="help-block">
                    {individualErrorMsg
                        ? t(
                              `activerecord.errors.models.${scope}.attributes.${attribute}.${individualErrorMsg}`
                          )
                        : t(`activerecord.errors.default.${elementType}`)}
                </div>
            )}
        </div>
    );
}

Element.propTypes = {
    label: PropTypes.string,
    labelKey: PropTypes.string,
    htmlFor: PropTypes.string,
    scope: PropTypes.string,
    attribute: PropTypes.string,
    className: PropTypes.string,
    elementType: PropTypes.string,
    help: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    individualErrorMsg: PropTypes.string,
    valid: PropTypes.bool,
    showErrors: PropTypes.bool,
    hidden: PropTypes.bool,
    mandatory: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
