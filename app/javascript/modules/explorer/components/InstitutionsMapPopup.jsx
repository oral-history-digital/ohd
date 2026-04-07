import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { formatNumber } from 'modules/utils';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export function InstitutionsMapPopup({ title, marker }) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    const children = marker.children || [];
    const archives = (marker.archives || []).slice(0, 2); // Show up to 2 archives
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
                        {t('explorer.sub_institutions')}:
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

            {archives.length > 0 && (
                <>
                    <h4 className="MapPopup-subHeading">
                        {t('explorer.archives')} (
                        {formatNum(marker.archives.length)}):
                    </h4>
                    <ul className="MapPopup-list">
                        {archives.map((archive) => (
                            <li key={archive.id} className="MapPopup-text">
                                <Link
                                    to={`${pathBase}/catalog/archives/${archive.id}`}
                                >
                                    {archive.name}
                                </Link>
                                {archive.interviews_count > 0 && (
                                    <span className="MapPopup-interviewCount">
                                        {' '}
                                        ({formatNum(
                                            archive.interviews_count
                                        )}{' '}
                                        {t('explorer.interviews')})
                                    </span>
                                )}
                            </li>
                        ))}
                        {marker.archives.length > 2 && (
                            <li className="MapPopup-text">
                                <Link to={institutionUrl}>
                                    {t('explorer.institutions_map.and_more', {
                                        count: formatNum(
                                            marker.archives.length - 2
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
        archives: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                interviews_count: PropTypes.number,
            })
        ),
    }).isRequired,
};

export default InstitutionsMapPopup;
