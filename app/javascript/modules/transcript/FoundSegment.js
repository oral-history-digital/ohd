import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import { TapeAndTime } from '../interview-helpers';

export default function FoundSegment({
    index,
    foundSegmentsAmount,
    active,
    data,
    locale,
    sendTimeChangeRequest,
}) {
    const { t } = useI18n();

    // ${locale}-public is necessary for FoundSegments in RefTree.
    const segmentText = data.text[locale] || data.text[`${locale}-public`];

    return (
        <button
            type="button"
            className={classNames('SearchResult', {'is-highlighted': active})}
            onClick={() => sendTimeChangeRequest(data.tape_nbr, data.time)}
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

FoundSegment.propTypes = {
    data: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    index: PropTypes.number,
    foundSegmentsAmount: PropTypes.number,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
