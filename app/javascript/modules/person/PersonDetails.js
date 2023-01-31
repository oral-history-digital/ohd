import { Fragment } from 'react';
import PropTypes from 'prop-types';

import { humanReadable } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PersonContributions from './PersonContributions';
import formatPersonName from './formatPersonName';

export default function PersonDetails({
    data
}) {
    const { t, locale, translations } = useI18n();

    const attributes = [
        'gender',
        'title',
        'first_name',
        'last_name',
        'birth_name',
        'alias_names',
        'other_first_names',
        'date_of_birth',
        'description'
    ];

    return (
        <div>
            <h3 className="u-mt-none u-mb">
                {formatPersonName(data, translations, { locale })}
            </h3>
            <dl>
                {attributes.map(attribute => (
                    <Fragment key={attribute}>
                        <dt className="u-line-height">
                            <b>{`${t(`activerecord.attributes.person.${attribute}`)}:`}</b>
                        </dt>
                        <dd className="u-line-height u-ml-none">
                            {humanReadable(data, attribute, { locale, translations }, {})}
                        </dd>
                    </Fragment>
                ))}
            </dl>

            <PersonContributions personId={data.id} />
        </div>
    );
}

PersonDetails.propTypes = {
    data: PropTypes.object.isRequired,
};
