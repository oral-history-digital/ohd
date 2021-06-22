import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getFlattenedRefTree } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import TranscriptResult from './TranscriptResult';

export default function RegistryResult({
    data,
}) {
    const { locale } = useI18n();
    const flattenedRefTree = useSelector(getFlattenedRefTree);

    if (!flattenedRefTree) {
        return <Spinner small />;
    }

    return (
        <div className="SearchResult">
            <h3
                className="SearchResult-heading"
                dangerouslySetInnerHTML={{__html: data.text[locale]}}
            />
            {data.notes[locale] && (
                <p className="SearchResult-meta">
                    {data.notes[locale]}
                </p>
            )}
            <div className="u-mt-small">
                {
                    flattenedRefTree[data.id]?.children.map((leaf, index) => (
                        <TranscriptResult
                            key={index}
                            data={leaf}
                        />
                    ))
                }
            </div>
        </div>
    );
}

RegistryResult.propTypes = {
    data: PropTypes.object.isRequired,
};
