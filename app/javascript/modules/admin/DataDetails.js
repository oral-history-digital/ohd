import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { useHumanReadable } from 'modules/data';

export default function DataDetails({
    detailsAttributes,
    data,
    scope,
    optionsScope,
}) {
    const { t, locale } = useI18n();
    const { humanReadable } = useHumanReadable();

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
                                    {humanReadable({obj: data, attribute})}
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
};
