import React from 'react';
import RegisterFormContainer from '../containers/RegisterFormContainer';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import { t } from '../../../lib/utils';


export default class Register extends React.Component {

    componentDidMount() {
        window.scrollTo(0, 1);
    }

    content() {
        if (!this.props.registrationStatus) {

            let conditionsLink; 
            let privacyLink; 
            if (this.props.externalLinks.conditions) {
                conditionsLink = this.props.externalLinks.conditions[this.props.locale];
                privacyLink = this.props.externalLinks.privacy_protection[this.props.locale];
            }

            return (
                <div>
                    <h1>
                        {t(this.props, 'devise.registrations.link')}
                    </h1>
                    <p>
                        {t(this.props, 'user_registration.registration_text_one')}
                        <a href={conditionsLink} target="_blank" title="">
                            {t(this.props, 'user_registration.tos_agreement')}
                        </a>
                        {t(this.props, 'user_registration.registration_text_two')}
                        <a href={privacyLink} target="_blank" title="">
                            {t(this.props, 'user_registration.priv_agreement_alias')}
                        </a>
                        {t(this.props, 'user_registration.registration_text_three')}
                    </p>
                    <RegisterFormContainer />
                </div>
            )
        } else {
            return (
                <p className='status' dangerouslySetInnerHTML = {{__html: this.props.registrationStatus}} />
            )
        }
    }

    render() {
        return (
            <WrapperPageContainer tabIndex={1}>
                <div className='wrapper-content register'>
                    {this.content()}
                </div>
            </WrapperPageContainer>
        )
    }

}
