export const CALL_API = 'CALL_API';

const apiMiddleware = store => next => async action => {
    const callApi = action[CALL_API];

    if (typeof callApi === 'undefined') {
        return next(action);
    }

    const [requestStartedType, successType, failureType] = callApi.types;
    const method = callApi.method || 'GET';

    next({ type: requestStartedType });

    try {
        const body = await fetch(callApi.endpoint, {
            method,
            headers: {
                'Accept': 'application/json',
            },
        }).then(res => res.json());

        next({
            type: successType,
            payload: body,
        });
    } catch(err) {
        next({
            type: failureType,
            error: err.message,
        });
    }
};

export default apiMiddleware;
