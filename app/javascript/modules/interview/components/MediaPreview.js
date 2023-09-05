import { useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { useProjectAccessStatus } from 'modules/auth';
import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { MediaIcon } from 'modules/interview-helpers';
import { useProject } from 'modules/routes';
import fallbackImage from 'assets/images/speaker.png';

export default function MediaPreview() {
    const { t, locale } = useI18n();
    const { project } = useProject();
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const interview = useSelector(getCurrentInterview);

    const [imgUrl, setImgUrl] = useState(interview.still_url || fallbackImage);

    function handleError() {
        setImgUrl(fallbackImage);
    }

    let imageAvailable = (project.show_preview_img || projectAccessGranted)
        && interview.still_url;

    return (
        <div className="MediaPreview u-mb-large">
            <h1 className="MediaPreview-title">
                {interview.anonymous_title[locale]}
            </h1>
            <div className="MediaPreview-body">
                {imageAvailable ? (
                    <img
                        className="MediaPreview-image"
                        src={imgUrl}
                        alt={interview.media_type === 'video'
                            ? t('modules.interview.video_preview')
                            : t('modules.interview.audio_preview')}
                        onError={handleError}
                    />) : (
                    <MediaIcon
                        interview={interview}
                        className="MediaPreview-icon"
                    />
                )}
            </div>
            <div
                className="u-mt"
                dangerouslySetInnerHTML={{__html: interview.landing_page_texts[locale]}}
            />
        </div>
    );
}
