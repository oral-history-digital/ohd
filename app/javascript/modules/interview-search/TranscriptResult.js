import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { getCurrentInterview } from 'modules/data';
import DumbTranscriptResult from './DumbTranscriptResult';

export default function TranscriptResult({ data, locale }) {
    const { locale: localeFromUi } = useI18n();
    const interview = useSelector(getCurrentInterview);

    const localeUsed = locale || localeFromUi;
    const segmentText = data.text[localeUsed];

    const lang = localeUsed === 'orig' ? interview.alpha3 : localeUsed;

    return (
        <DumbTranscriptResult
            highlightedText={segmentText}
            heading={data.last_heading?.[localeUsed]}
            tapeNumber={data.tape_nbr}
            time={data.time}
            lang={lang}
            transcriptCoupled={interview.transcript_coupled}
        />
    );
}

TranscriptResult.propTypes = {
    data: PropTypes.object.isRequired,
    locale: PropTypes.string,
};
