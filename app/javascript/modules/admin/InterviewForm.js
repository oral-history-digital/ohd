import { createElement, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { ContributionFormContainer } from 'modules/interview-metadata';
import { usePeople } from 'modules/person';
import { usePathBase, useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function InterviewForm({
    collections,
    contributionTypes,
    interview,
    languages,
    submitData,
    submitText,
    withContributions,
}) {
    const [showForm, setShowForm] = useState(true);
    const [archiveId, setArchiveId] = useState(null);

    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const pathBase = usePathBase();

    const { data: people, isLoading } = usePeople();

    function returnToForm() {
        setShowForm(true);
    }

    function handleArchiveIdChange(name, value) {
        setArchiveId(value);
    }

    function showContribution(value) {
        const contributor = people?.[Number.parseInt(value.person_id)];

        return (
            <span>
                <span>
                    {contributor?.display_name}
                </span>
                {', '}
                <span>
                    {contributionTypes[value.contribution_type_id].name[locale]}
                </span>
            </span>
        )
    }

    function handleSubmit(params){
        setShowForm(false);

        submitData({ locale, projectId, project }, params);
    }

    function renderForm() {
        let elements = [
            {
                attribute: 'archive_id',
                value: interview?.archive_id,
                handlechangecallback: handleArchiveIdChange,
                validate: v => {
                    let regexp = new RegExp(`^${project.shortname}\\d{${project.archive_id_number_length}}$`);
                    return regexp.test(v);
                },
            },
            {
                attribute: 'interview_date',
                value: interview?.interview_date,
                elementType: 'input',
            },
            {
                attribute: 'description',
                value: interview?.description,
                elementType: 'textarea',
                multiLocale: true,
            },
            {
                attribute: 'media_type',
                value: interview?.media_type,
                optionsScope: 'search_facets',
                elementType: 'select',
                withEmpty: true,
                values: ['video', 'audio'],
                validate: function(v){return v && /^\w+$/.test(v)},
            },
            {
                attribute: 'media_missing',
                value: interview?.media_missing || false,
                elementType: 'input',
                type: 'checkbox',
            },
            {
                elementType: 'select',
                attribute: 'primary_language_id',
                values: languages,
                value: interview?.primary_language_id,
                withEmpty: true,
                validate: function(v){return /^\d+$/.test(v)},
            },
            {
                elementType: 'select',
                attribute: 'secondary_language_id',
                values: languages,
                value: interview?.secondary_language_id,
                withEmpty: true,
            },
            {
                elementType: 'select',
                attribute: 'primary_translation_language_id',
                values: languages,
                value: interview?.primary_translation_language_id,
                withEmpty: true,
            },
            {
                elementType: 'select',
                attribute: 'collection_id',
                values: collections,
                value: interview?.collection_id,
                withEmpty: true,
                individualErrorMsg: 'empty'
            },
            {
                // tape_count is important to calculate the video-path
                attribute: 'tape_count',
                value: interview?.tape_count,
                validate: function(v){return /^\d+$/.test(v)},
            }
        ];

        if (interview) {
            elements.push(
                {
                    elementType: 'select',
                    attribute: 'workflow_state',
                    values: interview && Object.values(interview.workflow_states),
                    value: interview.workflow_state,
                    optionsScope: 'workflow_states',
                }
            )
        }

        let props = {
            scope: 'interview',
            values: { project_id: project.id },
            data: interview,
            onSubmit: handleSubmit,
            submitText,
            elements,
            helpTextCode: 'interview_form',
        }

        if (withContributions) {
            props['nestedScopeProps'] = [{
                formComponent: ContributionFormContainer,
                formProps: {withSpeakerDesignation: true},
                parent: interview,
                scope: 'contribution',
                elementRepresentation: showContribution,
            }]
        }

        return createElement(Form, props);
    }

    if (showForm) {
        return renderForm();
    }

    return (
        <div>
            <p>
                {t('edit.interview.processing')}
            </p>
            <p>
                <Link
                    to={`${pathBase}/interviews/${archiveId}`}>
                    {t('edit.interview.edit')}
                </Link>
            </p>
            <button
                type="button"
                className='Button return-to-form'
                onClick={returnToForm}
            >
                {t('edit.interview.return')}
            </button>
        </div>
    );
}

InterviewForm.propTypes = {
    interview: PropTypes.object,
    languages: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    withContributions: PropTypes.bool,
    contributionTypes: PropTypes.object.isRequired,
    submitText: PropTypes.string,
    submitData: PropTypes.func.isRequired,
};
