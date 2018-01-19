import React from 'react';
import RegisterFormContainer from '../containers/RegisterFormContainer';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import { t } from '../../../lib/utils';


export default class Register extends React.Component {

    render() {
        return (
            <WrapperPageContainer tabIndex={1}>
                <div className='wrapper-content register'>
                    <h1>
                        {t(this.props, 'devise.registrations.link')}
                    </h1>
                    <p>
                        {t(this.props, 'user_registration.registration_text')}
                    </p>
                    <RegisterFormContainer />
                </div>
            </WrapperPageContainer>
        )
    }

}
