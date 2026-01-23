import { useI18n } from 'modules/i18n';
import { sanitizeHtml } from 'modules/utils';
import PropTypes from 'prop-types';

export default function PhotoResult({ data }) {
    const { locale } = useI18n();

    return (
        <div className="SearchResult">
            <p className="SearchResult-meta">Bild-Id: {data.public_id}</p>
            <img src={data.thumb_src} alt="" />
            <p
                className="SearchResult-text"
                dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(data.text[locale], 'SEARCH_RESULT'),
                }}
            />
        </div>
    );
}

PhotoResult.propTypes = {
    data: PropTypes.object.isRequired,
};
