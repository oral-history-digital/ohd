import React from 'react';
import OrderNewPasswordFormContainer from '../containers/OrderNewPasswordFormContainer';
import { t, pathBase } from '../../../lib/utils';

export default class OrderNewPassword extends React.Component {

    passwordStatus() {
        return <div className='text'>{t(this.props, this.props.orderNewPasswordStatus)}</div>;
    }

    error() {
        if (this.props.error) {
            return <div className='errors' dangerouslySetInnerHTML={{__html: t(this.props, this.props.error)}} />;
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
            <div className='wrapper-content register'>
                {this.content()}
            </div>
        )
    }
}
