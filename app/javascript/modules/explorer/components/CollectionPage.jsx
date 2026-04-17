import { useTrackPageView } from 'modules/analytics';
import { useGetCollection, useGetProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { LinkOrA } from 'modules/routes';
import { ScrollToTop } from 'modules/user-agent';
import { Helmet } from 'react-helmet';
import { FaChevronRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import {
    Citation,
    GenericDetail,
    IndexingLevels,
    Institutions,
    InterviewLanguages,
    InterviewStats,
    MediaTypes,
    ProjectLink,
    PublicationDate,
    Responsibles,
    RichtextDetail,
    Subjects,
    Website,
    XmlLinks,
    YearRange,
} from './details';

export function CollectionPage() {
    const { t, locale } = useI18n();
    const { id } = useParams();
    const { collection, error, isLoading } = useGetCollection(id);
    const { project } = useGetProject({
        id: collection?.project_id,
        lite: true,
    });

    useTrackPageView();

    const localizedValue = (value) => {
        if (!value) return null;
        if (typeof value === 'string') return value;
        return value?.[locale] || null;
    };

    const collectionName = localizedValue(collection?.name);
    const collectionNotes = localizedValue(collection?.notes);
    const collectionHomepage = localizedValue(collection?.homepage);
    const collectionResponsibles = localizedValue(collection?.responsibles);

    if (error && !collection) {
        return (
            <ScrollToTop>
                <ErrorBoundary>
                    <p className="wrapper-content CollectionDetails">
                        {t('error')}: {error.message}
                    </p>
                </ErrorBoundary>
            </ScrollToTop>
        );
    }

    if (isLoading && !collection) {
        return (
            <ScrollToTop>
                <ErrorBoundary>
                    <div className="wrapper-content CollectionDetails" />
                </ErrorBoundary>
            </ScrollToTop>
        );
    }

    if (!collection || !project) {
        return (
            <ScrollToTop>
                <ErrorBoundary>
                    <div className="wrapper-content CollectionDetails" />
                </ErrorBoundary>
            </ScrollToTop>
        );
    }

    return (
        <ScrollToTop>
            <Helmet>
                <title>{collectionName}</title>
            </Helmet>
            <ErrorBoundary>
                <div className="wrapper-content CollectionDetails">
                    <h1 className="Page-main-title CollectionDetails-title">
                        {collectionName}
                    </h1>

                    {collection?.is_linkable && (
                        <p className="Paragraph u-mb">
                            <LinkOrA
                                project={project}
                                to={'searches/archive'}
                                params={`collection_id[]=${collection?.id}`}
                                className="ProminentLink"
                            >
                                <FaChevronRight className="ProminentLink-icon u-mr-tiny" />
                                {t('modules.catalog.go_to_collection')}
                            </LinkOrA>
                        </p>
                    )}

                    <dl className="DescriptionList">
                        <ProjectLink
                            projectId={collection.project_id}
                            projectName={collection.project_name}
                        />
                        <Institutions institutions={project.institutions} />
                        <RichtextDetail richtext={collectionNotes} />
                        <Website url={collectionHomepage} />
                        <InterviewStats counts={collection.interviews} />
                        <MediaTypes mediaTypes={collection?.media_types} />
                        <YearRange
                            years={collection.birth_year_range}
                            labelKey="modules.catalog.birthyears"
                        />
                        <YearRange
                            years={collection.interview_year_range}
                            labelKey="modules.catalog.period"
                        />
                        <InterviewLanguages
                            languages={collection.languages_interviews}
                        />
                        <IndexingLevels
                            levels={collection.levels_of_indexing}
                        />
                        <Subjects subjects={collection.subjects} />
                        <Responsibles responsibles={collectionResponsibles} />
                        <PublicationDate
                            publicationDate={collection.publication_date}
                        />
                        <Citation
                            type="collection"
                            institutions={project.institutions}
                            projectName={project?.display_name || project?.name}
                            collectionName={collection?.name}
                            collectionId={collection?.id}
                        />{' '}
                        {!project.is_catalog && (
                            <GenericDetail
                                labelKey="explorer.export_formats.label"
                                value={t('explorer.export_formats.description')}
                            />
                        )}
                        <XmlLinks collectionId={collection.id} />
                    </dl>
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}

export default CollectionPage;
