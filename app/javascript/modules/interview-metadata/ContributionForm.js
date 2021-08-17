import { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { Fetch, getPeopleForCurrentProjectFetched } from 'modules/data';
import { INDEX_INDEXING } from 'modules/flyout-tabs';
import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';

export default class ContributionForm extends Component {

    componentDidMount() {
        this.loadAllPeople();
    }

    componentDidUpdate() {
        this.loadAllPeople();
    }

    loadAllPeople() {
        if (!this.props.peopleStatus[`for_projects_${this.props.project?.id}`]) {
            this.props.fetchData(this.props, 'people', null, null, `for_projects=${this.props.project?.id}`);
        }
    }

    formElements() {
        let elements = [
            {
                elementType: 'select',
                attribute: 'person_id',
                values: this.props.people && Object.values(this.props.people),
                value: this.props.contribution && this.props.contribution.person_id,
                withEmpty: true,
                validate: function(v){return v !== ''},
                individualErrorMsg: 'empty'
            },
            {
                elementType: 'select',
                attribute: 'contribution_type_id',
                values: this.props.contributionTypes && Object.values(this.props.contributionTypes),
                value: this.props.contribution && this.props.contribution.contribution_type_id,
                optionsScope: 'contributions',
                keepOrder: true,
                withEmpty: true,
                validate: function(v){return v !== ''}
            },
            {
                elementType: 'select',
                attribute: 'workflow_state',
                values: ["unshared", "public"],
                value: this.props.contribution && this.props.contribution.workflow_state,
                optionsScope: 'workflow_states',
            }
        ]
        if (this.props.withSpeakerDesignation) {
            elements.push({
                attribute: 'speaker_designation',
                value: this.props.contribution && this.props.contribution.speaker_designation,
            });
        }
        return elements;
    }

    render() {
        const { setFlyoutTabsIndex, closeArchivePopup, submitData, onSubmit, project } = this.props;

        return (
            <Fetch
                fetchParams={['people', null, null, `for_projects=${project?.id}`]}
                testSelector={getPeopleForCurrentProjectFetched}
            >
                <Form
                    scope='contribution'
                    data={this.props.contribution}
                    values={{
                        interview_id: this.props.interview && this.props.interview.id
                    }}
                    onSubmit={(params) => {
                        if (typeof submitData === 'function') {
                            submitData(this.props, params);
                        }
                        closeArchivePopup();
                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }
                    }}
                    formClasses={this.props.formClasses}
                    elements={this.formElements()}
                />
                <p />
                <Link
                    to={`${pathBase(this.props)}/people`}
                    className='admin'
                    onClick={() => {
                        setFlyoutTabsIndex(INDEX_INDEXING);
                        closeArchivePopup();
                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }
                    }}
                >
                    {t(this.props, "edit.person.admin")}
                </Link>
            </Fetch>
        );
    }
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
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    translations: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    closeArchivePopup: PropTypes.func.isRequired,
};
