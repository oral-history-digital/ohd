import PropTypes from 'prop-types';

import { humanReadable } from 'modules/data';
import { useI18n } from 'modules/i18n';

export default function DataDetails({
    detailsAttributes,
    data,
    scope,
    optionsScope,
    locale,
    translations,
}) {
    const { t } = useI18n();

    return (
        <div className="details">
            {
                detailsAttributes.map(attribute => {
                    if (attribute === 'src') {
                        return (
                            <img
                                key={attribute}
                                src={data.src}
                                style={{ maxWidth: '100%' }}
                                alt=""
                            />
                        );
                    } else {
                        return (
                            <p
                                key={attribute}
                                className="detail"
                            >
                                <span className='name'>
                                    {t(`activerecord.attributes.${scope}.${attribute}`) + ': '}
                                </span>
                                <span className='content'>
                                    {humanReadable(data, attribute, { locale, translations, optionsScope }, {})}
                                </span>
                            </p>
                        )
                    }
                })
            }
        </div>
    );
}

DataDetails.propTypes = {
    detailsAttributes: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    optionsScope: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
};
