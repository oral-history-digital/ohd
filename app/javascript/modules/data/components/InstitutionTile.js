import { useI18n } from 'modules/i18n';
import { LinkOrA } from 'modules/routes';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useProjectDetail } from '../hooks/useProjectDetail';
import { getCollections } from '../redux/selectors/baseSelectors';

/**
 * Links to an institution's project after its current display details are available.
 * @param {Object} props - Related project ID and optional collection link text.
 * @returns {React.ReactElement|null} Project link, or nothing while unavailable.
 */
function InstitutionProjectLink({ projectId, children }) {
    const { project, isLoading, error } = useProjectDetail(projectId);
    if (isLoading || error || !project) return null;
    return (
        <LinkOrA project={project} to="">
            {children || project.name}
        </LinkOrA>
    );
}

InstitutionProjectLink.propTypes = {
    projectId: PropTypes.number.isRequired,
    children: PropTypes.node,
};

/**
 * Shows an institution's logo and related projects and collections.
 * @param {Object} props - Institution record with relationship IDs and localized fields.
 * @returns {React.ReactElement} Institution summary with Redux-backed project links.
 */
export function InstitutionTile({ data }) {
    const collections = useSelector(getCollections);
    const { t, locale } = useI18n();

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
                    return (
                        <li key={ip.id}>
                            <InstitutionProjectLink projectId={ip.project_id} />
                        </li>
                    );
                })}
            </ul>

            <h3>{t('activerecord.models.collection.other')}</h3>
            <ul>
                {collectionsForInstitute.map((collection) => {
                    if (!collection) return null;
                    return (
                        <li key={collection.id}>
                            <InstitutionProjectLink
                                projectId={collection.project_id}
                            >
                                {collection.name[locale]}
                            </InstitutionProjectLink>
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
