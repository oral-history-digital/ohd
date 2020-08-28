import React from 'react';
import Form from '../containers/form/Form';
import { t, fullname } from '../../../lib/utils';

export default class UploadTranscript extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOdt: false,
            showForm: true
        };

        this.handleFileChange = this.handleFileChange.bind(this);
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

                    <p>
                        <a href={`/transcript-import-template.ods`} download>
                          <span className="flyout-sub-tabs-content-ico-link">
                            <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download')}></i>
                            {t(this.props, 'transcript_template')}
                          </span>
                        </a>
                    </p>

                    <Form
                        scope='transcript'
                        onSubmit={function(params){_this.props.submitData(_this.props, params); _this.setState({showForm: false})}}
                        submitText='edit.upload_transcript.title'
                        values={{
                            archive_id: this.props.archiveId,
                            contributions_attributes: this.props.interview && this.props.interview.contributions
                        }}
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
                                help: 'activerecord.attributes.transcript.tape_durations_explanation',
                                hidden: !this.state.isOdt,
                                validate: function(v){return /^[\d{2}:\d{2}:\d{2},*]{1,}$/.test(v)}
                            },
                            { 
                                attribute: 'time_shifts',
                                help: 'activerecord.attributes.transcript.time_shifts_explanation',
                                hidden: !this.state.isOdt,
                                validate: function(v){return /^[\d{2}:\d{2}:\d{2},*]{1,}$/.test(v)}
                            },
                        ]}
                    />
                </div>
            )
        }
    }

    handleFileChange(name, file) {
        if (name === 'data' && file && /\.odt$/.test(file.name)) {
            this.setState({
                isOdt: true
            })
        }
    }

    render() {
        return this.content();
    }
}
