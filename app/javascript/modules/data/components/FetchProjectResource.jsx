import { useEffect } from 'react';

import { useI18n } from 'modules/i18n';
import { usePathBase, useProjectIdentity } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
    fetchV2Data,
    v2AccessContext,
    v2RequestKey,
} from '../redux/v2Requests';

/**
 * Loads a complete project-owned resource list and waits before rendering its consumers.
 * Uses the shared project request flow to discard obsolete responses and refetch
 * after account changes or mutations. Records retain their existing nested storage.
 *
 * @param {Object} props - Resource list and its consumers.
 * @param {string} props.resource - Resource endpoint name, such as contribution_types.
 * @param {React.ReactNode} [props.children] - Consumers requiring the complete list.
 * @returns {React.ReactNode} Resource consumers, a loading indicator, or an error.
 */
export function FetchProjectResource({ resource, children }) {
    const { projectDbId } = useProjectIdentity();
    const pathBase = usePathBase();
    const { locale, t } = useI18n();
    const dispatch = useDispatch();
    const context = useSelector(v2AccessContext);
    const generation = useSelector(
        (state) => state.data.v2?.projects?.generation || 0
    );
    const url = `${pathBase}/${resource}.json?for_projects=${projectDbId}`;
    const key = v2RequestKey(url, context, generation);
    const request = useSelector((state) =>
        state.data.v2?.projects?.context === context
            ? state.data.v2.projects.requests[key]
            : undefined
    );
    useEffect(() => {
        if (projectDbId && !request?.status)
            dispatch(
                fetchV2Data('projects', url, {
                    locale,
                    projectResource: resource,
                    projectId: projectDbId,
                })
            );
    }, [
        dispatch,
        projectDbId,
        url,
        locale,
        resource,
        request?.status,
        context,
        generation,
    ]);

    if (request?.error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={request.error.message}
                isClosable={false}
            />
        );
    if (!projectDbId || request?.status !== 'succeeded') return <Spinner />;
    return children;
}

FetchProjectResource.propTypes = {
    resource: PropTypes.string.isRequired,
    children: PropTypes.node,
};
