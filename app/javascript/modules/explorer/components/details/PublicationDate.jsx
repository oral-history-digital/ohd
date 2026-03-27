import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export function PublicationDate({ publicationDate }) {
    const { t } = useI18n();

    if (!publicationDate) return null;

    return (
        <div className="DescriptionList-group DescriptionList-group--publication-date">
            <dt className="DescriptionList-term">
                {t('modules.catalog.publication_date')}
            </dt>
            <dd className="DescriptionList-description">{publicationDate}</dd>
        </div>
    );
}

PublicationDate.propTypes = {
    publicationDate: PropTypes.string,
};

export default PublicationDate;
