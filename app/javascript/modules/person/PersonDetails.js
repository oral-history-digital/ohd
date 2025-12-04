import { Fragment } from 'react';

import { useHumanReadable } from 'modules/data';
import { Event, usePersonEvents } from 'modules/events';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';

import PersonContributions from './PersonContributions';

const attributes = [
    'gender',
    'title',
    'first_name',
    'last_name',
    'birth_name',
    'alias_names',
    'other_first_names',
    'pseudonym_first_name',
    'pseudonym_last_name',
    'use_pseudonym',
    'date_of_birth',
    'description',
];

export default function PersonDetails({ data }) {
    const { t } = useI18n();
    const { humanReadable } = useHumanReadable();
    const { data: events, isLoading: eventsAreLoading } = usePersonEvents(
        data.id
    );

    return (
        <div>
            <h3 className="u-mt-none u-mb">{data.display_name}</h3>
            <dl>
                {attributes.map((attribute) => (
                    <Fragment key={attribute}>
                        <dt className="u-line-height">
                            <b>{`${t(
                                `activerecord.attributes.person.${attribute}`
                            )}:`}</b>
                        </dt>
                        <dd className="u-line-height u-ml-none">
                            {humanReadable({ obj: data, attribute })}
                        </dd>
                    </Fragment>
                ))}
            </dl>

            {eventsAreLoading ? (
                <Spinner size="small" />
            ) : (
                <article>
                    <h4>{t('activerecord.models.event.other')}</h4>
                    <ul className="UnorderedList UnorderedList--plain u-flex">
                        {events?.map((event) => (
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
