import PropTypes from 'prop-types';

import { GenericDetail } from './GenericDetail';

function personName(person) {
    const directName = person?.name?.trim();
    if (directName) {
        return directName;
    }

    const firstName = person?.first_name?.trim() || '';
    const lastName = person?.last_name?.trim() || '';
    return [firstName, lastName].filter(Boolean).join(' ');
}

export function GenericPeople({ people = [], labelKey, groupClassName }) {
    const names = people.map(personName).filter(Boolean);

    return (
        <GenericDetail
            labelKey={labelKey}
            value={names}
            groupClassName={groupClassName}
        />
    );
}

GenericPeople.propTypes = {
    people: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            type: PropTypes.string,
            name_type: PropTypes.string,
            name: PropTypes.string,
            first_name: PropTypes.string,
            last_name: PropTypes.string,
        })
    ),
    labelKey: PropTypes.string.isRequired,
    groupClassName: PropTypes.string.isRequired,
};

export default GenericPeople;
