import PropTypes from 'prop-types';

import { GenericDetail } from './GenericDetail';

export function PseudoFunderNames({
    pseudoFunderNames,
    groupClassName = 'DescriptionList-group--pseudo-funder-names',
}) {
    return (
        <GenericDetail
            labelKey="activerecord.attributes.project.pseudo_funder_names"
            value={pseudoFunderNames}
            groupClassName={groupClassName}
            multiValueMode="list"
        />
    );
}

PseudoFunderNames.propTypes = {
    pseudoFunderNames: PropTypes.arrayOf(PropTypes.string),
    groupClassName: PropTypes.string,
};

export default PseudoFunderNames;
