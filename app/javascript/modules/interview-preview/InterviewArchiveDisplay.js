import lockRegular from 'assets/images/lock-regular.svg';
import lockSolid from 'assets/images/lock-solid.svg';
import classNames from 'classnames';
import { PROJECT_ACCESS_REQUESTED, useProjectAccessStatus } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export default function InterviewArchiveDisplay({ project, className }) {
    const { t, locale } = useI18n();
    const { projectAccessGranted, projectAccessStatus } =
        useProjectAccessStatus(project);

    const showLock = !projectAccessGranted;
    const lockIconSrc =
        projectAccessStatus === PROJECT_ACCESS_REQUESTED
            ? lockRegular
            : lockSolid;
    const lockLabel =
        projectAccessStatus === PROJECT_ACCESS_REQUESTED
            ? t('modules.interview_preview.access_requested')
            : t('modules.interview_preview.no_access');

    const archiveName = project.display_name[locale] || project.name[locale];

    return (
        <div className={classNames('InterviewCard-archive', className)}>
            <span className="InterviewCard-archiveName" title={archiveName}>
                {archiveName}
            </span>
            {showLock && (
                <span
                    className="InterviewCard-lock u-ml-tiny"
                    aria-label={lockLabel}
                    title={lockLabel}
                >
                    <img
                        src={lockIconSrc}
                        className="InterviewCard-lockImage"
                        alt=""
                    />
                </span>
            )}
        </div>
    );
}

InterviewArchiveDisplay.propTypes = {
    project: PropTypes.object.isRequired,
    className: PropTypes.string,
};
