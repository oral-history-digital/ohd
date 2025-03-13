import { createElement, useState } from 'react';
import PropTypes from 'prop-types';

const SubmitOnBlurForm = ({
    attribute,
    scope,
    type = 'input',
    validate,
    data,
    locale,
    projectId,
    project,
    submitData,
}) => {
    const translation = data.translations_attributes.find(t => t.locale === locale);
    const translationPublic = data.translations_attributes.find(t => t.locale === `${locale}-public`);
    const initialValue = translation?.[attribute] || translationPublic?.[attribute] || '';
    
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
            submitData(
                { locale: 'de', project, projectId },
                { [scope]: {
                    id: data.id,
                    translations_attributes: [{
                        id: translation?.id || translationPublic?.id,
                        locale,
                        [attribute]: value,
                    }]
                }}
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
};

SubmitOnBlurForm.propTypes = {
    attribute: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    type: PropTypes.string,
    validate: PropTypes.func,
    data: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
};

export default SubmitOnBlurForm;
