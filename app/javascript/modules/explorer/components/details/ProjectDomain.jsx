import PropTypes from 'prop-types';

import { GenericLink } from './GenericLink';

export function ProjectDomain({ domain }) {
    return (
        <GenericLink
            labelKey="activerecord.attributes.project.archive_domain"
            url={domain}
            isExternal
            groupClassName="DescriptionList-group--project-domain"
        />
    );
}

ProjectDomain.propTypes = {
    domain: PropTypes.string,
};

export default ProjectDomain;
