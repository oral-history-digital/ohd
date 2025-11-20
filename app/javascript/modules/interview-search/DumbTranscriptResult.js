import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { sendTimeChangeRequest } from 'modules/media-player';
import { TapeAndTime } from 'modules/interview-helpers';

export default function DumbTranscriptResult({
    highlightedText,
    heading,
    tapeNumber,
    time,
    className,
    lang,
    transcriptCoupled,
}) {
    const { t } = useI18n();
    const dispatch = useDispatch();

    function handleClick() {
        if (transcriptCoupled) {
            dispatch(sendTimeChangeRequest(tapeNumber, time));
        }
    }

    return (
        <button
            type="button"
            className={classNames('SearchResult', className)}
            onClick={handleClick}
        >
            <p className="SearchResult-meta">
                {heading && (
                    <span>
                        {t('in')}: {heading}
                        &nbsp;|&nbsp;
                    </span>
                )}
                <TapeAndTime
                    tape={tapeNumber}
                    time={time}
                    transcriptCoupled={transcriptCoupled}
                />
            </p>
            <p
                className="SearchResult-text"
                lang={lang}
                dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
        </button>
    );
}

DumbTranscriptResult.propTypes = {
    highlightedText: PropTypes.string.isRequired,
    heading: PropTypes.string,
    tapeNumber: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    className: PropTypes.string,
    lang: PropTypes.string.isRequired,
};
