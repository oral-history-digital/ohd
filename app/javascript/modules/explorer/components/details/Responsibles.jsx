import PropTypes from 'prop-types';

import { GenericDetail } from './GenericDetail';

export function Responsibles({
    responsibles,
    groupClassName = 'DescriptionList-group--responsibles',
}) {
    return (
        <GenericDetail
            labelKey="activerecord.attributes.collection.responsibles"
            value={responsibles}
            groupClassName={groupClassName}
        />
    );
}

Responsibles.propTypes = {
    responsibles: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    groupClassName: PropTypes.string,
};

export default Responsibles;
