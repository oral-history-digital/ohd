import { Component } from 'react';
import PropTypes from 'prop-types';

import { t } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import SegmentContainer from './SegmentContainer';
import sortedSegmentsWithActiveIndex from './sortedSegmentsWithActiveIndex';
import isSegmentActive from './isSegmentActive';

export default class Transcript extends Component {
    constructor(props) {
        super(props);

        this.openSegmentPopup = this.openSegmentPopup.bind(this);
        this.closeSegmentPopup = this.closeSegmentPopup.bind(this);
        this.setOpenReference = this.setOpenReference.bind(this);

        this.state = {
            popupSegmentId: null,
            popupType: null,
            openReference: null,
        };
    }

    componentDidMount() {
        const { locale, projectId, projects, autoScroll, userContentsStatus, fetchData } = this.props;

        this.loadSegments();
        if (!userContentsStatus) {
            fetchData({ locale, projectId, projects }, 'user_contents');
        }

        if (!autoScroll) {
            window.scrollTo(0, 0);
        }
    }

    componentDidUpdate() {
        this.loadSegments();
    }

    openSegmentPopup(segmentId, popupType) {
        this.setState({
            popupSegmentId: segmentId,
            popupType,
            openReference: null,
        });
    }

    closeSegmentPopup() {
        this.setState({
            popupSegmentId: null,
            popupType: null,
            openReference: null,
        });
    }

    setOpenReference(reference) {
        if (this.state.openReference === reference) {
            this.setState({ openReference: null });
        } else {
            this.setState({ openReference: reference });
        }
    }

    loadSegments() {
        const { locale, projectId, projects, archiveId, transcriptFetched, loadSegments, fetchData } = this.props;

        if (loadSegments && !transcriptFetched) {
            fetchData({ locale, projectId, projects }, 'interviews', archiveId, 'segments');
        }
    }

    render () {
        const { transcriptFetched, transcriptLocale, hasTranscript, originalLocale, interviewee, mediaTime, tape } = this.props;
        const { popupSegmentId, popupType, openReference } = this.state;

        if (!transcriptFetched) {
            return <Spinner />;
        }

        if (!hasTranscript) {
            return originalLocale ? t(this.props, 'without_transcript') : t(this.props, 'without_translation');
        }

        let tabIndex = originalLocale ? 0 : 1;
        let sortedWithIndex = sortedSegmentsWithActiveIndex(mediaTime, this.props);
        let shownSegments = sortedWithIndex[1];

        let speaker, speakerId;

        return (
            <div className="Transcript">
                {
                    shownSegments.map((segment, index, array) => {
                        segment.speaker_is_interviewee = interviewee && interviewee.id === segment.speaker_id;
                        if (
                            (speakerId !== segment.speaker_id && segment.speaker_id !== null) ||
                            (speaker !== segment.speaker && segment.speaker_id === null)
                        ) {
                            segment.speakerIdChanged = true;
                            speakerId = segment.speaker_id;
                            speaker = segment.speaker;
                        }

                        const nextSegment = array[index + 1];
                        const active = isSegmentActive({
                            thisSegmentTape: segment.tape_nbr,
                            thisSegmentTime: segment.time,
                            nextSegmentTape: nextSegment?.tape_nbr,
                            nextSegmentTime: nextSegment?.time,
                            currentTape: tape,
                            currentTime: mediaTime,
                        });

                        return (
                            <SegmentContainer
                                key={segment.id}
                                data={segment}
                                contentLocale={transcriptLocale}
                                popupType={popupSegmentId === segment.id ? popupType : null}
                                openReference={popupSegmentId === segment.id ? openReference : null}
                                openPopup={this.openSegmentPopup}
                                closePopup={this.closeSegmentPopup}
                                setOpenReference={this.setOpenReference}
                                tabIndex={tabIndex}
                                active={active}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

Transcript.propTypes = {
    originalLocale: PropTypes.bool,
    loadSegments: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    mediaTime: PropTypes.number.isRequired,
    tape: PropTypes.number.isRequired,
    autoScroll: PropTypes.bool.isRequired,
    interview: PropTypes.object.isRequired,
    interviewee: PropTypes.object.isRequired,
    transcriptFetched: PropTypes.bool.isRequired,
    hasTranscript: PropTypes.bool.isRequired,
    transcriptLocale: PropTypes.string,
    userContentsStatus: PropTypes.string,
    fetchData: PropTypes.func.isRequired,
};

Transcript.defaultProps = {
    originalLocale: false,
};
