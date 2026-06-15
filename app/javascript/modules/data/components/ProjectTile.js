import { useI18n } from 'modules/i18n';
import { LinkOrA } from 'modules/routes';
import { SmartImage } from 'modules/ui';
import { localizedValue } from 'modules/utils';
import PropTypes from 'prop-types';

export function ProjectTile({ data }) {
    const { locale } = useI18n();

    const localizedText = (value) => {
        return localizedValue(value, locale, { emptyValue: '' });
    };

    const asArray = (value) => {
        if (!value) {
            return [];
        }

        if (Array.isArray(value)) {
            return value;
        }

        if (typeof value === 'object') {
            return Object.values(value);
        }

        return [];
    };

    const logo =
        data.logo ||
        asArray(data.logos).find((item) => item?.src || item?.url) ||
        null;

    const projectName =
        localizedText(data.display_name) ||
        localizedText(data.name) ||
        localizedText(data.shortname);
    const institutionText = asArray(data.institutions)
        .map((institution) => localizedText(institution?.name))
        .filter(Boolean)
        .join(' / ');

    return (
        <LinkOrA className="ProjectTile" project={data} to="">
            <SmartImage
                className="ProjectTile-image logo-img"
                src={logo?.src || logo?.url}
                alt="Logo"
            />
            <div className="ProjectTile-body">
                <p className="ProjectTile-text">{projectName}</p>
                <p className="ProjectTile-text ProjectTile-text--small">
                    {institutionText}
                </p>
            </div>
        </LinkOrA>
    );
}

ProjectTile.propTypes = {
    data: PropTypes.object.isRequired,
};

export default ProjectTile;
