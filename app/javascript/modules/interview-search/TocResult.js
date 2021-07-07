import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { sendTimeChangeRequest } from 'modules/media-player';
import { TapeAndTime } from 'modules/interview-helpers';

export default function TocResult({
    data,
}) {
    const dispatch = useDispatch();
    const { locale } = useI18n();

    function handleClick() {
        dispatch(sendTimeChangeRequest(data.tape_nbr, data.time));
    }

    return (
        <button
            type="button"
            className="SearchResult"
            onClick={handleClick}
        >
            <p className="SearchResult-meta">
                {data.last_heading?.[locale] && (
                    <span>
                        {data.last_heading[locale]}
                        &nbsp;|&nbsp;
                    </span>
                )}
                <TapeAndTime tape={data.tape_nbr} time={data.time} />
            </p>
            <p
                className="SearchResult-text"
                dangerouslySetInnerHTML={{__html: data.text[locale]}}
            />
        </button>
    );
}

TocResult.propTypes = {
    data: PropTypes.object.isRequired,
};
