import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export function GenericDetail({
    labelKey,
    value,
    groupClassName,
    multiValueMode = 'join',
    joinWith = ', ',
}) {
    const { t } = useI18n();

    const values = Array.isArray(value)
        ? value.filter((item) => item)
        : value
          ? [value]
          : [];

    if (!values.length) return null;

    return (
        <div className={`DescriptionList-group ${groupClassName}`}>
            <dt className="DescriptionList-term">{t(labelKey)}</dt>
            <dd className="DescriptionList-description">
                {multiValueMode === 'list' ? (
                    <ul className="UnorderedList">
                        {values.map((item, index) => (
                            <li key={`${item}-${index}`}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    values.join(joinWith)
                )}
            </dd>
        </div>
    );
}

GenericDetail.propTypes = {
    labelKey: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        ),
    ]),
    groupClassName: PropTypes.string.isRequired,
    multiValueMode: PropTypes.oneOf(['join', 'list']),
    joinWith: PropTypes.string,
};

export default GenericDetail;
