import { useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useStore, useDispatch } from 'react-redux';

import { getCurrentInterview, getCurrentProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { setPlayerSize, getPlayerSize } from 'modules/media-player';
import { isMobile } from 'modules/user-agent';
import MediaPlayerTitle from './MediaPlayerTitle';
import MediaControlsContainer from '../containers/MediaControlsContainer';
import MediaElementContainer from '../containers/MediaElementContainer';
import MediaPlayerButtonsContainer from '../containers/MediaPlayerButtonsContainer';
import { setStoreReference } from '../plugins/toggleSizeButtonPlugin';

function isSmallScreen() {
    return window.innerWidth < 1200; // screen-xl: 1200px
}

export default function MediaPlayer() {
    const { t, locale } = useI18n();
    const project = useSelector(getCurrentProject);
    const interview = useSelector(getCurrentInterview);
    const store = useStore();
    const dispatch = useDispatch();
    const playerSize = useSelector(getPlayerSize);

    useEffect(() => {
        setStoreReference(store);

        const shouldForceMedium = isMobile() || isSmallScreen();
        const defaultSize = shouldForceMedium
            ? 'medium'
            : playerSize || 'medium';

        if (!playerSize || (shouldForceMedium && playerSize !== 'medium')) {
            dispatch(setPlayerSize(defaultSize));
        }

        const handleResize = () => {
            if (shouldForceMedium && playerSize !== 'medium') {
                dispatch(setPlayerSize('medium'));
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [store, dispatch, playerSize]);

    function mediaMissingText() {
        if (customMediaMissingTextAvailable()) {
            return customMediaMissingText();
        } else {
            return t('modules.media_player.media_missing');
        }
    }

    function customMediaMissingTextAvailable() {
        const translation = projectTranslation();
        return (
            typeof translation?.media_missing_text === 'string' &&
            translation.media_missing_text.trim().length > 0
        );
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
        <div className={classNames('Layout-mediaPlayer', 'MediaPlayer')}>
            <header
                className={classNames('MediaHeader', {
                    'MediaHeader--mediaMissing': interview?.media_missing,
                })}
            >
                <MediaPlayerTitle className="MediaHeader-title" />
                <MediaControlsContainer className="MediaHeader-controls" />
            </header>

            {interview?.media_missing ? (
                <p className="MediaMissing">{mediaMissingText()}</p>
            ) : (
                <MediaElementContainer />
            )}

            <MediaPlayerButtonsContainer className="MediaPlayer-buttons" />
        </div>
    );
}
