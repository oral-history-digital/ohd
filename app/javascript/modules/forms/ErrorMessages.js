import PropTypes from 'prop-types';
import { useI18n } from 'modules/i18n';

export default function ErrorMessages({ elements, errors, scope }) {
    const { t } = useI18n();
    const atLeastOneError = Object.values(errors).find((e) => e);

    if (!atLeastOneError) return null;

    return (
        <div className="notifications">
            <h5>{t('modules.registration.messages.header')}</h5>
            <ul>
                {elements.map((element) => {
                    if (errors[element.attribute]) {
                        const key =
                            element.labelKey ||
                            `activerecord.attributes.${scope}.${element.attribute}`;
                        const elementType =
                            element.elementType === 'input'
                                ? `${element.type}_input`
                                : element.elementType;

                        return (
                            <li key={element.attribute}>
                                <b>
                                    {element.label ? element.label : t(key)}
                                    :{' '}
                                </b>
                                {element.individualErrorMsg
                                    ? t(
                                          `activerecord.errors.models.${scope}.attributes.${element.attribute}.${element.individualErrorMsg}`
                                      )
                                    : t(
                                          `activerecord.errors.default.${elementType}`
                                      )}
                            </li>
                        );
                    }
                })}
            </ul>
        </div>
    );
}

ErrorMessages.propTypes = {
    elements: PropTypes.object,
    errors: PropTypes.object,
    scope: PropTypes.string,
};
