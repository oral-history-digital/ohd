import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { INDEX_NONE, INDEX_ACCOUNT } from 'modules/flyout-tabs';
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
        setFlyoutTabsIndex(isCampscapesProject ? INDEX_NONE : INDEX_ACCOUNT);
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
                <div className="home-text">
                    <h1>{projectTranslation?.name}</h1>
                    <div dangerouslySetInnerHTML={{__html: projectTranslation?.introduction}} />
                </div>
                {
                    projectTranslation?.more_text && (
                        <p
                            className="home-paragraph u-mt"
                            dangerouslySetInnerHTML={{__html: projectTranslation.more_text}}
                        />
                    )
                }
                {
                    showFeaturedInterviews ?
                        <FeaturedInterviews /> :
                        null
                }
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
