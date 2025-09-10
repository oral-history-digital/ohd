import { getLocale } from 'modules/archive';
import { getInstitutions } from 'modules/data';
import { LinkOrA } from 'modules/routes';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function ProjectTile({ data }) {
    const locale = useSelector(getLocale);
    const institutions = useSelector(getInstitutions);

    const logo =
        data.logos &&
        Object.values(data.logos).find((l) => l.locale === locale);

    return (
        <LinkOrA className="ProjectTile" project={data} to="">
            <img
                className="ProjectTile-image logo-img"
                src={logo?.src}
                alt="Logo"
            />
            <div className="ProjectTile-body">
                <p className="ProjectTile-text">{data.name[locale]}</p>
                <p className="ProjectTile-text ProjectTile-text--small">
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
