import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';


export default class Help extends React.Component {


    content() {
        return (
                <WrapperPageContainer>
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
