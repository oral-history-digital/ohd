import { useProjectIdentity } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';

import { Fetch } from './Fetch';

/**
 * Loads a complete project-owned resource list through the existing Redux request flow.
 * Waits for project identity and keeps children hidden until that project's list is ready.
 *
 * @param {Object} props - Resource list and its consumers.
 * @param {string} props.resource - Resource endpoint name, such as contribution_types.
 * @param {React.ReactNode} [props.children] - Consumers requiring the complete list.
 * @returns {React.ReactNode} Resource consumers or a loading indicator.
 */
export function FetchProjectResource({ resource, children }) {
    const { projectDbId } = useProjectIdentity();
    if (!projectDbId) return <Spinner />;

    return (
        <Fetch
            fetchParams={[resource, null, null, `for_projects=${projectDbId}`]}
            testDataType={resource}
            testIdOrDesc={`for_projects_${projectDbId}`}
        >
            {children}
        </Fetch>
    );
}

FetchProjectResource.propTypes = {
    resource: PropTypes.string.isRequired,
    children: PropTypes.node,
};
