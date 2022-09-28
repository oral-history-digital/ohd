import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatPersonName } from 'modules/person';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import MediaControlsContainer from './MediaControlsContainer';
import MediaElementContainer from './MediaElementContainer';
import MediaPlayerButtonsContainer from './MediaPlayerButtonsContainer';

export default function MediaPlayer({
    interviewee,
    projectId,
}) {
    const { locale, translations } = useI18n();

    if (!projectId) {
        return null;
    }

    if (!interviewee) {
        return <Spinner />;
    }

    return (
        <div
            className={classNames('Layout-mediaPlayer', 'MediaPlayer')}
        >
            <header className="MediaHeader">
                <h1 className="MediaHeader-title">
                    {formatPersonName(interviewee, translations, { locale, withBirthName: true, withTitle: true })}
                </h1>
                <MediaControlsContainer className="MediaHeader-controls" />
            </header>

            <MediaElementContainer />

            <MediaPlayerButtonsContainer className="MediaPlayer-buttons" />
        </div>
    );
}

MediaPlayer.propTypes = {
    interviewee: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
};
