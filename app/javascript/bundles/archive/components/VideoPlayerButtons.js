import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import InterviewEditButtonsContainer from '../containers/InterviewEditButtonsContainer';
import { admin, t } from '../../../lib/utils';

class VideoPlayerButtons extends Component {
    static propTypes = {
        transcriptScrollEnabled: PropTypes.bool.isRequired,
        locale: PropTypes.string.isRequired,
        translations: PropTypes.object.isRequired,
        account: PropTypes.object.isRequired,
        editView: PropTypes.bool.isRequired,
        handleTranscriptScroll: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        this.toggleExpansion = this.toggleExpansion.bind(this);
    }

    toggleExpansion() {
        this.props.handleTranscriptScroll(!this.props.transcriptScrollEnabled);

        if (this.props.transcriptScrollEnabled) {
            window.scrollTo(0, 1);
        }
    }

    render() {
        const { transcriptScrollEnabled } = this.props;

        return (
            <div className="VideoPlayer-buttons">
                {
                    admin(this.props, {type: 'General', action: 'edit'}) ?
                        <InterviewEditButtonsContainer /> :
                        null
                }

                <button
                    className="IconButton"
                    type="button"
                    title={t(this.props, transcriptScrollEnabled ? 'expand_video' : 'compress_video')}
                    onClick={this.toggleExpansion}
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
}

export default VideoPlayerButtons;
