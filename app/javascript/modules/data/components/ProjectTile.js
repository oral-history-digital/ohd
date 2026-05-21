import { getLocale } from 'modules/archive';
import { getInstitutions } from 'modules/data';
import { LinkOrA } from 'modules/routes';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export function ProjectTile({ data }) {
    const locale = useSelector(getLocale);
    const institutions = useSelector(getInstitutions);

    const logo =
        (data.logos &&
            Object.values(data.logos).find((l) => l.locale === locale)) ||
        data.logo;

    // Handle various possible project name fields, with locale-aware fallbacks for objects
    // TODO: standardize endpoint return structure to avoid this complexity
    const projectName =
        (typeof data.display_name === 'object' &&
            data.display_name?.[locale]) ||
        (typeof data.name === 'object' && data.name?.[locale]) ||
        data.display_name ||
        data.name ||
        data.shortname ||
        '';

    return (
        <LinkOrA className="ProjectTile" project={data} to="">
            <img
                className="ProjectTile-image logo-img"
                src={logo?.src || logo?.url}
                alt="Logo"
            />
            <div className="ProjectTile-body">
                <p className="ProjectTile-text">{projectName}</p>
                <p className="ProjectTile-text ProjectTile-text--small">
                    {data.institutions?.map((institution) => (
                        <p key={institution.id}>{institution.name}</p>
                    ))}
                    {data.institution_projects &&
                        Object.values(data.institution_projects).map((ip) => {
                            return (
                                <p key={ip.institution_id}>
                                    {
                                        institutions[ip.institution_id]?.name[
                                            locale
                                        ]
                                    }
                                </p>
                            );
                        })}
                </p>
            </div>
        </LinkOrA>
    );
}

ProjectTile.propTypes = {
    data: PropTypes.object.isRequired,
};

export default ProjectTile;
