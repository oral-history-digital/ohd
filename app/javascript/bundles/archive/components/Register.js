import React from 'react';
import RegisterFormContainer from '../containers/RegisterFormContainer';
import WrapperPageContainer from '../containers/WrapperPageContainer';


export default class Register extends React.Component {

    render() {
        return (
            <WrapperPageContainer tabIndex={1}>
                <RegisterFormContainer />
            </WrapperPageContainer>
        )
    }

}
