import { getLocale } from 'modules/archive';
import { getCollections, getProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { LinkOrA } from 'modules/routes';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export function InstitutionTile({ data }) {
    const locale = useSelector(getLocale);
    const projects = useSelector(getProjects);
    const collections = useSelector(getCollections);
    const { t } = useI18n();

    const collectionsForInstitute = data.collection_ids.map(
        (id) => collections[id]
    );

    const logo =
        data.logos &&
        Object.values(data.logos).find((l) => l.locale === locale);

    return (
        <div className="ProjectTile">
            <p className="ProjectTile-text">{data.name[locale]}</p>
            <img
                className="ProjectTile-image logo-img"
                src={logo?.src}
                alt="Logo"
            />

            <h3>{t('activerecord.models.project.other')}</h3>
            <ul>
                {Object.values(data.institution_projects).map((ip) => {
                    const project = projects[ip.project_id];
                    if (!project) return null;
                    return (
                        <li key={ip.id}>
                            <LinkOrA project={project} to="">
                                {project.name[locale]}
                            </LinkOrA>
                        </li>
                    );
                })}
            </ul>

            <h3>{t('activerecord.models.collection.other')}</h3>
            <ul>
                {collectionsForInstitute.map((collection) => {
                    if (!collection) return null;
                    const project = projects[collection.project_id];
                    return (
                        <li key={collection.id}>
                            <LinkOrA project={project} to="">
                                {collection.name[locale]}
                            </LinkOrA>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

InstitutionTile.propTypes = {
    data: PropTypes.object.isRequired,
};

export default InstitutionTile;
