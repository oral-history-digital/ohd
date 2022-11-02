import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default function BiographicalEntryForm({
    biographicalEntry,
    person,
    locale,
    projectId,
    projects,
    submitData,
    onSubmit,
    onCancel,
}) {
    return (
        <Form
            scope='biographical_entry'
            onSubmit={(params) => {
                submitData({ locale, projectId, projects }, params);
                onSubmit();
            }}
            onCancel={onCancel}
            data={biographicalEntry}
            helpTextCode="biographical_entry_form"
            values={{
                person_id: (person?.id) || (biographicalEntry?.person_id)
            }}
            elements={[
                {
                    elementType: 'textarea',
                    attribute: 'text',
                    value: biographicalEntry?.text[locale],
                    validate: function(v){return v?.length > 1}
                },
                {
                    attribute: 'start_date',
                    value: biographicalEntry?.start_date[locale],
                },
                {
                    attribute: 'end_date',
                    value: biographicalEntry?.end_date[locale],
                },
                {
                    elementType: 'select',
                    attribute: 'workflow_state',
                    values: ['unshared', 'public'],
                    value: biographicalEntry?.workflow_state,
                    optionsScope: 'workflow_states',
                },
            ]}
        />
    );
}

BiographicalEntryForm.propTypes = {
    biographicalEntry: PropTypes.object,
    person: PropTypes.object,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};
