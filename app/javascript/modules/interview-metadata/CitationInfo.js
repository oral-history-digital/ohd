import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { OHD_LOCATION } from 'modules/constants';

export default function CitationInfo({
    interview,
    collections,
    projectDoi,
    projectName,
}) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const pathBase = usePathBase();
    const collection = collections?.[interview.collection_id];

    const domain = project.archive_domain || OHD_LOCATION;
    const selfLink = `${domain}${pathBase}/interviews/${interview.archive_id}`;

    let doiLink;
    if (interview.doi_status === 'created') {
        doiLink = `https://doi.org/${projectDoi}/${projectId}.${interview.archive_id}`;
    }

    let collectionName;
    if (/Deutsche Seelen/.test(collection?.name[locale])) {
        collectionName = 'Teilsammlung "Deutsche Seelen", ';
    }

    const currentDateStr = (new Date()).toLocaleDateString(undefined, { dateStyle: 'medium' });

    return (
        <div>
            <p>
                <span className="flyout-content-label">
                    {t('citation')}:
                </span>
                <span className="flyout-content-data">
                    {interview.anonymous_title && `${interview.anonymous_title?.[locale]}, `}
                    {t('interview')}
                    {' '}
                    {`${interview.archive_id}, `}
                    {`${interview.interview_date}, `}
                    {projectName && `${projectName[locale]}, `}
                    {collectionName}
                    {selfLink && <a href={selfLink}>{selfLink}</a>}
                    {
                        doiLink && (<>
                            {', '}
                            {t('doi.name')}:
                            {' '}
                            <a href={doiLink}>{doiLink}</a>
                            {' '}
                            {`(${t('called')}: ${currentDateStr})`}
                        </>)
                    }
                </span>
            </p>
        </div>
    );
}

CitationInfo.propTypes = {
    collections: PropTypes.object.isRequired,
    projectDoi: PropTypes.string.isRequired,
    projectName: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
};
