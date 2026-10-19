import { useTrackPageView } from 'modules/analytics';
import { useGetCollection, useProjectDetail } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { LinkButton } from 'modules/ui';
import { ScrollToTop } from 'modules/user-agent';
import { Helmet } from 'react-helmet';
import { FaArrowRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import { getProjectUrl } from '../utils';
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

/**
 * Displays collection details with their parent project's names, institutions, and links.
 * Fetches the collection separately and reads project details through Redux.
 *
 * @returns {import('react').ReactElement} Collection details or their loading/error state.
 */
export function CollectionPage() {
    const { t, locale } = useI18n();
    const { id } = useParams();
    const { collection, error, isLoading } = useGetCollection(id);
    const { project, error: projectError } = useProjectDetail(
        collection?.project_id,
        {
            include: ['institutions'],
        }
    );

    useTrackPageView();

    /**
     * Reads a collection display string from its existing localized response shape.
     *
     * @param {string|Object|null|undefined} value - Display string or translations by locale.
     * @returns {string|null} Current display value, or null when absent.
     */
    const localizedValue = (value) => {
        if (!value) return null;
        if (typeof value === 'string') return value;
        return value?.[locale] || null;
    };

    const collectionName = localizedValue(collection?.name);
    const collectionNotes = localizedValue(collection?.notes);
    const collectionHomepage = localizedValue(collection?.homepage);
    const collectionResponsibles = localizedValue(collection?.responsibles);

    const { url, isExternalUrl } = getProjectUrl(project, locale);
    const projectUrl = isExternalUrl ? `${url}/${locale}` : url; // Ensure we have the locale in the URL for external links
    const collectionPageUrl = `${projectUrl}/searches/archive?collection_id[]=${collection?.id}`;

    const toCollectionButton = (
        <LinkButton
            buttonText={t('explorer.view_collection_page')}
            variant="contained"
            to={collectionPageUrl}
            isExternal={isExternalUrl}
            target={isExternalUrl ? '_blank' : '_self'}
            endIcon={<FaArrowRight />}
        />
    );

    const displayError = projectError || (!collection && error);
    if (displayError) {
        return (
            <ScrollToTop>
                <ErrorBoundary>
                    <p
                        className="wrapper-content CollectionDetails"
                        role="alert"
                    >
                        {t('error')}: {displayError.message}
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

                    {collection?.is_linkable && toCollectionButton}

                    <dl className="DescriptionList">
                        <ProjectLink
                            projectId={collection.project_id}
                            projectName={project.display_name || project.name}
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
                            primary_institution={
                                project.institutions?.find(
                                    (institution) => institution.is_primary
                                )?.id
                            }
                            projectName={project?.display_name || project?.name}
                            collectionName={collection?.name}
                            collectionId={collection?.id}
                            doiUrl={collection?.oai_doi_identifier}
                        />{' '}
                        {!project.is_catalog && (
                            <GenericDetail
                                labelKey="explorer.export_formats.label"
                                value={t('explorer.export_formats.description')}
                            />
                        )}
                        <XmlLinks collectionId={collection.id} />
                        {collection?.is_linkable && (
                            <div className="u-mv-large">
                                {toCollectionButton}
                            </div>
                        )}
                    </dl>
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}

export default CollectionPage;
