import React from 'react';
import Form from '../containers/form/Form';
import ContributionFormContainer from '../containers/ContributionFormContainer';
import { t, fullname } from '../../../lib/utils';

export default class UploadTranscript extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOdt: false,
            showForm: true
        };

        this.showContribution = this.showContribution.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
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

    content() {
        if (
            !this.state.showForm
        ) {
            return (
                <div>
                    <p>
                        {t(this.props, 'edit.upload.processing')}
                    </p>
                    <div 
                        className='return-to-upload'
                        onClick={() => this.returnToForm()}
                    >
                        {t(this.props, 'edit.upload.return')}
                    </div>
                </div>
            )
        } else {
            let _this = this;
            return (
                <div>
                    <p className='explanation'>
                        {t(this.props, `upload.explanation.transcript`)}
                    </p>

                    <a href={`/transcript-import-template.ods`} download>{`transcript-import-template.ods`}</a>

                    <Form 
                        scope='transcript'
                        onSubmit={function(params){_this.props.submitData(_this.props, params); _this.setState({showForm: false})}}
                        submitText='edit.upload_transcript.title'
                        values={{archive_id: this.props.archiveId }}
                        elements={[
                            { 
                                attribute: 'data',
                                elementType: 'input',
                                type: 'file',
                                validate: function(v){return v instanceof File},
                                handlechangecallback: this.handleFileChange
                            },
                            {
                                elementType: 'select',
                                attribute: 'transcript_language_id',
                                label: t(this.props, 'activerecord.attributes.transcript.transcript_language_id'),
                                values: this.props.languages,
                                withEmpty: true,
                                validate: function(v){return v !== ''} 
                            },
                            { 
                                attribute: 'tape_number',
                                hidden: this.state.isOdt,
                                validate: function(v){return /^\d{1,2}$/.test(v)}
                            },
                            { 
                                elementType: 'input',
                                attribute: 'delete_existing',
                                type: 'checkbox'
                            },
                            { 
                                attribute: 'tape_durations',
                                help: t(this.props, 'activerecord.attributes.transcript.tape_durations_explanation'),
                                hidden: !this.state.isOdt,
                                validate: function(v){return /^[\d{2}:\d{2}:\d{2},*]{1,}$/.test(v)}
                            },
                            { 
                                attribute: 'time_shifts',
                                help: t(this.props, 'activerecord.attributes.transcript.time_shifts_explanation'),
                                hidden: !this.state.isOdt,
                                validate: function(v){return /^[\d{2}:\d{2}:\d{2},*]{1,}$/.test(v)}
                            },
                        ]}
                        subForm={ContributionFormContainer}
                        subFormProps={{withSpeakerDesignation: true}}
                        subFormScope='contribution'
                        subScopeRepresentation={this.showContribution}
                    />
                </div>
            )
        }
    }

    handleFileChange(name, file) {
        if (name === 'data' && /\.odt$/.test(file.name)) {
            this.setState({
                isOdt: true
            })
        }
    }

    render() {
        return this.content();
    }
}
