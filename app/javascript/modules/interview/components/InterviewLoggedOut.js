import { useState } from 'react';
import { useSelector } from 'react-redux';

import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import fallbackImage from 'assets/images/speaker.png';

export default function InterviewLoggedOut() {
    const { t, locale } = useI18n();
    const interview = useSelector(getCurrentInterview);

    const [imgUrl, setImgUrl] = useState(interview.still_url || fallbackImage);

    function handleError() {
        setImgUrl(fallbackImage);
    }

    return (
        <div>
            <div className="MediaPlayer">
                <header className="MediaHeader">
                    <h1 className="MediaHeader-title">
                        {interview.anonymous_title[locale]}
                    </h1>
                </header>
                <div className="MediaElement">
                    <img
                        className="MediaElement-element"
                        src={imgUrl}
                        alt={interview.media_type === 'video' ? t('modules.interview.video_preview') : t('modules.interview.audio_preview')}
                        onError={handleError}
                    />
                </div>
            </div>
            <div
                className='wrapper-content'
                dangerouslySetInnerHTML={{__html: interview.landing_page_texts[locale]}}
            />
        </div>
    );
}
