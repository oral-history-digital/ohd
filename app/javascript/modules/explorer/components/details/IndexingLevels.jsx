import { useI18n } from 'modules/i18n';
import { formatNumber } from 'modules/utils';
import PropTypes from 'prop-types';

export function IndexingLevels({ levels }) {
    const { t, locale } = useI18n();

    if (!levels || !levels.length) return null;

    return (
        <div className="DescriptionList-group DescriptionList-group--levels-of-indexing">
            <dt className="DescriptionList-term">
                {t('modules.catalog.level_of_indexing')}
            </dt>
            <dd className="DescriptionList-description">
                {levels.map((level, i) => (
                    <span key={`loi-${i}`}>
                        {`${formatNumber(level.count, 0, locale)} ${level.descriptor}`}
                        {i < levels.length - 1 && ', '}
                    </span>
                ))}
            </dd>
        </div>
    );
}

IndexingLevels.propTypes = {
    levels: PropTypes.arrayOf(
        PropTypes.shape({
            descriptor: PropTypes.string,
            count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        })
    ),
};

export default IndexingLevels;
