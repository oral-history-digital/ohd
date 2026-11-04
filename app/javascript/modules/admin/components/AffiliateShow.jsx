import { useI18n } from 'modules/i18n';
import { localizedValue } from 'modules/utils';
import PropTypes from 'prop-types';

/**
 * Displays a localized affiliate name from current or legacy records.
 * @param {Object} props - Affiliate record.
 * @returns {React.ReactElement} Personal or organizational name.
 */
function AffiliateShow({ data }) {
    const { locale } = useI18n();

    const name =
        data.name_type === 'Personal'
            ? [
                  localizedValue(data.first_name, locale),
                  localizedValue(data.last_name, locale),
              ]
                  .filter(Boolean)
                  .join(' ')
            : localizedValue(data.name, locale);
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
        name: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.objectOf(PropTypes.string),
        ]),
        first_name: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.objectOf(PropTypes.string),
        ]),
        last_name: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.objectOf(PropTypes.string),
        ]),
    }).isRequired,
};
