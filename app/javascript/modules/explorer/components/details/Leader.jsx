import PropTypes from 'prop-types';

import { GenericDetail } from './GenericDetail';

export function Leader({
    leader,
    groupClassName = 'DescriptionList-group--leader',
}) {
    return (
        <GenericDetail
            labelKey="activerecord.attributes.project.leader"
            value={leader}
            groupClassName={groupClassName}
        />
    );
}

Leader.propTypes = {
    leader: PropTypes.string,
    groupClassName: PropTypes.string,
};

export default Leader;
