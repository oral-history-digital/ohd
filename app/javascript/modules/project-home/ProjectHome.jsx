import classNames from 'classnames';
import { useTrackPageView } from 'modules/analytics';
import { useGetProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useCurrentPage } from 'modules/routes';
import { RedirectOnLogin } from 'modules/user';
import { ScrollToTop } from 'modules/user-agent';
import { isEmptyHtml, sanitizeHtml } from 'modules/utils';

import FeaturedInterviews from './FeaturedInterviews';
import ProjectLogo from './ProjectLogo';
import StartPageVideo from './StartPageVideo';
import getProjectLogoSrc from './utils/getProjectLogoSrc';

export default function ProjectHome() {
    const currentPage = useCurrentPage();
    const { project, loading } = useGetProject({
        shortname: currentPage.params.projectShortname,
        lite: true,
    });
    const { locale } = useI18n();
    useTrackPageView();

    if (!project || loading) return null;

    const showProjectLogo = project && project?.display_ohd_link === true;
    const hasLogo = Boolean(getProjectLogoSrc(project, locale));
    const showStartPageVideo = currentPage.params.projectShortname === 'mog';
    const showFeaturedInterviews = !['mog', 'campscapes'].includes(
        currentPage.params.projectShortname
    );

    return (
        <ScrollToTop>
            <div className="wrapper-content ProjectHome">
                <RedirectOnLogin path="/searches/archive" />
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
