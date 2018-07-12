import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class UploadTranscript extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hideTapeAndArchiveInputs: false, 
        };

        this.handleTapeAndArchiveIdFromFileChange = this.handleTapeAndArchiveIdFromFileChange.bind(this);
        //this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleTapeAndArchiveIdFromFileChange(name, checked) {
        if (name === 'tape_and_archive_id_from_file') {
            // trigger the handleChange and with it the validate function of the inputs archiveId, tapeCount and tapeNumber
            // in other words: the errors on these inputs would prevent the form from being submitted
            // some new values together with the prop hidden will remove errors on these inputs
            //let dummy = checked ? (new Date) : '';
            this.setState({ 
                //archiveId: dummy,
                //tapeCount: dummy,
                //tapeNumber: dummy,
                hideTapeAndArchiveInputs: checked
            })
        }
    }

    //handleFileChange(name, file) {
        //if (name === 'data') {
            //let fileNameParts = file.name.replace(/\.[^/.]+$/, "").split('_')
            //this.setState({ 
                //archiveId: fileNameParts[0],
                //tapeCount: fileNameParts[1],
                //tapeNumber: fileNameParts[2],
            //})
        //}
    //}

    render() {
        let tabIndex = this.props.locales.length + 5;
        let _this = this;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <AuthShowContainer ifLoggedIn={true}>
                    <Form 
                        scope='transcripts'
                        onSubmit={this.props.submitData}
                        submitText='edit_interview.upload_transcript'
                        elements={[
                            {
                                elementType: 'select',
                                attribute: 'collection_id',
                                values: this.props.collections,
                                withEmpty: true,
                                validate: function(v){return v !== ''},
                                individualErrorMsg: 'empty'
                            },
                            { 
                                attribute: 'data',
                                elementType: 'input',
                                type: 'file',
                                validate: function(v){return v instanceof File},
                                //handleChangeCallback: this.handleFileChange
                            },
                            { attribute: '[file_column_names]timecode' },
                            { attribute: '[file_column_names]transcript' },
                            {
                                elementType: 'select',
                                attribute: '[file_column_languages]transcript',
                                values: this.props.languages,
                                withEmpty: true,
                                validate: function(v){return v !== ''} 
                            },
                            { attribute: '[file_column_names]translation_one' },
                            {
                                elementType: 'select',
                                attribute: '[file_column_languages]translation_one',
                                values: this.props.languages,
                                withEmpty: true,
                                //validate: function(v){return v !== ''} 
                            },
                            { attribute: '[file_column_names]translation_two' },
                            {
                                elementType: 'select',
                                attribute: '[file_column_languages]translation_two',
                                values: this.props.languages,
                                withEmpty: true,
                                //validate: function(v){return v !== ''} 
                            },
                            { attribute: '[file_column_names]annotations' },
                            { 
                                attribute: 'tape_and_archive_id_from_file',
                                elementType: 'input',
                                type: 'checkbox',
                                handleChangeCallback: this.handleTapeAndArchiveIdFromFileChange
                            },
                            { 
                                attribute: 'archive_id',
                                hidden: this.state.hideTapeAndArchiveInputs,
                                //value: this.state.dummy,
                                //value: this.state.archiveId,
                                validate: function(v){return _this.state.hideTapeAndArchiveInputs || /^[A-z]{2}\d{3}$/.test(v)}
                            },
                            { 
                                attribute: 'tape_count',
                                hidden: this.state.hideTapeAndArchiveInputs,
                                //value: this.state.dummy,
                                //value: this.state.tapeCount,
                                validate: function(v){return _this.state.hideTapeAndArchiveInputs || /^\d{1}$/.test(v)}
                            },
                            { 
                                attribute: 'tape_number',
                                hidden: this.state.hideTapeAndArchiveInputs,
                                //value: this.state.dummy,
                                //value: this.state.tapeNumber,
                                validate: function(v){return _this.state.hideTapeAndArchiveInputs || /^\d{1}$/.test(v)}
                            },
                        ]}
                    />
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </WrapperPageContainer>
        );
    }
}
