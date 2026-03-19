import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export function InstitutionsMapPopup({ title, marker }) {
    const { t } = useI18n();
    const children = marker.children || [];
    const archives = (marker.archives || []).slice(0, 1);

    return (
        <div className="MapPopup">
            <h3 className="MapPopup-heading">{title}</h3>

            {children.length > 0 && (
                <>
                    <h4 className="MapPopup-subSubHeading">
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
                    <h4 className="MapPopup-subSubHeading">
                        {t('explorer.archives')}:
                    </h4>
                    <ul className="MapPopup-list">
                        {archives.map((archive) => (
                            <li key={archive.id} className="MapPopup-text">
                                {archive.name}
                                {archive.interviews_count > 0 && (
                                    <span>
                                        {' '}
                                        ({archive.interviews_count}{' '}
                                        {t('explorer.interviews')})
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

InstitutionsMapPopup.propTypes = {
    title: PropTypes.string.isRequired,
    marker: PropTypes.shape({
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
