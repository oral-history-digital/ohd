import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import OrderNewPasswordFormContainer from '../containers/OrderNewPasswordFormContainer';
import { t } from '../../../lib/utils';


export default class OrderNewPassword extends React.Component {

    content() {
        if (this.props.orderNewPasswordStatus) {
            return <div className='messages'>{t(this.props, this.props.orderNewPasswordStatus)}</div>;
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
