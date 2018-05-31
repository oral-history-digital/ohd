import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class EditInterview extends React.Component {

    render() {
        let tabIndex = this.props.locales.length + 5
        tabIndex = this.props.archiveId ? tabIndex + 1 : tabIndex
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <AuthShowContainer ifLoggedIn={true}>
                    <Form 
                        scope='interview'
                        onSubmit={this.props.submitInterview}
                        submitText={this.props.archiveId ? 'edit_interview.new' : 'edit_interview.edit'}
                        elements={[
                            { attribute: 'archive_id' },
                            { attribute: 'language' },
                            { attribute: 'collection' },
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
