import { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
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
        if (!this.props.peopleStatus.all) {
            this.props.fetchData(this.props, 'people', null, null, 'all');
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
        const { setFlyoutTabsIndex, closeArchivePopup, submitData, onSubmit } = this.props;

        return (
            <div>
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
            </div>
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
