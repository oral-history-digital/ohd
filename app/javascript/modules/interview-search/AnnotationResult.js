import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

export default function AnnotationResult({
    data,
}) {
    const { locale } = useI18n();

    const annotationText = data.text[locale];

    console.log(data);

    return (
        <button
            type="button"
            className="SearchResult"
        >
            <p className="SearchResult-meta">
            </p>
            <p
                className="SearchResult-text"
                dangerouslySetInnerHTML={{__html: annotationText}}
            />
        </button>
    );
}

AnnotationResult.propTypes = {
    data: PropTypes.object.isRequired,
};
