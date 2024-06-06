import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import MediaPlayerTitle from './MediaPlayerTitle';
import MediaControlsContainer from './MediaControlsContainer';
import MediaElementContainer from './MediaElementContainer';
import MediaPlayerButtonsContainer from './MediaPlayerButtonsContainer';

export default function MediaPlayer() {
    const { t, locale } = useI18n();
    const { project } = useProject();
    const interview = useSelector(getCurrentInterview);

    function mediaMissingText() {
        if (customMediaMissingTextAvailable()) {
            return customMediaMissingText();
        } else {
            return t('modules.media_player.media_missing');
        }
    }

    function customMediaMissingTextAvailable() {
        const translation = projectTranslation();
        return (typeof translation?.media_missing_text === 'string')
            && translation.media_missing_text.trim().length > 0;
    }

    function customMediaMissingText() {
        return projectTranslation()?.media_missing_text;
    }

    function projectTranslation() {
        return project.translations_attributes?.find(
            (translation) => translation.locale === locale
        );
    }

    return (
        <div
            className={classNames('Layout-mediaPlayer', 'MediaPlayer')}
        >
            <header className={classNames('MediaHeader', {
                'MediaHeader--mediaMissing': interview.media_missing,
            })}>
                <MediaPlayerTitle className="MediaHeader-title" />
                <MediaControlsContainer className="MediaHeader-controls" />
            </header>

            {interview.media_missing ? (
                <p className="MediaMissing">
                    {mediaMissingText()}
                </p>
            ) : (
                <MediaElementContainer />
            )}

            <MediaPlayerButtonsContainer className="MediaPlayer-buttons" />
        </div>
    );
}
