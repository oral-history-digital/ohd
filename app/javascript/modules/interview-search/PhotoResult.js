import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export default function PhotoResult({ data }) {
    const { locale } = useI18n();

    return (
        <div className="SearchResult">
            <p className="SearchResult-meta">Bild-Id: {data.public_id}</p>
            <img src={data.thumb_src} alt="" />
            <p
                className="SearchResult-text"
                dangerouslySetInnerHTML={{ __html: data.text[locale] }}
            />
        </div>
    );
}

PhotoResult.propTypes = {
    data: PropTypes.object.isRequired,
};
