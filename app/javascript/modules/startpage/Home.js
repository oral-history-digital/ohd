import PropTypes from 'prop-types';

import { RedirectOnLogin } from 'modules/user';
import { ScrollToTop } from 'modules/user-agent';
import { useProject } from 'modules/routes';
import StartPageVideo from './StartPageVideo';
import FeaturedInterviews from './FeaturedInterviews';

export default function Home({
    projectTranslation,
    showStartPageVideo,
    showFeaturedInterviews,
    institutions,
}) {
    const { project } = useProject();

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
                    {project && Object.values(project.institution_projects).map(ip => (
                        <p key={ip.id}>
                            <b>{institutions[ip.institution_id].name[projectTranslation?.locale]}</b>
                        </p>
                    ))}
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
    projectTranslation: PropTypes.object.isRequired,
    showStartPageVideo: PropTypes.bool.isRequired,
    showFeaturedInterviews: PropTypes.bool.isRequired,
};
