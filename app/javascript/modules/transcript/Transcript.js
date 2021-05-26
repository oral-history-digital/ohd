import { Component } from 'react';
import PropTypes from 'prop-types';

import { t } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import segmentsForTape from './segmentsForTape';
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
        const { locale, projectId, projects, autoScroll } = this.props;

        this.loadSegments();
        if (!this.props.userContentsStatus) {
            this.props.fetchData({ locale, projectId, projects }, 'user_contents');
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
        const { locale, projectId, projects, archiveId } = this.props;

        if (
            this.props.loadSegments &&
            !this.props.segmentsStatus[`for_interviews_${archiveId}`]
        ) {
            this.props.fetchData({ locale, projectId, projects }, 'interviews', archiveId, 'segments');
        }
    }

    firstSegment() {
        const { interview, tape } = this.props;
        const segments = segmentsForTape(interview, tape);
        return segments[interview.first_segments_ids[tape]];
    }

    firstTranslationLocale() {
        return this.props.interview.languages.filter(l => l !== this.props.interview.lang)[0];
    }

    transcripted(locale) {
        let first = this.firstSegment();
        return first && (Object.prototype.hasOwnProperty.call(first.text, locale) || Object.prototype.hasOwnProperty.call(first.text, `${locale}-public`));
    }

    transcript(){
        const { interviewee, mediaTime, tape } = this.props;
        const { popupSegmentId, popupType, openReference } = this.state;

        let locale = this.props.originalLocale ? this.props.interview.lang : this.firstTranslationLocale();
        let tabIndex = this.props.originalLocale ? 0 : 1;
        let sortedWithIndex = sortedSegmentsWithActiveIndex(this.props.mediaTime, this.props);
        let shownSegments = sortedWithIndex[1];

        let speaker, speakerId;

        return shownSegments.map((segment, index, array) => {
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
                    contentLocale={locale}
                    popupType={popupSegmentId === segment.id ? popupType : null}
                    openReference={popupSegmentId === segment.id ? openReference : null}
                    openPopup={this.openSegmentPopup}
                    closePopup={this.closeSegmentPopup}
                    setOpenReference={this.setOpenReference}
                    tabIndex={tabIndex}
                    active={active}
                />
            );
        });
    }

    render () {
        const { segmentsStatus, archiveId, originalLocale, interview } = this.props;

        if (segmentsStatus[`for_interviews_${archiveId}`] && segmentsStatus[`for_interviews_${archiveId}`].split('-')[0] === 'fetched') {
            if (originalLocale) {
                return this.transcripted(interview.lang) ? this.transcript() : t(this.props, 'without_transcript');
            } else {
                return this.transcripted(this.firstTranslationLocale()) ? this.transcript() : t(this.props, 'without_translation');
            }
        } else {
            return <Spinner />;
        }
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
    segmentsStatus: PropTypes.object.isRequired,
    userContentsStatus: PropTypes.string,
    fetchData: PropTypes.func.isRequired,
};

Transcript.defaultProps = {
    originalLocale: false,
};
