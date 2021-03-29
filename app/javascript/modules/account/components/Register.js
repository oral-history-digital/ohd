import React from 'react';

import { t } from 'modules/i18n';
import { ScrollToTop } from 'modules/user-agent';
import RegisterFormContainer from './RegisterFormContainer';

export default class Register extends React.Component {
    content() {
        if (!this.props.registrationStatus) {

            let conditionsLink = Object.values(this.props.externalLinks).filter(link => link.internal_name === 'conditions')[0];
            let privacyLink = Object.values(this.props.externalLinks).filter(link => link.internal_name === 'privacy_protection')[0];
            conditionsLink =  (conditionsLink && conditionsLink.url) || {}
            privacyLink =  (privacyLink && privacyLink.url) || {}

            return (
                <div>
                    <h1>
                        {t(this.props, 'devise.registrations.link')}
                    </h1>
                    <p>
                        {t(this.props, 'user_registration.registration_text_one')}
                        <a href={conditionsLink[this.props.locale]} target="_blank" title="" rel="noopener">
                            {t(this.props, 'user_registration.tos_agreement')}
                        </a>
                        {t(this.props, 'user_registration.registration_text_two')}
                        <a href={privacyLink[this.props.locale]} target="_blank" title="" rel="noopener">
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
            <ScrollToTop>
                <div className='wrapper-content register'>
                    {this.content()}
                </div>
            </ScrollToTop>
        );
    }
}
