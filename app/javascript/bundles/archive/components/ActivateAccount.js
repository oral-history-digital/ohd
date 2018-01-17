import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import ChangePasswordFormContainer from '../containers/ChangePasswordFormContainer';


export default class ActivateAccount extends React.Component {

    render() {
        return (
                <WrapperPageContainer tabIndex={0}>
                    <ChangePasswordFormContainer />
                </WrapperPageContainer>
        )
    }

}
