import { useState } from 'react';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

import { NON_ZIP_COUNTRIES } from '../constants';
import useProjectAccessConfig from '../useProjectAccessConfig';

/**
 * Displays the user-data correction form after loading the project's access-field configuration.
 *
 * @param {Object} props - Correction form properties.
 * @param {string} props.projectId - Project shortname used by the existing save flow.
 * @param {Object} props.currentUser - Account whose data is being corrected.
 * @param {Object} props.userProject - Existing access request and its mutation ID.
 * @param {Object} props.countryKeys - Country choices by locale.
 * @param {Function} props.submitData - Existing correction submission action.
 * @param {Function} props.onSubmit - Called after starting submission.
 * @param {Function} [props.onCancel] - Closes the form without submitting.
 * @returns {React.ReactElement} Correction form, loading indicator, or persistent error.
 */
export default function CorrectUserDataForm({
    projectId,
    currentUser,
    userProject,
    countryKeys,
    submitData,
    onSubmit,
    onCancel,
}) {
    const { t, locale } = useI18n();

    const [hideZip, setHideZip] = useState(true);
    const { project, error, isLoading, isValidating } = useProject({
        include: ['access_config'],
    });
    const projectAccessElements = useProjectAccessConfig(
        project,
        userProject,
        currentUser
    );

    if (error || (!isLoading && !project?.access_config))
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error?.message}
                isClosable={false}
            />
        );
    if (isLoading) return <Spinner />;

    /** @returns {Object[]} Account fields combined with this project's access fields. */
    const formElements = () => {
        const nameElements = [
            {
                elementType: 'select',
                attribute: 'appellation',
                label: t('activerecord.attributes.user.appellation'),
                values: ['dr', 'prof'],
                keepOrder: true,
                withEmpty: true,
            },
            {
                elementType: 'input',
                attribute: 'first_name',
                label: t('activerecord.attributes.user.first_name'),
                type: 'text',
                validate: function (v) {
                    return v && v.length > 1;
                },
            },
            {
                elementType: 'input',
                attribute: 'last_name',
                label: t('activerecord.attributes.user.last_name'),
                type: 'text',
                validate: function (v) {
                    return v && v.length > 1;
                },
            },
        ];

        const addressElements = [
            {
                elementType: 'input',
                attribute: 'street',
                type: 'text',
                validate: function (v) {
                    return v && v.length > 1;
                },
            },
            {
                elementType: 'input',
                attribute: 'zipcode',
                label: t('activerecord.attributes.user.zipcode'),
                type: 'text',
                //validate: function(v){return v && v.length > 1},
                hidden: hideZip,
            },
            {
                elementType: 'input',
                attribute: 'city',
                type: 'text',
                validate: function (v) {
                    return v && v.length > 1;
                },
            },
        ];

        const countrySelect = [
            {
                elementType: 'select',
                attribute: 'country',
                optionsScope: 'countries',
                values: countryKeys && countryKeys[locale],
                withEmpty: true,
                validate: function (v) {
                    return v && v.length > 1;
                },
                handlechangecallback: (name, value) => {
                    setHideZip(NON_ZIP_COUNTRIES.indexOf(value) > -1);
                },
            },
        ];

        return nameElements
            .concat(addressElements)
            .concat(countrySelect)
            .concat(projectAccessElements);
    };

    return (
        <Form
            scope="user_project"
            fetching={isValidating}
            onSubmit={(params) => {
                submitData({ locale, projectId, project }, params);
                onSubmit();
            }}
            elements={formElements()}
            values={{
                workflow_state: 'correct_project_access_data',
            }}
            data={userProject}
            onCancel={onCancel}
        />
    );
}

CorrectUserDataForm.propTypes = {
    projectId: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    userProject: PropTypes.object.isRequired,
    countryKeys: PropTypes.object,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};
