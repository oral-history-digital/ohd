import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import { useI18n } from 'modules/i18n';

export default function FoundSegment({
    tape_count,
    index,
    foundSegmentsAmount,
    active,
    data,
    locale,
    sendTimeChangeRequest,
}) {
    const { t } = useI18n();

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
                {(tape_count > 1) && (
                    <span>
                        {t('tape')} {data.tape_nbr}/{tape_count}
                        &nbsp;|&nbsp;
                    </span>
                )}
                {moment.utc(data.time * 1000).format('HH:mm:ss')}
            </p>
            <p
                className="SearchResult-text"
                dangerouslySetInnerHTML={{__html: data.text[locale]}}
            />
        </button>
    );
}

FoundSegment.propTypes = {
    data: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    tape_count: PropTypes.number,
    active: PropTypes.bool.isRequired,
    index: PropTypes.number,
    foundSegmentsAmount: PropTypes.number,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
