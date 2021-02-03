import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import InterviewEditButtonsContainer from '../containers/InterviewEditButtonsContainer';
import AuthorizedContent from './AuthorizedContent';
import { useI18n } from 'modules/i18n';

export default function VideoPlayerButtons({
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
                className="IconButton"
                type="button"
                title={t(transcriptScrollEnabled ? 'expand_video' : 'compress_video')}
                onClick={toggleExpansion}
            >
                <i className={classNames('fa', 'fa-fw', {
                    'fa-angle-double-down': transcriptScrollEnabled,
                    'fa-angle-double-up': !transcriptScrollEnabled,
                })}
                    aria-hidden="true"
                />
            </button>
        </div>
    );
}

VideoPlayerButtons.propTypes = {
    transcriptScrollEnabled: PropTypes.bool.isRequired,
    className: PropTypes.string,
    handleTranscriptScroll: PropTypes.func.isRequired,
};
