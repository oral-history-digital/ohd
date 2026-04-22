import { pluralizeKey, useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { formatNumber } from 'modules/utils';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export function InstitutionsMapPopup({ title, marker }) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    const children = marker.children || [];
    const projects = (marker.projects || []).slice(0, 2); // Show up to 2 projects
    const institutionUrl = `${pathBase}/catalog/institutions/${marker.id}`;

    const formatNum = (num) => formatNumber(num, 0, locale);

    return (
        <div className="MapPopup MapPopup--wide">
            <Link to={institutionUrl}>
                <h3 className="MapPopup-heading">{title}</h3>
            </Link>

            {children.length > 0 && (
                <>
                    <h4 className="MapPopup-subHeading">
                        {t(
                            pluralizeKey(
                                'explorer.sub_institutions',
                                children.length,
                                locale
                            )
                        )}
                        :
                    </h4>
                    <ul className="MapPopup-list">
                        {children.map((child) => (
                            <li key={child.id} className="MapPopup-text">
                                {child.name}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {projects.length > 0 && (
                <>
                    <h4 className="MapPopup-subHeading">
                        {t('explorer.projects')} (
                        {formatNum(marker.projects.length)}):
                    </h4>
                    <ul className="MapPopup-list">
                        {projects.map((project) => (
                            <li key={project.id} className="MapPopup-text">
                                <Link
                                    to={`${pathBase}/catalog/archives/${projects.id}`}
                                >
                                    {projects.name}
                                </Link>
                                {projects.interviews_count > 0 && (
                                    <span className="MapPopup-interviewCount">
                                        {' '}
                                        ({formatNum(
                                            projects.interviews_count
                                        )}{' '}
                                        {t('explorer.interviews')})
                                    </span>
                                )}
                            </li>
                        ))}
                        {marker.projects.length > 2 && (
                            <li className="MapPopup-text">
                                <Link to={institutionUrl}>
                                    {t('explorer.institutions_map.and_more', {
                                        count: formatNum(
                                            marker.projects.length - 2
                                        ),
                                    })}
                                </Link>
                            </li>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
}
InstitutionsMapPopup.propTypes = {
    title: PropTypes.string.isRequired,
    marker: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        children: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
            })
        ),
        projects: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                interviews_count: PropTypes.number,
            })
        ),
    }).isRequired,
};

export default InstitutionsMapPopup;
