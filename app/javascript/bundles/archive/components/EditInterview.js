import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import InterviewFormContainer from '../containers/InterviewFormContainer';
import { t } from '../../../lib/utils';

export default class EditInterview extends React.Component {

    returnToForm() {
        this.props.returnToForm('interviews');
    }

    content() {
        if (
            this.props.processed 
        ) {
            return (
                <div>
                    <p>
                        {t(this.props, 'edit.interview.processed')}
                        {this.props.processed}
                    </p>
                    <div 
                        className='return-to-upload'
                        onClick={() => this.returnToForm()}
                    >
                        {t(this.props, 'edit.interview.return')}
                    </div>
                </div>
            )
        } else {
            return (
                <InterviewFormContainer submitText='edit.interview.new' />
            )
        }
    }

    render() {
        let tabIndex = this.props.locales.length + 4;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <AuthShowContainer ifLoggedIn={true}>
                    {this.content()}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </WrapperPageContainer>
        );
    }
}
