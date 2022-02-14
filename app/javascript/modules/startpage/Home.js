import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { INDEX_NONE, INDEX_ACCOUNT } from 'modules/sidebar';
import { RedirectOnLogin } from 'modules/account';
import { ScrollToTop } from 'modules/user-agent';
import StartPageVideo from './StartPageVideo';
import FeaturedInterviews from './FeaturedInterviews';

export default function Home({
    project,
    isCampscapesProject,
    projectTranslation,
    showStartPageVideo,
    showFeaturedInterviews,
    setSidebarTabsIndex,
    institutions,
}) {
    useEffect(() => {
        setSidebarTabsIndex(isCampscapesProject ? INDEX_NONE : INDEX_ACCOUNT);
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
                    {Object.values(project.institution_projects).map(ip => {
                        return (
                            <p><b>{institutions[ip.institution_id].name[projectTranslation.locale]}</b></p>
                        )
                    })}
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
                    showFeaturedInterviews && (
                        <div className="Container u-mt u-mb-large">
                            <FeaturedInterviews />
                        </div>
                    )
                }
            </div>
        </ScrollToTop>
    );
}

Home.propTypes = {
    project: PropTypes.object.isRequired,
    isCampscapesProject: PropTypes.bool.isRequired,
    projectTranslation: PropTypes.object.isRequired,
    showStartPageVideo: PropTypes.bool.isRequired,
    showFeaturedInterviews: PropTypes.bool.isRequired,
    setSidebarTabsIndex: PropTypes.func.isRequired,
};
