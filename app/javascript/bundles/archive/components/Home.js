import React from 'react';
import PropTypes from 'prop-types';
import { INDEX_NONE } from '../constants/flyoutTabs';

import StartPageVideo from './StartPageVideo';
import FeaturedInterviews from './FeaturedInterviews';

export default class Home extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 1);

        if (this.props.project.identifier === 'campscapes') {
            this.props.setFlyoutTabsIndex(INDEX_NONE);
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
            const url = `/${this.props.locale}/searches/archive`;
            this.props.history.push(url);
        }
    }

    moreText(text) {
        if (text) {
            return <p dangerouslySetInnerHTML={{__html: text}} />
        } else {
            return null;
        }
    }

    render() {
        if (this.props.project) {
            let projectTranslation = this.props.project.translations.find(t => t.locale === this.props.locale);
            return (
                <div className='wrapper-content home-content'>
                    {
                        this.props.showStartPageVideo ?
                            <StartPageVideo /> :
                            null
                    }
                    <div  className='home-text'>
                        <h1>{projectTranslation.name}</h1>
                        <div dangerouslySetInnerHTML={{__html: projectTranslation.introduction}} />
                    </div>
                    <div className="search-results-container">
                        {this.moreText(projectTranslation.more_text)}

                        {
                            this.props.showFeaturedInterviews ?
                                <FeaturedInterviews /> :
                                null
                        }
                    </div>
                </div>
            );
        }
    }
}

Home.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
    showStartPageVideo: PropTypes.bool.isRequired,
    showFeaturedInterviews: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
