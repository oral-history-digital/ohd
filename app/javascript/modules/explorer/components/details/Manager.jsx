import PropTypes from 'prop-types';

import { GenericDetail } from './GenericDetail';

export function Manager({
    manager,
    groupClassName = 'DescriptionList-group--manager',
}) {
    return (
        <GenericDetail
            labelKey="activerecord.attributes.project.manager"
            value={manager}
            groupClassName={groupClassName}
        />
    );
}

Manager.propTypes = {
    manager: PropTypes.string,
    groupClassName: PropTypes.string,
};

export default Manager;
