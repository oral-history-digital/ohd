import React from 'react';
import Form from '../containers/form/Form';
import ContributionFormContainer from '../containers/ContributionFormContainer';
import { t, fullname } from '../../../lib/utils';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class AssignSpeakersForm extends React.Component {

    constructor(props) {
        super(props);
        this.showContribution = this.showContribution.bind(this);
        this.state = {
            showForm: true
        };
    }

    componentDidMount() {
        this.loadSpeakerDesignations();
    }

    componentDidUpdate() {
        this.loadSpeakerDesignations();
    }

    loadSpeakerDesignations() {
        if (
            !this.props.speakerDesignationsStatus[`for_interviews_${this.props.archiveId}`] ||
            this.props.speakerDesignationsStatus[`for_interviews_${this.props.archiveId}`].split('-')[0] === 'reload'
        ) {
            this.props.fetchData(this.props, 'interviews', this.props.archiveId, 'speaker_designations');
        }
    }

    showContribution(value) {
        return (
            <span>
                <span>{fullname(this.props, this.props.people[parseInt(value.person_id)]) + ', '}</span>
                <span>{t(this.props, `contributions.${value.contribution_type}`) + ', '}</span>
                <span>{value.speaker_designation}</span>
            </span>
        )
    }

    returnToForm() {
        this.setState({showForm: true});
    }

    formElements() {
        let elements = [];
        for (var i in this.props.interview.speaker_designations) {
            elements.push({ 
                elementType: 'select',
                attribute: `[speakers]${this.props.interview.speaker_designations[i]}`,
                label: `${t(this.props, 'edit.update_speaker.speaker_for_speaker_designation')} ${this.props.interview.speaker_designations[i]}`,
                values: Object.values(this.props.people),
                withEmpty: true,
            });
        }
        return elements;
    }

    form() {
        if (this.state.showForm) {
            let _this = this;
            return (
                <Form 
                    scope='update_speaker'
                    onSubmit={function(params){_this.props.submitData(_this.props, params);_this.setState({showForm: false})}}
                    values={{
                        id: this.props.interview.archive_id
                    }}
                    elements={this.formElements()}
                    subForm={this.allHiddenSpeakerDesignationsAssigned() && ContributionFormContainer}
                    subFormProps={{withSpeakerDesignation: true}}
                    subFormScope='contribution'
                    subScopeRepresentation={this.showContribution}
                />
            )
        }
    }

    msg() {
        //if (!this.state.showForm) {
        if (true) {
            return (
                <div>
                    <p>
                        {t(this.props, 'edit.update_speaker.' + this.props.speakerDesignationsStatus[`for_interviews_${this.props.archiveId}`])}
                    </p>
                </div>
            )
        }
    }

    //
    // hidden speaker designations are those written in column 'speaker' from table 'segments'
    //
    allHiddenSpeakerDesignationsAssigned() {
        return Object.keys(this.props.interview.speaker_designations).length < 1;
    }

    render() {
        if (
            // speaker designations used in this interview`s segments loaded?
            this.props.speakerDesignationsStatus[`for_interviews_${this.props.archiveId}`] &&
            this.props.speakerDesignationsStatus[`for_interviews_${this.props.archiveId}`] != 'fetching' 
        ) {
            return (
                <div>
                    {this.msg()}
                    {this.form()}
                </div>
            )
         } else {
            return <div className="facets-spinner"><img src={spinnerSrc} /></div>;
         }
    }
}
