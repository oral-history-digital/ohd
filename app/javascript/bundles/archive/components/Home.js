import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';


export default class Home extends React.Component {


    content() {
        return (
                <WrapperPageContainer
                    tabIndex={0}>
                    <div>
                        <div className='title'>{'Home'}</div>
                    </div>
                </WrapperPageContainer>
        )
    }

    render() {
        return this.content();
    }

}
