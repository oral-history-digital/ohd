import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { sendTimeChangeRequest } from 'modules/media-player';
import { TapeAndTime } from 'modules/interview-helpers';

export default function TranscriptResult({
    index,
    foundSegmentsAmount,
    active,
    data,
}) {
    const dispatch = useDispatch();
    const { t, locale } = useI18n();

    // ${locale}-public is necessary for FoundSegments in RefTree.
    const segmentText = data.text[locale] || data.text[`${locale}-public`];

    function handleClick() {
        dispatch(sendTimeChangeRequest(data.tape_nbr, data.time));
    }

    return (
        <button
            type="button"
            className={classNames('SearchResult', {'is-highlighted': active})}
            onClick={handleClick}
        >
            {index && foundSegmentsAmount && (
                <div className="hits-count">
                    <div>
                        {index}/{foundSegmentsAmount}
                    </div>
                </div>
            )}
            <p className="SearchResult-meta">
                {data.last_heading?.[locale] && (
                    <span>
                        {t('in')}: {data.last_heading[locale]}
                        &nbsp;|&nbsp;
                    </span>
                )}
                <TapeAndTime tape={data.tape_nbr} time={data.time} />
            </p>
            <p
                className="SearchResult-text"
                dangerouslySetInnerHTML={{__html: segmentText}}
            />
        </button>
    );
}

TranscriptResult.propTypes = {
    data: PropTypes.object.isRequired,
    active: PropTypes.bool,
    index: PropTypes.number,
    foundSegmentsAmount: PropTypes.number,
};
