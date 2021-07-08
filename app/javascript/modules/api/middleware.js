import request from 'superagent';
import memoize from 'memoizee';

export const CALL_API = 'CALL_API';

const memoizeOptions = {
    promise: true,
    maxAge: 60 * 60 * 1000,  // 1 hour
    max: 1000,  // 1000 results are approx. 10MB max
};

const fetch = memoize(url => {
    return request.get(url).set('Accept', 'application/json')
        .then(res => res.body);
}, memoizeOptions);

const apiMiddleware = store => next => async action => {
    const callApi = action[CALL_API];

    if (typeof callApi === 'undefined') {
        return next(action);
    }

    const [requestStartedType, successType, failureType] = callApi.types;

    next({ type: requestStartedType });

    try {
        const payload = await fetch(callApi.endpoint);

        next({
            type: successType,
            payload,
        });
    } catch(err) {
        next({
            type: failureType,
            error: err.message,
        });
    }
};

export default apiMiddleware;
