import PropTypes from 'prop-types';

import { GenericDetail } from './GenericDetail';

export function CooperationPartner({
    cooperationPartner,
    groupClassName = 'DescriptionList-group--cooperation-partner',
}) {
    return (
        <GenericDetail
            labelKey="activerecord.attributes.project.cooperation_partner"
            value={cooperationPartner}
            groupClassName={groupClassName}
        />
    );
}

CooperationPartner.propTypes = {
    cooperationPartner: PropTypes.string,
    groupClassName: PropTypes.string,
};

export default CooperationPartner;
