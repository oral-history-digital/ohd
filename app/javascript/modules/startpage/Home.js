import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { INDEX_NONE } from 'modules/flyout-tabs';
import { RedirectOnLogin } from 'modules/account';
import { ScrollToTop } from 'modules/user-agent';
import StartPageVideo from './StartPageVideo';
import FeaturedInterviews from './FeaturedInterviews';

export default function Home({
    isCampscapesProject,
    projectTranslation,
    showStartPageVideo,
    showFeaturedInterviews,
    setFlyoutTabsIndex,
}) {
    useEffect(() => {
        if (isCampscapesProject) {
            setFlyoutTabsIndex(INDEX_NONE);
        }
    }, []);

    return (
        <ScrollToTop>
            <div className='wrapper-content home-content'>
                <RedirectOnLogin path="/searches/archive" />
                {
                    showStartPageVideo ?
                        <StartPageVideo /> :
                        null
                }
                <div className='home-text'>
                    <h1>{projectTranslation.name}</h1>
                    <div dangerouslySetInnerHTML={{__html: projectTranslation.introduction}} />
                </div>
                <div className="search-results-container">
                    {
                        projectTranslation.more_text &&
                        (<p dangerouslySetInnerHTML={{__html: projectTranslation.more_text}} />)
                    }
                    {
                        showFeaturedInterviews ?
                            <FeaturedInterviews /> :
                            null
                    }
                </div>
            </div>
        </ScrollToTop>
    );
}

Home.propTypes = {
    isCampscapesProject: PropTypes.bool.isRequired,
    projectTranslation: PropTypes.object.isRequired,
    showStartPageVideo: PropTypes.bool.isRequired,
    showFeaturedInterviews: PropTypes.bool.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
