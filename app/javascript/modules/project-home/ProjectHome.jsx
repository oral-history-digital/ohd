import classNames from 'classnames';
import { useTrackPageView } from 'modules/analytics';
import { useProjectDetail } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useCurrentPage } from 'modules/routes';
import { RedirectOnLogin } from 'modules/user';
import { ScrollToTop } from 'modules/user-agent';
import { isEmptyHtml, sanitizeHtml } from 'modules/utils';

import FeaturedInterviews from './FeaturedInterviews';
import ProjectLogo from './ProjectLogo';
import StartPageVideo from './StartPageVideo';
import getProjectLogoSrc from './utils/getProjectLogoSrc';

/**
 * Displays localized project home content from Redux with institution names and a logo.
 * Keeps loaded content during refresh and the login redirect mounted while data reloads.
 * Featured interviews are fetched separately.
 *
 * @returns {import('react').ReactElement} Home content or its loading/error state.
 */
export default function ProjectHome() {
    const currentPage = useCurrentPage();
    const { project, error } = useProjectDetail(
        currentPage.params.projectShortname,
        {
            include: ['institutions'],
        }
    );
    const { t, locale } = useI18n();
    useTrackPageView();

    if (!project || error)
        return (
            <ScrollToTop>
                <RedirectOnLogin path="/searches/archive" />
                {error && (
                    <p className="wrapper-content ProjectHome" role="alert">
                        {t('error')}: {error.message}
                    </p>
                )}
            </ScrollToTop>
        );

    const showProjectLogo = project && project?.display_ohd_link === true;
    const hasLogo = Boolean(getProjectLogoSrc(project, locale));
    const showStartPageVideo = currentPage.params.projectShortname === 'mog';
    const showFeaturedInterviews = !['mog', 'campscapes'].includes(
        currentPage.params.projectShortname
    );

    return (
        <ScrollToTop>
            <RedirectOnLogin path="/searches/archive" />
            <div className="wrapper-content ProjectHome">
                {showStartPageVideo && <StartPageVideo />}
                <div
                    className={classNames('ProjectHome--hero', {
                        'ProjectHome--hero--hasLogo':
                            hasLogo && showProjectLogo,
                    })}
                >
                    {showProjectLogo && (
                        <ProjectLogo project={project} isLinkActive={false} />
                    )}
                    <div className="ProjectHome--heroText">
                        <h1 className="Page-main-title">{project.name}</h1>
                        {project.institutions?.length > 0 && (
                            <p className="ProjectHome--institutions">
                                {project.institutions
                                    .map((inst) => inst.name)
                                    .join(', ')}
                            </p>
                        )}
                        {!isEmptyHtml(project.introduction) && (
                            <div
                                className="ProjectHome--introduction"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(
                                        project.introduction,
                                        'RICH_TEXT'
                                    ),
                                }}
                            />
                        )}
                    </div>
                </div>
                {!isEmptyHtml(project.more_text) && (
                    <div className="ProjectHome--moreText">
                        <p
                            className="u-mt"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(
                                    project.more_text,
                                    'RICH_TEXT'
                                ),
                            }}
                        />
                    </div>
                )}
                {showFeaturedInterviews && <FeaturedInterviews />}
            </div>
        </ScrollToTop>
    );
}
