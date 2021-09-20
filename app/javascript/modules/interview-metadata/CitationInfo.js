import PropTypes from 'prop-types';
import moment from 'moment';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

export default function CitationInfo({
    interview,
    locale,
    projectDoi,
    projectId,
    projectName,
    archiveDomain,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    let selfLink;
    if (archiveDomain) {
        selfLink = `${archiveDomain}${pathBase}/interviews/${interview.archive_id}`;
    }

    let doiLink;
    if (interview.doi_status === 'created') {
        doiLink = `https://doi.org/${projectDoi}/${projectId}.${interview.archive_id}`;
    }

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
                    {selfLink && <a href={selfLink}>{selfLink}</a>}
                    {
                        doiLink && (<>
                            {', '}
                            {t('doi.name')}:
                            {' '}
                            <a href={doiLink}>{doiLink}</a>
                            {' '}
                            {`(${t('called')}: ${moment().format('DD.MM.YYYY')})`}
                        </>)
                    }
                </span>
            </p>
        </div>
    );
}

CitationInfo.propTypes = {
    archiveDomain: PropTypes.string.isRequired,
    projectDoi: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projectName: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
};
