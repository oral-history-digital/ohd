import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useProjectAccessStatus } from 'modules/auth';
import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { MediaIcon } from 'modules/interview-helpers';
import { useProject } from 'modules/routes';

export default function MediaPreview() {
    const { t, locale } = useI18n();
    const { project } = useProject();
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const interview = useSelector(getCurrentInterview);

    const [loadingError, setLoadingError] = useState(false);

    function imageAvailable() {
        return (
            (project.show_preview_img || projectAccessGranted) &&
            interview.still_url &&
            !loadingError
        );
    }

    return (
        <div className="MediaPreview u-mb-large">
            <h1 className="MediaPreview-title">
                {interview.anonymous_title[locale]}
            </h1>
            <div className="MediaPreview-body">
                {imageAvailable() ? (
                    <img
                        className="MediaPreview-image"
                        src={interview.still_url}
                        alt={
                            interview.media_type === 'video'
                                ? t('modules.interview.video_preview')
                                : t('modules.interview.audio_preview')
                        }
                        onError={() => setLoadingError(true)}
                    />
                ) : (
                    <MediaIcon
                        interview={interview}
                        className="MediaPreview-icon"
                    />
                )}
            </div>
            <div
                className="u-mt"
                dangerouslySetInnerHTML={{
                    __html: interview.landing_page_texts[locale],
                }}
            />
        </div>
    );
}
