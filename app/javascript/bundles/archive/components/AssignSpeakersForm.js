import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class AssignSpeakersForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.loadInitials();
    }

    componentDidUpdate() {
        this.loadInitials();
    }

    loadInitials() {
        if (
            !this.props.initialsStatus[`for_interviews_${this.props.archiveId}`] ||
            this.props.initialsStatus[`for_interviews_${this.props.archiveId}`].split('-')[0] === 'reload'
        ) {
            this.props.fetchData('interviews', this.props.archiveId, 'initials');
        }
    }

    returnToForm() {
        this.props.returnToForm('interviews');
    }

    formElements() {
        let elements = [];
        for (var i in this.props.interview.initials) {
            elements.push({ 
                elementType: 'select',
                attribute: `[speakers]${this.props.interview.initials[i]}`,
                label: `${t(this.props, 'edit.update_speaker.speaker_for_initials')} ${this.props.interview.initials[i]}`,
                values: Object.values(this.props.people),
                withEmpty: true,
                //validate: function(v){return v !== ''} 
            });
        }
        //elements.push({ 
            //attribute: 'split_segments',
            //elementType: 'input',
            //type: 'checkbox',
        //});
        //elements.push({ 
            //attribute: 'cut_initials',
            //elementType: 'input',
            //type: 'checkbox',
        //});
        return elements;
    }
        
    msg() {
        let msg;
        if (this.props.initialsStatus.processing_speaker_update === this.props.interview.archive_id) {
            //msg = this.props.processing_speakers_update;
            msg = 'edit.update_speaker.processing_speakers_update';
        } else if (Object.keys(this.props.interview.initials).length < 1) {
            msg = 'edit.update_speaker.no_initials_found';
        }
        return msg;
    }

    render() {
        if (
            // initials used in this interview`s segments loaded?
            this.props.initialsStatus[`for_interviews_${this.props.archiveId}`] &&
            this.props.initialsStatus[`for_interviews_${this.props.archiveId}`].split('-')[0] === 'fetched' &&

            // people loaded?
            this.props.peopleStatus.all &&
            this.props.peopleStatus.all.split('-')[0] === 'fetched'
        ) {

            let msg = this.msg();
            if (msg) {
                return (
                    <div>
                        <p>
                            {t(this.props, msg)}
                        </p>
                    </div>
                )
            } else {
                let _this = this;
                return (
                    <Form 
                        scope='update_speaker'
                        onSubmit={this.props.submitData}
                        values={{
                            id: this.props.interview.archive_id
                        }}
                        elements={_this.formElements()}
                    />
                )
            }
        } else {
            return <div className="facets-spinner"><img src={spinnerSrc} /></div>;
        }
    }
}
