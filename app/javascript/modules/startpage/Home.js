import { useTrackPageView } from 'modules/analytics';
import { Fetch } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { RedirectOnLogin } from 'modules/user';
import { ScrollToTop } from 'modules/user-agent';
import PropTypes from 'prop-types';

import FeaturedInterviews from './FeaturedInterviews';
import StartPageVideo from './StartPageVideo';

export default function Home({ institutions }) {
    const { project, projectId } = useProject();
    const { locale } = useI18n();
    useTrackPageView();

    if (!project.translations_attributes) {
        return null;
    }

    function showStartPageVideo() {
        return projectId === 'mog';
    }

    function getTranslation(key) {
        return (
            project.translations_attributes.find((t) => t.locale === locale)?.[
                key
            ] ||
            project.translations_attributes.find(
                (t) => t.locale === project.default_locale
            )?.[key]
        );
    }

    function showFeaturedInterviews() {
        if (projectId === 'mog' || projectId === 'campscapes') {
            return false;
        }

        return true;
    }

    return (
        <ScrollToTop>
            <div className="wrapper-content home-content">
                <RedirectOnLogin path="/searches/archive" />
                {showStartPageVideo() ? <StartPageVideo /> : null}
                <div className="home-text">
                    <h1>{getTranslation('name')}</h1>
                    <Fetch
                        fetchParams={['institutions', null, null, 'all']}
                        testDataType="institutions"
                        testIdOrDesc="all"
                    >
                        {project &&
                            Object.values(project.institution_projects).map(
                                (ip) => (
                                    <p key={ip.id}>
                                        <b>
                                            {institutions[ip.institution_id]
                                                ?.name[locale] ||
                                                institutions[ip.institution_id]
                                                    ?.name[
                                                    project.default_locale
                                                ]}
                                        </b>
                                    </p>
                                )
                            )}
                    </Fetch>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: getTranslation('introduction'),
                        }}
                    />
                </div>
                {getTranslation('more_text') && (
                    <p
                        className="home-paragraph u-mt"
                        dangerouslySetInnerHTML={{
                            __html: getTranslation('more_text'),
                        }}
                    />
                )}
                {showFeaturedInterviews() && (
                    <div className="Container u-mt u-mb-large">
                        <FeaturedInterviews />
                    </div>
                )}
            </div>
        </ScrollToTop>
    );
}

Home.propTypes = {
    institutions: PropTypes.object.isRequired,
};
