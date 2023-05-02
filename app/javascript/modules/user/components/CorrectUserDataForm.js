import { useState } from 'react';
import request from 'superagent';

import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function CorrectUserDataForm({
    project,
    projectId,
    currentUser,
    userProject,
    countryKeys,
    submitData,
    onSubmit,
    onCancel,
}) {

    const { t, locale } = useI18n();
    const pathBase = usePathBase();

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
                validate: function(v){return v && v.length > 1}
            },
            {
                elementType: 'input',
                attribute: 'last_name',
                label: t('activerecord.attributes.user.last_name'),
                type: 'text',
                validate: function(v){return v && v.length > 1}
            },
        ];

        const addressElements = [
            {
                elementType: 'input',
                attribute: 'street',
                type: 'text',
                validate: function(v){return v && v.length > 1}
            },
            {
                elementType: 'input',
                attribute: 'zipcode',
                label: t('activerecord.attributes.user.zipcode'),
                type: 'text',
                validate: function(v){return v && v.length > 1}
            },
            {
                elementType: 'input',
                attribute: 'city',
                type: 'text',
                validate: function(v){return v && v.length > 1}
            }
        ];

        const countrySelect = [
            {
                elementType: 'select',
                attribute: 'country',
                optionsScope: 'countries',
                values: countryKeys && countryKeys[locale],
                withEmpty: true,
                validate: function(v){return v && v.length > 1}
            },
        ];

        const projectAccessElements = [
            {
                elementType: 'input',
                attribute: 'organization',
                label: t('activerecord.attributes.user.organization'),
                type: 'text',
                validate: function(v){return v?.length > 1}
            },
            {
                elementType: 'select',
                attribute: 'job_description',
                label: t('activerecord.attributes.user.job_description'),
                optionsScope: 'user_project.job_description',
                values: ['researcher', 'filmmaker', 'journalist', 'teacher', 'memorial_staff', 'pupil', 'student', 'other'],
                keepOrder: true,
                withEmpty: true,
                validate: function(v){return v?.length > 1}
            },
            {
                elementType: 'select',
                attribute: 'research_intentions',
                label: t('activerecord.attributes.user.research_intentions'),
                optionsScope: 'user_project.research_intentions',
                values: ['exhibition', 'education', 'film', 'genealogy', 'art', 'personal_interest', 'press_publishing', 'school_project', 'university_teaching', 'scientific_paper', 'other'],
                keepOrder: true,
                withEmpty: true,
                validate: function(v){return v?.length > 1}
            },
            {
                elementType: 'textarea',
                attribute: 'specification',
                label: t('activerecord.attributes.user.specification'),
                validate: function(v){return v?.length > 10}
            },
        ];

        return nameElements.concat(addressElements).concat(countrySelect).concat(projectAccessElements);
    }

    return (
        <Form
            scope='user_project'
            onSubmit={(params) => { submitData({ locale, projectId, project }, params); onSubmit(); }}
            elements={formElements()}
            values={{
                workflow_state: 'correct_project_access_data',
            }}
            data={userProject}
            onCancel={onCancel}
        />
    );
}
