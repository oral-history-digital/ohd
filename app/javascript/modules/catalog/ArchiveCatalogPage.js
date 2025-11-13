import { Helmet } from 'react-helmet';
import { FaChevronRight} from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { useTrackPageView } from 'modules/analytics';
import { useLoadCompleteProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { LinkOrA } from 'modules/routes';
import { Breadcrumbs } from 'modules/ui';
import { ScrollToTop } from 'modules/user-agent';
import ArchiveCatalog from './ArchiveCatalog';

export default function ArchiveCatalogPage() {
    const { t, locale } = useI18n();
    let params = new URLSearchParams(document.location.search);
    const id = Number(params.get("id"));
    const pathBase = usePathBase();
    const project = useLoadCompleteProject(id);
    useTrackPageView();

    const title = project.name[locale];

    const projectTranslation = project.translations_attributes?.find(
        (trans) => trans.locale === locale
    );

    return (
        <ScrollToTop>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <ErrorBoundary>
                <div className="wrapper-content interviews">
                    <Breadcrumbs className="u-mb">
                        <a href={`/${locale}/catalog`}>
                            {t('modules.catalog.title')}
                        </a>
                        {t('activerecord.models.project.other')}
                        {title}
                    </Breadcrumbs>

                    <h1 className="search-results-title u-mb">{title}</h1>

                    <p className="Paragraph u-mb">
                        <LinkOrA
                            project={project}
                            to=""
                            className="ProminentLink"
                        >
                            <FaChevronRight className="ProminentLink-icon u-mr-tiny" />
                            {t('modules.catalog.go_to_archive')}
                        </LinkOrA>
                    </p>

                    <dl className="DescriptionList">
                        <dt className="DescriptionList-term">
                            {project.institution_projects?.length === 1
                                ? t('activerecord.models.institution.one')
                                : t('activerecord.models.institution.other')}
                        </dt>
                        <dd className="DescriptionList-description">
                            <ul className="UnorderedList">
                                {Object.values(
                                    project.institution_projects || {}
                                )?.map((ip) => (
                                    <li key={ip.institution_id}>
                                        <a href={`/${locale}/catalog/institutions/${ip.institution_id}`}>
                                            {ip.name[locale]}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </dd>
                    </dl>

                    {projectTranslation?.introduction && (
                        <>
                            <dt className="DescriptionList-term">
                                {t('modules.catalog.description')}
                            </dt>
                            <dd
                                className="DescriptionList-description"
                                dangerouslySetInnerHTML={{
                                    __html: projectTranslation?.introduction,
                                }}
                            />
                        </>
                    )}

                    {project.cooperation_partner && (
                        <>
                            <dt className="DescriptionList-term">
                                {t(
                                    'activerecord.attributes.project.cooperation_partner'
                                )}
                            </dt>
                            <dd className="DescriptionList-description">
                                {project.cooperation_partner}
                            </dd>
                        </>
                    )}

                    {project.leader && (
                        <>
                            <dt className="DescriptionList-term">
                                {t('activerecord.attributes.project.leader')}
                            </dt>
                            <dd className="DescriptionList-description">
                                {project.leader}
                            </dd>
                        </>
                    )}

                    {project.manager && (
                        <>
                            <dt className="DescriptionList-term">
                                {t('activerecord.attributes.project.manager')}
                            </dt>
                            <dd className="DescriptionList-description">
                                {project.manager}
                            </dd>
                        </>
                    )}

                    {project.domain && (
                        <>
                            <dt className="DescriptionList-term">
                                {t('activerecord.attributes.project.domain')}
                            </dt>
                            <dd className="DescriptionList-description">
                                <a
                                    href={project.domain}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {project.domain}
                                </a>
                            </dd>
                        </>
                    )}

                    {project.pseudo_funder_names?.length > 0 && (
                        <>
                            <dt className="DescriptionList-term">
                                {t(
                                    'activerecord.attributes.project.pseudo_funder_names'
                                )}
                            </dt>
                            <dd className="DescriptionList-description">
                                <ul className="UnorderedList">
                                    {project.pseudo_funder_names?.map(
                                        (name) => (
                                            <li key={name}>{name}</li>
                                        )
                                    )}
                                </ul>
                            </dd>
                        </>
                    )}

                    {project.archive_domain && (
                        <>
                            <dt className="DescriptionList-term">
                                {t(
                                    'activerecord.attributes.project.archive_domain'
                                )}
                            </dt>
                            <dd className="DescriptionList-description">
                                <a
                                    href={project.archive_domain}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {project.archive_domain}
                                </a>
                            </dd>
                        </>
                    )}

                    <dt className="DescriptionList-term">
                        {t('modules.catalog.volume')}
                    </dt>
                    <dd className="DescriptionList-description">
                        {project.num_interviews}{' '}
                        {project.num_interviews === 1
                            ? t('activerecord.models.interview.one')
                            : t('activerecord.models.interview.other')}
                    </dd>

                    <dt className="DescriptionList-term">
                        {t('modules.catalog.publication_date')}
                    </dt>
                    <dd className="DescriptionList-description">
                        {project.publication_date}
                    </dd>

                    <dt className="DescriptionList-term">
                        {t('modules.catalog.subjects')}
                    </dt>
                    <dd className="DescriptionList-description">
                        {project?.subjects.map((s, i) => (
                            <span key={`subject-${i}`}>
                                {s.descriptor[locale]}
                                {i < project?.subjects.length - 1 && ', '}
                            </span>
                        ))}
                    </dd>

                    <dt className="DescriptionList-term">
                        {t('modules.catalog.level_of_indexing')}
                    </dt>
                    <dd className="DescriptionList-description">
                        {project?.levels_of_indexing.map((s, i) => (
                            <span key={`loi-${i}`}>
                                {`${s.count} ${s.descriptor[locale]}`}
                                {i < project?.levels_of_indexing.length - 1 &&
                                    ', '}
                            </span>
                        ))}
                    </dd>

                    <ArchiveCatalog id={Number.parseInt(id)} />
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}
