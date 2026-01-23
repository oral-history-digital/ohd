import { useI18n } from 'modules/i18n';
import { sanitizeHtml } from 'modules/utils';
import PropTypes from 'prop-types';

export default function BiographyResult({ data }) {
    const { locale } = useI18n();

    return (
        <div className="SearchResult">
            <p
                className="SearchResult-text"
                dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(data.text[locale], 'SEARCH_RESULT'),
                }}
            />
        </div>
    );
}

BiographyResult.propTypes = {
    data: PropTypes.object.isRequired,
};
