import React from 'react';
import RegisterFormContainer from '../containers/RegisterFormContainer';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import { t } from '../../../lib/utils';


export default class Register extends React.Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    content() {
        if (!this.props.registrationStatus) {
            return (
                <div>
                    <h1>
                        {t(this.props, 'devise.registrations.link')}
                    </h1>
                    <p>
                    {t(this.props, 'user_registration.registration_text')}
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
