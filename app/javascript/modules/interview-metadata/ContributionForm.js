import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { Fetch, getPeopleForCurrentProjectFetched } from 'modules/data';
import { INDEX_INDEXING } from 'modules/sidebar';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function ContributionForm({
    people,
    peopleStatus,
    withSpeakerDesignation,
    project,
    projects,
    projectId,
    locale,
    contribution,
    contributionTypes,
    interview,
    formClasses,
    onSubmit,
    setSidebarTabsIndex,
    fetchData,
    submitData,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    useEffect(() => {
        if (!peopleStatus[`for_projects_${project?.id}`]) {
            fetchData({ locale, projectId, projects }, 'people', null, null, `for_projects=${project?.id}`);
        }
    });

    const formElements = [
        {
            elementType: 'select',
            attribute: 'person_id',
            values: people && Object.values(people),
            value: contribution?.person_id,
            withEmpty: true,
            validate: v => v !== '',
            individualErrorMsg: 'empty',
        },
        {
            elementType: 'select',
            attribute: 'contribution_type_id',
            values: contributionTypes && Object.values(contributionTypes),
            value: contribution?.contribution_type_id,
            optionsScope: 'contributions',
            keepOrder: true,
            withEmpty: true,
            validate: v => v !== '',
        },
        {
            elementType: 'select',
            attribute: 'workflow_state',
            values: ["unshared", "public"],
            value: contribution ? contribution.workflow_state : 'public',
            optionsScope: 'workflow_states',
        }
    ]
    if (withSpeakerDesignation) {
        formElements.push({
            attribute: 'speaker_designation',
            value: contribution?.speaker_designation,
        });
    }

    return (
        <Fetch
            fetchParams={['people', null, null, `for_projects=${project?.id}`]}
            testSelector={getPeopleForCurrentProjectFetched}
        >
            <Form
                scope='contribution'
                data={contribution}
                values={{
                    interview_id: interview?.id,
                    workflow_state: contribution ? contribution.workflow_state : 'public'
                }}
                onSubmit={(params) => {
                    if (typeof submitData === 'function') {
                        submitData({ locale, projectId, projects }, params);
                    }
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                formClasses={formClasses}
                elements={formElements}
            />
            <p />
            <Link
                to={`${pathBase}/people`}
                className='Link admin'
                onClick={() => {
                    setSidebarTabsIndex(INDEX_INDEXING);
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
            >
                {t("edit.person.admin")}
            </Link>
        </Fetch>
    );
}

ContributionForm.propTypes = {
    interview: PropTypes.object.isRequired,
    withSpeakerDesignation: PropTypes.bool,
    contribution: PropTypes.object,
    contributionTypes: PropTypes.object.isRequired,
    formClasses: PropTypes.string,
    people: PropTypes.object,
    peopleStatus: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    translations: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    setSidebarTabsIndex: PropTypes.func.isRequired,
};
