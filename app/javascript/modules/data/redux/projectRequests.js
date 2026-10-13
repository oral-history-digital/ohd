import { Loader } from 'modules/api';

// Remember running requests so another caller can wait for the same result.
// Keep stores separate: a request for one store must not supply data to another.
const projectRequestsByStore = new WeakMap();

/** Matches requests by URL, project, language, and signed-in account. */
function projectRequestKey(props, url, state) {
    const requestUrl = new URL(url, window.location.origin);
    requestUrl.searchParams.sort();
    return JSON.stringify([
        requestUrl.href,
        props.project.id ?? props.project.shortname,
        props.locale,
        Boolean(state.user?.isLoggedIn),
        state.user?.loggedInAt || null,
        state.data?.users?.current?.id ?? null,
    ]);
}

/**
 * Loads one project, sharing the request when another caller is already loading it.
 * Returns a promise with { response, error }. Failures are returned rather than thrown.
 */
export function fetchProject(props, url, id, extraParams, actions) {
    return (dispatch, getState) => {
        // Keep track of pending requests for this store
        let requests = projectRequestsByStore.get(getState);
        if (!requests) {
            requests = { pending: new Map(), nextId: 0 };
            projectRequestsByStore.set(getState, requests);
        }

        // In case of a race condition, return the same promise for duplicate requests.
        const key = projectRequestKey(props, url, getState());
        if (requests.pending.has(key)) return requests.pending.get(key);

        // Else, start a new request and return a promise that resolves when it finishes.
        const requestId = ++requests.nextId;
        let resolveRequest;
        const promise = new Promise((resolve) => {
            resolveRequest = resolve;
        });

        // Store the promise so another caller can wait for the same result.
        requests.pending.set(key, promise);

        // Dispatch to Redux to set loading state and track the request.
        dispatch({
            ...actions.requestData('projects', id, null, extraParams),
            projectRequest: { key, requestId, status: 'pending', error: null },
        });

        // Define a finish function to handle both success and failure,
        // cleaning up the pending request and resolving the promise.
        const finish = (action, result, status) => {
            requests.pending.delete(key);
            resolveRequest(result);
            return {
                ...action,
                projectRequest: { key, requestId, status, error: result.error },
            };
        };

        // Define a failure handler to dispatch an error action and resolve the promise.
        const fail = (error) => {
            const failure = {
                status: error.status || error.response?.status || null,
                message: error.message || 'Unable to load project.',
            };
            return finish(
                actions.receiveError('projects', id, failure),
                { response: null, error: failure },
                'failed'
            );
        };

        try {
            Loader.getJson(
                url,
                null,
                dispatch,
                (json) =>
                    finish(
                        actions.receiveData(json),
                        { response: json, error: null },
                        'succeeded'
                    ),
                fail
            );
        } catch (error) {
            dispatch(fail(error));
        }
        return promise;
    };
}
