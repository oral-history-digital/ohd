import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class NewInterview extends React.Component {

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
        let tabIndex = this.props.locales.length + 4;
        let _this = this;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <AuthShowContainer ifLoggedIn={true}>
                    <Form 
                        scope='interview'
                        onSubmit={this.props.submitInterview}
                        submitText={this.props.archiveId ? 'edit.interview.edit' : 'edit.interview.new'}
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
                                attribute: 'archive_id',
                                hidden: this.state.hideTapeAndArchiveInputs,
                                //value: this.state.dummy,
                                value: this.state.archiveId,
                                validate: function(v){return _this.state.hideTapeAndArchiveInputs || /^[A-z]{2}\d{3}$/.test(v)}
                            },
                            {
                                elementType: 'select',
                                attribute: 'language_id',
                                values: this.props.languages,
                                withEmpty: true,
                                validate: function(v){return v !== ''} 
                            },
                            { 
                                attribute: 'interview_date',
                                elementType: 'input',
                                type: 'date'
                            },
                            { 
                                attribute: 'video',
                                elementType: 'input',
                                type: 'checkbox'
                            },
                            { 
                                attribute: 'translated',
                                elementType: 'input',
                                type: 'checkbox'
                            },
                        ]}
                    />
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </WrapperPageContainer>
        );
                            //{ attribute: 'appellation' },
                            //{ attribute: 'first_name' },
                            //{ attribute: 'last_name' },
                            //{ attribute: 'middle_names' },
                            //{ attribute: 'birth_name' },
                            //{ attribute: 'gender' },
                            //{ attribute: 'date_of_birth' },
    }
}
