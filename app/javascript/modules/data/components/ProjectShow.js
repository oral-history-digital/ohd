import { LinkOrA } from 'modules/routes';
import PropTypes from 'prop-types';

/**
 * Links to a project using its localized display data.
 *
 * @param {Object} props - Display properties.
 * @param {Object} props.data - Project with a localized name and optional logo.
 * @param {boolean} [props.hideLogo] - Omit the logo.
 * @param {React.ReactNode} [props.children] - Access status and related account details.
 * @returns {React.ReactElement} Project link and additional content.
 */
export function ProjectShow({ data, hideLogo, children }) {
    return (
        <>
            <LinkOrA project={data} to="">
                {!hideLogo && (
                    <img
                        className="logo-img"
                        src={data.logo?.url}
                        alt="project logo"
                    />
                )}
                {data.name}
            </LinkOrA>
            {children}
        </>
    );
}

ProjectShow.propTypes = {
    data: PropTypes.object.isRequired,
    hideLogo: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default ProjectShow;
