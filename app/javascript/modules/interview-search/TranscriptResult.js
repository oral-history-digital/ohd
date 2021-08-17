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
    locale,
}) {
    const dispatch = useDispatch();
    const { t, locale: localeFromUi } = useI18n();

    const localeUsed = locale || localeFromUi;

    // ${locale}-public is necessary for FoundSegments in RefTree.
    const segmentText = data.text[localeUsed] || data.text[`${localeUsed}-public`];

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
                {data.last_heading?.[localeUsed] && (
                    <span>
                        {t('in')}: {data.last_heading[localeUsed]}
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
    locale: PropTypes.string,
    active: PropTypes.bool,
    index: PropTypes.number,
    foundSegmentsAmount: PropTypes.number,
};
