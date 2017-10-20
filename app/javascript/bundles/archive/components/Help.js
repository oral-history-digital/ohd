import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';


export default class Help extends React.Component {


    content() {
        return (
                <WrapperPageContainer
                    tabIndex={7}>
                    <div>
                        <div className='title'>{'Help'}</div>
                    </div>
                </WrapperPageContainer>
        )
    }

    render() {
        return this.content();
    }

}
