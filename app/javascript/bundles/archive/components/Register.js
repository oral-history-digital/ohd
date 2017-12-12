import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';


export default class Register extends React.Component {

    content() {
        return (
            <WrapperPageContainer
                tabIndex={1}>
                <div className='wrapper-content register'
                     dangerouslySetInnerHTML = {{__html: this.props.registerContent}}
                />

            </WrapperPageContainer>
        )
    }

    render() {
        return this.content();
    }

}
