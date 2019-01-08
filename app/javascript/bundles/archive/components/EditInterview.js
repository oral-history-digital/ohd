import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import InterviewFormContainer from '../containers/InterviewFormContainer';
import {Link} from 'react-router-dom';
import { t } from '../../../lib/utils';

export default class EditInterview extends React.Component {

    content() {
        if (
            this.props.processed 
        ) {
            return (
                <div>
                    <p>
                        {t(this.props, 'edit.interview.processed')}
                        <Link to={'/' + this.props.locale + '/interviews/' + this.props.processed}>
                            {this.props.processed}
                        </Link>
                    </p>
                    <button 
                        className='return-to-upload'
                        onClick={() => this.props.returnToForm('interviews')}
                    >
                        {t(this.props, 'edit.interview.return')}
                    </button>
                </div>
            )
        } else {
            return (
                <InterviewFormContainer submitText='edit.interview.new' />
            )
        }
    }

    render() {
        let tabIndex = this.props.locales.length + 5;
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
