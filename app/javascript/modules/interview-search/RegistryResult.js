import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

export default function RegistryResult({
    data,
}) {
    const { locale } = useI18n();

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
        </div>
    );
}

RegistryResult.propTypes = {
    data: PropTypes.object.isRequired,
};
