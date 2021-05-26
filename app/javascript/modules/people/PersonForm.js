import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default function PersonForm({
    person,
    locale,
    projectId,
    projects,
    submitData,
    onSubmitCallback,
}) {
    return (
        <Form
            scope='person'
            onSubmit={(params) => {
                submitData({ locale, projectId, projects }, params);
                if (typeof onSubmitCallback === "function") {
                    onSubmitCallback();
                }
            }}
            data={person}
            submitText='submit'
            elements={[
                {
                    elementType: 'select',
                    attribute: 'gender',
                    values: ['male', 'female', 'diverse'],
                    value: person && person.gender,
                    optionsScope: 'genders',
                    withEmpty: true,
                    validate: function(v){return v !== ''}
                },
                {
                    elementType: 'input',
                    attribute: 'first_name',
                    value: person && person.names[locale] && person.names[locale].firstname,
                    type: 'text',
                    validate: function(v){return v.length > 1}
                },
                {
                    elementType: 'input',
                    attribute: 'last_name',
                    value: person && person.names[locale] && person.names[locale].lastname,
                    type: 'text',
                    validate: function(v){return v.length > 1}
                },
                {
                    elementType: 'input',
                    attribute: 'birth_name',
                    value: person && person.names[locale] && person.names[locale].birthname,
                    type: 'text',
                },
                {
                    attribute: 'date_of_birth',
                    value: person && person.date_of_birth,
                    //elementType: 'input',
                    //type: 'date'
                },
            ]}
        />
    );
}

PersonForm.propTypes = {
    person: PropTypes.object,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmitCallback: PropTypes.func,
};
