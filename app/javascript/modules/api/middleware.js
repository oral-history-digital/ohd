import request from 'superagent';

export const CALL_API = 'CALL_API';

const apiMiddleware = store => next => async action => {
    const callApi = action[CALL_API];

    if (typeof callApi === 'undefined') {
        return next(action);
    }

    const [requestStartedType, successType, failureType] = callApi.types;

    next({ type: requestStartedType });

    try {
        const res = await request.get(callApi.endpoint)
            .set('Accept', 'application/json');

        next({
            type: successType,
            payload: res.body,
        });
    } catch(err) {
        next({
            type: failureType,
            error: err.message,
        });
    }
};

export default apiMiddleware;
