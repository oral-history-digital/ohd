import React from 'react';
import PropTypes from 'prop-types';
import { FaAngleDoubleDown, FaAngleDoubleUp } from 'react-icons/fa';
import classNames from 'classnames';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { InterviewEditButtonsContainer } from 'modules/interview-edit';

export default function MediaPlayerButtons({
    transcriptScrollEnabled,
    className,
    handleTranscriptScroll,
}) {
    const { t } = useI18n();

    function toggleExpansion() {
        handleTranscriptScroll(!transcriptScrollEnabled);

        if (transcriptScrollEnabled) {
            window.scrollTo(0, 1);
        }
    }

    return (
        <div className={className}>
            <AuthorizedContent object={{type: 'General', action: 'edit'}}>
                <InterviewEditButtonsContainer />
            </AuthorizedContent>

            <button
                className="StateButton"
                type="button"
                title={t(transcriptScrollEnabled ? 'expand_media_player' : 'compress_media_player')}
                onClick={toggleExpansion}
            >
                {
                    transcriptScrollEnabled ?
                        <FaAngleDoubleDown className="StateButton-icon" /> :
                        <FaAngleDoubleUp className="StateButton-icon" />
                }
            </button>
        </div>
    );
}

MediaPlayerButtons.propTypes = {
    transcriptScrollEnabled: PropTypes.bool.isRequired,
    className: PropTypes.string,
    handleTranscriptScroll: PropTypes.func.isRequired,
};
