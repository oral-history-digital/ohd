import { ALPHA2_TO_ALPHA3 } from 'modules/constants';
import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { TapeAndTime } from 'modules/interview-helpers';
import { sendTimeChangeRequest } from 'modules/media-player';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

export default function TocResult({ data }) {
    const dispatch = useDispatch();
    const interview = useSelector(getCurrentInterview);
    const { locale } = useI18n();
    const alpha3 = ALPHA2_TO_ALPHA3[locale];

    function handleClick() {
        interview.transcript_coupled &&
            dispatch(sendTimeChangeRequest(data.tape_nbr, data.time));
    }

    return (
        <button type="button" className="SearchResult" onClick={handleClick}>
            <p className="SearchResult-meta">
                {data.last_heading?.[alpha3] && (
                    <span>
                        {data.last_heading[alpha3]}
                        &nbsp;|&nbsp;
                    </span>
                )}
                <TapeAndTime
                    tape={data.tape_nbr}
                    time={data.time}
                    transcriptCoupled={interview.transcript_coupled}
                />
            </p>
            <p
                className="SearchResult-text"
                dangerouslySetInnerHTML={{ __html: data.text[alpha3] }}
            />
        </button>
    );
}

TocResult.propTypes = {
    data: PropTypes.object.isRequired,
};
