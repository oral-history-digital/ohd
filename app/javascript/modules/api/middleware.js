export const CALL_API = 'CALL_API';

const apiMiddleware = (store) => (next) => async (action) => {
    const callApi = action[CALL_API];

    if (typeof callApi === 'undefined') {
        return next(action);
    }

    const [requestStartedType, successType, failureType] = callApi.types;
    const method = callApi.method || 'GET';
    const requestBody = JSON.stringify(callApi.body);

    next({ type: requestStartedType });

    try {
        const responseBody = await fetch(callApi.endpoint, {
            method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: requestBody,
        }).then((res) => res.json());

        next({
            type: successType,
            payload: responseBody,
        });
    } catch (err) {
        next({
            type: failureType,
            error: err.message,
        });
    }
};

export default apiMiddleware;
