import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import PersonFormContainer from '../containers/PersonFormContainer';
import { t } from '../../../lib/utils';

export default class EditPerson extends React.Component {

    returnToForm() {
        this.props.returnToForm('people');
    }

    content() {
        if (
            this.props.processed 
        ) {
            return (
                <div>
                    <p>
                        {t(this.props, 'edit.person.processed')}
                        {this.props.processed}
                    </p>
                    <div 
                        className='return-to-upload'
                        onClick={() => this.returnToForm()}
                    >
                        {t(this.props, 'edit.person.return')}
                    </div>
                </div>
            )
        } else {
            return (
                <PersonFormContainer />
            )
        }
    }

    render() {
        let tabIndex = this.props.locales.length + 8;
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
