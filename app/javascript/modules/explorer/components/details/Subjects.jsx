import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export function Subjects({ subjects }) {
    const { t } = useI18n();

    if (!subjects?.length) return null;

    return (
        <div className="DescriptionList-group DescriptionList-group--subjects">
            <dt className="DescriptionList-term">
                {t('modules.catalog.subjects')}
            </dt>
            <dd className="DescriptionList-description">
                {subjects.join(', ')}
            </dd>
        </div>
    );
}

Subjects.propTypes = {
    subjects: PropTypes.arrayOf(PropTypes.string),
};

export default Subjects;
