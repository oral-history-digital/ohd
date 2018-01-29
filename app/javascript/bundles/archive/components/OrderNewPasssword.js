import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import OrderNewPasswordFormContainer from '../containers/OrderNewPasswordFormContainer';


export default class OrderNewPassword extends React.Component {

    content() {
        if (this.props.registrationStatus) {
            return <div className='errors'>{this.props.orderNewPasswordStatus}</div>;
        } else {
            return <OrderNewPasswordFormContainer />;
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
