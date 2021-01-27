import React from 'react';
import PropTypes from 'prop-types';

import Form from 'bundles/archive/containers/form/Form';

export default function UserDetailsForm({
    account,
    locale,
    projects,
    projectId,
    closeArchivePopup,
    submitData,
}) {
    return (
        <Form
            data={account}
            scope="account"
            onSubmit={params => {submitData({ locale, projects, projectId }, params); closeArchivePopup();}}
            submitText='submit'
            elements={[
                {
                    attribute: 'first_name',
                    validate: function(v){return v.length > 1}
                },
                {
                    attribute: 'last_name',
                    validate: function(v){return v.length > 1}
                },
                {
                    attribute: 'email',
                    elementType: 'input',
                    type: 'email',
                    validate: function(v){return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)}
                },
            ]}
        />
    );
}

UserDetailsForm.propTypes = {
    locale: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    account: PropTypes.object.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
};
