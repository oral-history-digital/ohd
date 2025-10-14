import classNames from 'classnames';
import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { formatTimecode } from 'modules/interview-helpers';
import { useScrollOffset } from 'modules/media-player';
import { useTranscriptQueryString } from 'modules/query-string';
import PropTypes from 'prop-types';
import { memo, useRef } from 'react';
import { useAutoScrollToRef } from '../../hooks';
import { checkTextDir, enforceRtlOnTranscriptTokens } from '../../utils';
import Initials from './Initials';

function Segment({
    segment,
    interview,
    contributor,
    contentLocale,
    isActive,
    autoScroll,
    sendTimeChangeRequest,
}) {
    const divEl = useRef();
    const { isAuthorized } = useAuthorization();
    const { t } = useI18n();
    const { segment: segmentParam } = useTranscriptQueryString();
    const transcriptCoupled = interview?.transcriptCoupled;

    const scrollOffset = useScrollOffset();

    const shouldScroll =
        (autoScroll && isActive) || // Segment is active and autoScroll is enabled (e.g. during playback)
        segmentParam === segment.id || // Segment is targeted by the URL param (segmentParam === data.id)
        (isActive && !segmentParam && autoScroll); // Segment is initially active and autoScroll is enabled, but no segmentParam is present

    // Use custom hook for auto-scroll logic
    useAutoScrollToRef(divEl, scrollOffset, shouldScroll, [
        autoScroll,
        isActive,
        segment.id,
        segmentParam,
    ]);

    let text = isAuthorized(segment, 'update')
        ? segment.text[contentLocale] || segment.text[`${contentLocale}-public`]
        : segment.text[`${contentLocale}-public`];

    const textDir = checkTextDir(text);
    // Enforce RTL wrapping if the text direction is RTL
    text = textDir === 'rtl' ? enforceRtlOnTranscriptTokens(text) : text;

    return (
        <div
            id={`segment_${segment.id}`}
            segment-tape={segment.tape_nbr}
            segment-time={formatTimecode(segment.time, true)}
            ref={divEl}
            className={classNames('Segment', {
                'Segment--withSpeaker': segment.speakerIdChanged,
                'is-active': isActive,
            })}
        >
            {segment.speakerIdChanged && (
                <Initials
                    initials={contributor?.initials || segment.speaker}
                    className={classNames(
                        'Segment-icon',
                        segment.speaker_is_interviewee
                            ? 'Segment-icon--primary'
                            : 'Segment-icon--secondary'
                    )}
                    title={contributor?.fullname || segment.speaker}
                />
            )}
            <button
                type="button"
                className={classNames('Segment-text', {
                    'is-active': isActive,
                })}
                lang={contentLocale}
                dir={textDir ? textDir : 'auto'}
                onClick={() => {
                    transcriptCoupled &&
                        sendTimeChangeRequest(segment.tape_nbr, segment.time);
                }}
            >
                {text?.replace(/&quot;/g, '"').replace(/&apos;/g, '`') || (
                    <i>{t('modules.transcript.no_text')}</i>
                )}
            </button>
        </div>
    );
}

Segment.propTypes = {
    segment: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    contributor: PropTypes.object,
    contentLocale: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    autoScroll: PropTypes.bool,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};

const MemoizedSegment = memo(Segment);

export default MemoizedSegment;
