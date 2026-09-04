import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

function AffiliateShow({ data }) {
    const { locale } = useI18n();

    const name =
        data.name_type === 'Personal'
            ? `${data.first_name[locale]} ${data.last_name[locale]}`
            : data.name[locale];
    return (
        <div className="base-data box">
            <p className="name">{name}</p>
        </div>
    );
}

export default AffiliateShow;

AffiliateShow.propTypes = {
    data: PropTypes.shape({
        name_type: PropTypes.string.isRequired,
        name: PropTypes.objectOf(PropTypes.string),
        first_name: PropTypes.objectOf(PropTypes.string),
        last_name: PropTypes.objectOf(PropTypes.string),
    }).isRequired,
};
