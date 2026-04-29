import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt } from 'react-icons/fa';

export function Address({ address, lat, lon }) {
    const { t } = useI18n();

    const hasAddressFields =
        address?.street || address?.zip || address?.city || address?.country;

    if (!hasAddressFields) return null;

    // Merge zip and city into one field if both are available
    if (address.zip && address.city) {
        address.city = `${address.zip} ${address.city}`;
        delete address.zip;
    }

    // Remove any empty fields to avoid rendering extra commas
    const availableFields = [
        address.street,
        address.city,
        address.country,
    ].filter(Boolean);

    return (
        <div className="DescriptionList-group DescriptionList-group--address">
            <dt className="DescriptionList-term">
                {t('modules.catalog.address')}
            </dt>
            <dd className="DescriptionList-description">
                {availableFields.join(', ')}
                {lat && lon && (
                    <a
                        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="u-ml-small"
                        aria-label={t('modules.catalog.view_on_map')}
                        title={t('modules.catalog.view_on_map')}
                    >
                        <FaMapMarkerAlt />
                    </a>
                )}
            </dd>
        </div>
    );
}

Address.propTypes = {
    address: PropTypes.shape({
        street: PropTypes.string,
        zip: PropTypes.string,
        city: PropTypes.string,
        country: PropTypes.string,
    }),
    lat: PropTypes.number,
    lon: PropTypes.number,
};

export default Address;
