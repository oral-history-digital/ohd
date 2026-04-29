import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import { GenericLink } from './GenericLink';

export function ProjectLink({ projectId, projectName }) {
    const { locale } = useI18n();

    if (!projectId) return null;

    const url = `/${locale}/catalog/archives/${projectId}`;
    const title = typeof projectName === 'string' ? projectName : url;

    return (
        <GenericLink
            labelKey="activerecord.models.project.one"
            url={url}
            title={title}
            groupClassName="DescriptionList-group--project"
        />
    );
}

ProjectLink.propTypes = {
    projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    projectName: PropTypes.string,
};

export default ProjectLink;
