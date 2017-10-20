import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';


export default class Help extends React.Component {


    content() {
        return (
                <WrapperPageContainer
                    tabindex={0}>
                    <div>
                        <div className='title'>{'Legal Notice'}</div>
                    </div>
                </WrapperPageContainer>
        )
    }

    render() {
        return this.content();
    }

}
