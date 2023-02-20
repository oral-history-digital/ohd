import { Fragment } from 'react';
import PropTypes from 'prop-types';

import { humanReadable } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePersonEvents, Event } from 'modules/events';
import { Spinner } from 'modules/spinners';
import PersonContributions from './PersonContributions';
import formatPersonName from './formatPersonName';

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

export default function PersonDetails({
    data
}) {
    const { t, locale, translations } = useI18n();
    const { data: events, isLoading: eventsAreLoading } = usePersonEvents(data.id);

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

            {eventsAreLoading ? (
                <Spinner small />
            ) : (
                <article>
                    <h4>{t('activerecord.models.event.other')}</h4>
                    <ul className="UnorderedList UnorderedList--plain u-flex">
                        {events?.map(event => (
                            <Event
                                className="u-mr-small"
                                key={event.id}
                                event={event}
                            />
                        ))}
                    </ul>
                </article>
            )}

            <PersonContributions personId={data.id} />
        </div>
    );
}

PersonDetails.propTypes = {
    data: PropTypes.object.isRequired,
};
