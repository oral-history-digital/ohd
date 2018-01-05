import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import logos from '../../../images/logos-footer.png'


export default class Home extends React.Component {

    content() {
        return (
                <WrapperPageContainer
                    tabIndex={0}>
                    <div className='wrapper-content home-content'
                        dangerouslySetInnerHTML = {{__html: this.props.homeContent}}
                    />

                </WrapperPageContainer>
        )
    }

    render() {
        return this.content();
    }

}
