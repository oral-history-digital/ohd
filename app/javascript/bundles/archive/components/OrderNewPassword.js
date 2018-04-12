import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import OrderNewPasswordFormContainer from '../containers/OrderNewPasswordFormContainer';
import { t } from '../../../lib/utils';


export default class OrderNewPassword extends React.Component {

    passwordStatus() {
        return <div className='text'>{t(this.props, this.props.orderNewPasswordStatus)}</div>;
    }

    error() {
        if (this.props.error) {
            return <div className='errors'>{t(this.props, this.props.error)}</div>;
        } 
    }

    content() {
        if (this.props.orderNewPasswordStatus) {
            return this.passwordStatus();
        } else {
            return (
                <div>
                    <h1 className='forgot-password-header'>{t(this.props, 'devise.passwords.forgot')}</h1>
                    <p className='forgot-passord-text'>{t(this.props, 'devise.passwords.send_instructions')}</p>
                    {this.error()}
                    <OrderNewPasswordFormContainer />
                </div>
            )
        }
    }

    render() {
        return (
                <WrapperPageContainer tabIndex={0}>
                    <div className='wrapper-content register'>
                        {this.content()}
                    </div>
                </WrapperPageContainer>
        )
    }

}
