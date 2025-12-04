import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { DumbTranscriptResult } from 'modules/interview-search';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import getTextAndLang from './getTextAndLang';

export default function TranscriptResultList({ transcriptResults }) {
    const interview = useSelector(getCurrentInterview);
    const { locale } = useI18n();

    return transcriptResults.map((entry, index) => {
        const [text, lang] = getTextAndLang(
            entry.text,
            locale,
            interview.alpha3
        );

        return (
            <DumbTranscriptResult
                key={index}
                highlightedText={text}
                tapeNumber={entry.tape_nbr}
                time={entry.time}
                lang={lang}
                className="heading"
                transcriptCoupled={interview.transcript_coupled}
            />
        );
    });
}

TranscriptResultList.propTypes = {
    transcriptResults: PropTypes.array.isRequired,
};
