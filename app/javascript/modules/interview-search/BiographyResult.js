import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

export default function BiographyResult({ data }) {
    const { locale } = useI18n();

    return (
        <div className="SearchResult">
            <p
                className="SearchResult-text"
                dangerouslySetInnerHTML={{ __html: data.text[locale] }}
            />
        </div>
    );
}

BiographyResult.propTypes = {
    data: PropTypes.object.isRequired,
};
