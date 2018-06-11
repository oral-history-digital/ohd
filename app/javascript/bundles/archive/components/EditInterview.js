import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class EditInterview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hideTapeAndArchiveInputs: false, 
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(name, value) {
        if (name === 'tape_and_archive_id_from_file') {
            this.setState({ 
                hideTapeAndArchiveInputs: value
            })
        }
    }

    render() {
        let tabIndex = this.props.locales.length + 4;
        let _this = this;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <AuthShowContainer ifLoggedIn={true}>
                    <Form 
                        scope='interview'
                        onSubmit={this.props.submitInterview}
                        submitText={this.props.archiveId ? 'edit_interview.new' : 'edit_interview.edit'}
                        elements={[
                            {
                                elementType: 'select',
                                attribute: 'collection_id',
                                values: this.props.collections,
                                withEmpty: true,
                                validate: function(v){return v !== ''} 
                            },
                            { 
                                attribute: 'tape_and_archive_id_from_file',
                                elementType: 'input',
                                type: 'checkbox',
                                handleChangeCallback: this.handleChange
                            },
                            { 
                                attribute: 'archive_id',
                                hidden: this.state.hideTapeAndArchiveInputs,
                                validate: function(v){return _this.state.hideTapeAndArchiveInputs || /^[A-z]{2}\d{3}$/.test(v)}
                            },
                            { 
                                attribute: 'tape_count',
                                hidden: this.state.hideTapeAndArchiveInputs,
                                validate: function(v){return _this.state.hideTapeAndArchiveInputs || /^\d{1}$/.test(v)}
                            },
                            { 
                                attribute: 'tape_number',
                                hidden: this.state.hideTapeAndArchiveInputs,
                                validate: function(v){return _this.state.hideTapeAndArchiveInputs || /^\d{1}$/.test(v)}
                            },
                            {
                                elementType: 'select',
                                attribute: 'language_id',
                                values: this.props.languages,
                                withEmpty: true,
                                validate: function(v){return v !== ''} 
                            },
                            { attribute: 'interview_date' },
                            { attribute: 'video' },
                            { attribute: 'translated' },
                            { attribute: 'published' },
                            { attribute: 'agreement' },
                            { attribute: 'appellation' },
                            { attribute: 'first_name' },
                            { attribute: 'last_name' },
                            { attribute: 'middle_names' },
                            { attribute: 'birth_name' },
                            { attribute: 'gender' },
                            { attribute: 'date_of_birth' },
                            { 
                                attribute: 'data',
                                elementType: 'input',
                                type: 'file',
                                validate: function(v){return v instanceof File}
                            },
                            {
                                attribute: 'timecode',

                            },
                            {
                                attribute: 'transcript',
                            },
                            {
                                attribute: 'translation',
                            },
                            {
                                attribute: 'annotations',
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
