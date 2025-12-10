import { getCurrentInterview, getFlattenedRefTree } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { getTextAndLang } from 'modules/interview-references';
import { Spinner } from 'modules/spinners';
import { Disclosure } from 'modules/ui';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import DumbTranscriptResult from './DumbTranscriptResult';

export default function RegistryResult({ data }) {
    const { locale } = useI18n();
    const flattenedRefTree = useSelector(getFlattenedRefTree);
    const interview = useSelector(getCurrentInterview);

    if (!flattenedRefTree) {
        return <Spinner size="small" />;
    }

    const title = (
        <>
            <h3
                className="SearchResult-heading"
                dangerouslySetInnerHTML={{ __html: data.text[locale] }}
            />
            {data.notes[locale] && (
                <p className="SearchResult-meta">{data.notes[locale]}</p>
            )}
        </>
    );

    return (
        <div className="SearchResult">
            <Disclosure title={title}>
                <div className="u-mt-small">
                    {flattenedRefTree[data.id]?.children.map((entry, index) => {
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
                                transcriptCoupled={interview.transcript_coupled}
                            />
                        );
                    })}
                </div>
            </Disclosure>
        </div>
    );
}

RegistryResult.propTypes = {
    data: PropTypes.object.isRequired,
};
