import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import logo1 from '../../../images/auswaertiges-amt-logo.png';
import logo2 from '../../../images/snf-logo.jpg';
import logo3 from '../../../images/evz-off-co-d-hd-s.jpg';
import logo4 from '../../../images/fu-logo-3x.png'
import PropTypes from 'prop-types';

export default class Home extends React.Component {


    static contextTypes = {
        router: PropTypes.object
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.account.email === undefined && this.props.account.email) {
            const url = "/" + this.props.locale + "/searches/archive";
            //TODO: find solution for first call
            //this.context.router.history.push(url);
        }
    }


    componentDidMount() {
        window.scrollTo(0, 0);
    }

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
