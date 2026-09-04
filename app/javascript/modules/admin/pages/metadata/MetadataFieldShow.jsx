import { getLocale, getTranslations } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

function MetadataFieldShow({ data }) {
    const locale = useSelector(getLocale);
    const translations = useSelector(getTranslations);
    const { t } = useI18n();

    let name;
    if (translations[`search_facets.${data.name}`]) {
        name = t(`search_facets.${data.name}`);
    } else {
        name = data.label && data.label[locale];
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
        label: PropTypes.objectOf(PropTypes.string),
    }).isRequired,
};
