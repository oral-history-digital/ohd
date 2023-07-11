import PropTypes from 'prop-types';

import { RedirectOnLogin } from 'modules/user';
import { ScrollToTop } from 'modules/user-agent';
import { useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import StartPageVideo from './StartPageVideo';
import FeaturedInterviews from './FeaturedInterviews';

function showFeaturedInterviews(projectId) {
    if (projectId === 'mog' || projectId === 'campscapes') {
        return false;
    }

    return true;
}

function showStartPageVideo(projectId) {
    return projectId === 'mog';
};

function getProjectTranslation(project, locale) {
    return project.translations_attributes.find(t => t.locale === locale)
        || project.translations_attributes.find(t => t.locale === project.default_locale);
}

export default function Home({
    institutions,
}) {
    const { project, projectId } = useProject();
    const { locale } = useI18n();

    const projectTranslation = getProjectTranslation(project, locale);

    return (
        <ScrollToTop>
            <div className='wrapper-content home-content'>
                <RedirectOnLogin path="/searches/archive" />
                {
                    showStartPageVideo(projectId) ?
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
                    showFeaturedInterviews(projectId) && (
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
    institutions: PropTypes.array.isRequired,
};
