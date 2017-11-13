import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';


export default class Home extends React.Component {

    componentDidMount() {
        this.props.fetchStaticContent();
    }


    content() {
        return (
                <WrapperPageContainer
                    tabIndex={0}>
                    <div className='wrapper-content'
                        dangerouslySetInnerHTML = {{__html: this.props.homeContent}}
                    />

                </WrapperPageContainer>
        )
    }

    render() {
        return this.content();
    }

}
