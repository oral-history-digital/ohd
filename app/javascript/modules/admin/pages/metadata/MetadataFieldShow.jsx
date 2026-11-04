import { getTranslations } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { localizedValue } from 'modules/utils';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

/**
 * Shows a built-in facet name or the field's localized label.
 * @param {Object} props - Metadata definition with a current or legacy label value.
 * @returns {React.ReactElement} Field label.
 */
function MetadataFieldShow({ data }) {
    const translations = useSelector(getTranslations);
    const { t, locale } = useI18n();

    let name;
    if (translations[`search_facets.${data.name}`]) {
        name = t(`search_facets.${data.name}`);
    } else {
        name = localizedValue(data.label, locale);
    }

    return (
        <div className="base-data box">
            <p className="name">{name}</p>
        </div>
    );
}

export default MetadataFieldShow;

MetadataFieldShow.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.objectOf(PropTypes.string),
        ]),
    }).isRequired,
};
