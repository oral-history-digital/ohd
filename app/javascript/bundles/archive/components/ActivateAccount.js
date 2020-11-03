import React from 'react';
import ChangePasswordFormContainer from '../containers/ChangePasswordFormContainer';

export default class ActivateAccount extends React.Component {

    content() {
        if (this.props.registrationStatus) {
            return <div className='errors'>{this.props.registrationStatus}</div>;
        } else {
            return <ChangePasswordFormContainer />;
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
