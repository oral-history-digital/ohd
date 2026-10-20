import { OHD_LOCATION } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

/**
 * Shows an interview citation with its localized project name and permanent links.
 *
 * @param {Object} props - Citation data.
 * @param {Object} props.interview - Interview identified by its public archive ID.
 * @param {Object} props.collections - Collection records by ID.
 * @returns {React.ReactElement} Citation or project request status.
 */
export default function CitationInfo({ interview, collections }) {
    const { t, locale } = useI18n();
    const { project, isLoading, error } = useProject({});
    const pathBase = usePathBase();

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (isLoading || !project) return <Spinner />;
    const collection = collections?.[interview.collection_id];

    const domain = project.archive_domain || OHD_LOCATION;
    const selfLink = `${domain}${pathBase}/interviews/${interview.archive_id}`;

    // TODO: Move DOI link generation logic to backend and store generated
    // DOI link in the interview data.
    let doiLink;
    if (interview.doi_status === 'created') {
        if (interview.used_doi_prefix) {
            doiLink = `https://doi.org/${interview.used_doi_prefix}/${project.shortname}.${interview.archive_id}`;
        } else {
            console.warn(
                `Interview ${interview.id} has DOI status 'created' but no used_doi_prefix. Cannot generate DOI link.`
            );
        }
    }

    let collectionName;
    if (/Deutsche Seelen/.test(collection?.name[locale])) {
        collectionName = 'Teilsammlung "Deutsche Seelen", ';
    }

    const currentDateStr = new Date().toLocaleDateString(undefined, {
        dateStyle: 'medium',
    });

    return (
        <div>
            <p>
                <span className="flyout-content-label">{t('citation')}:</span>
                <span className="flyout-content-data">
                    {interview.anonymous_title &&
                        `${interview.anonymous_title?.[locale]}, `}
                    {t('interview')} {`${interview.archive_id}, `}
                    {`${interview.interview_date}, `}
                    {`${project.name}, `}
                    {collectionName}
                    {selfLink && <a href={selfLink}>{selfLink}</a>}
                    {doiLink && (
                        <>
                            {', '}
                            {t('doi.name')}: <a href={doiLink}>{doiLink}</a>{' '}
                            {`(${t('called')}: ${currentDateStr})`}
                        </>
                    )}
                </span>
            </p>
        </div>
    );
}

CitationInfo.propTypes = {
    collections: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
};
