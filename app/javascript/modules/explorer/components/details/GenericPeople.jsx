import PropTypes from 'prop-types';

import { personName } from '../../utils';
import { GenericDetail } from './GenericDetail';

export function GenericPeople({ people = [], labelKey, groupClassName }) {
    if (!people?.length) return null;

    const names = people.map(personName).filter(Boolean);

    if (!names.length) return null;

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
