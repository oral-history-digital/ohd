import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export function Institutions({ institutions, labelKey }) {
    const { t, locale } = useI18n();

    const normalizedInstitutions = Array.isArray(institutions)
        ? institutions
        : institutions
          ? [institutions]
          : [];

    const validInstitutions = normalizedInstitutions
        .map((inst) => {
            const localizedName =
                typeof inst?.name === 'string'
                    ? inst.name
                    : inst?.name?.[locale] ||
                      Object.values(inst?.name || {}).find(Boolean);

            return {
                id: inst?.id,
                name: localizedName,
            };
        })
        .filter((inst) => inst?.id && inst?.name);

    if (validInstitutions.length === 0) return null;

    const institutionLabel = labelKey
        ? t(labelKey)
        : t(
              `activerecord.models.institution.${
                  validInstitutions.length === 1 ? 'one' : 'other'
              }`
          );

    return (
        <div className="DescriptionList-group DescriptionList-group--institutions">
            <dt className="DescriptionList-term">{institutionLabel}</dt>
            <dd className="DescriptionList-description">
                {validInstitutions.length > 1 ? (
                    <ul className="UnorderedList">
                        {validInstitutions.map((inst) => (
                            <li key={inst.id}>
                                <Link
                                    to={`/${locale}/catalog/institutions/${inst.id}`}
                                >
                                    {inst.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Link
                        to={`/${locale}/catalog/institutions/${validInstitutions[0].id}`}
                    >
                        {validInstitutions[0].name}
                    </Link>
                )}
            </dd>
        </div>
    );
}

Institutions.propTypes = {
    institutions: PropTypes.oneOfType([
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        }),
        PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
            })
        ),
    ]),
    labelKey: PropTypes.string,
};

export default Institutions;
