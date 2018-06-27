import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
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
                <WrapperPageContainer tabIndex={0}>
                    <div className='wrapper-content register'>
                        {this.content()}
                    </div>
                </WrapperPageContainer>
        )
    }

}
