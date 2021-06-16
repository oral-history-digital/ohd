import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getFlattenedRefTree } from 'modules/data';
import { useI18n } from 'modules/i18n';

export default function RegistryResult({
    data,
}) {
    const { locale } = useI18n();
    const flattenedRefTree = useSelector(getFlattenedRefTree);

    return (
        <div className="SearchResult">
            <p
                className="SearchResult-text"
                dangerouslySetInnerHTML={{__html: data.text[locale]}}
            />
            {data.notes[locale] && (
                <p className="SearchResult-meta">
                    {data.notes[locale]}
                </p>
            )}
            <div>
                {
                    flattenedRefTree[data.id].children.map((leaf, index) => (
                        <FoundSegmentContainer
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
