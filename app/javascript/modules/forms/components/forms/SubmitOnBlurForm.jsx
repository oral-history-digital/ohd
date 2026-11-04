import { createElement, useState } from 'react';

import { submitData } from 'modules/data';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

/**
 * Saves one stored translation on blur; the content locale is separate from the route locale.
 * @param {Object} props - Record, translated attribute, content locale, and validation.
 * @returns {React.ReactElement} Input that saves valid edits on blur.
 */
export default function SubmitOnBlurForm({
    attribute,
    scope,
    type = 'input',
    validate,
    data,
    locale,
}) {
    const pathBase = usePathBase();
    const dispatch = useDispatch();

    const translation = data.translations_attributes.find(
        (t) => t.locale === locale
    );
    const translationPublic = data.translations_attributes.find(
        (t) => t.locale === `${locale}-public`
    );
    const initialValue =
        translation?.[attribute] || translationPublic?.[attribute] || '';

    const [value, setValue] = useState(initialValue);
    const [valid, setValid] = useState(validate === undefined);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);

        if (validate) {
            setValid(validate(newValue));
        }
    };

    const submit = (event) => {
        event.preventDefault();
        if (valid) {
            dispatch(
                submitData(
                    { pathBase },
                    {
                        [scope]: {
                            id: data.id,
                            translations_attributes: [
                                {
                                    id:
                                        translation?.id ||
                                        translationPublic?.id,
                                    locale,
                                    [attribute]: value,
                                },
                            ],
                        },
                    }
                )
            );
        }
    };

    return (
        <form className="submit-on-focus-out">
            {createElement(type, {
                onBlur: submit,
                onChange: handleChange,
                defaultValue: initialValue,
            })}
        </form>
    );
}

SubmitOnBlurForm.propTypes = {
    attribute: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    type: PropTypes.string,
    validate: PropTypes.func,
    data: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
};
