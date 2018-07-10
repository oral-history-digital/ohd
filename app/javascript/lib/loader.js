import request from 'superagent';
import noCache from 'superagent-no-cache';

//if (typeof Loader == "undefined") {
var Loader = {
    getJson: function(url, queryParams, dispatch, callback) {
        request.get(url)
            .use(noCache)
            .set('Accept', 'application/json')
            .query(queryParams)
            .end( (error, res) => {
                if (error) {
                    console.log("loading json from " + url + " failed: " + error);
                    console.log("original error: " + error.original);
                    dispatch(callback(error));
                } else if (res) {
                    if (res.error) {
                        console.log("loading json from " + url + " failed: " + res.error);
                    } else {
                        if (typeof callback === "function") {
                            dispatch(callback(JSON.parse(res.text)));
                        }
                    }
                }
            });
    },

    delete: function(url, dispatch, callback) {
        request.delete(url)
            .set('Accept', 'application/json')
            .end( (error, res) => {
                if (error) {
                    console.log("loading json from " + url + " failed: " + error);
                    console.log("original error: " + error.original);
                    dispatch(callback(error));
                } else if (res) {
                    if (res.error) {
                        console.log("deleting from " + url + " failed: " + error);
                    } else {
                        if (typeof callback === "function") {
                            dispatch(callback(JSON.parse(res.text)));
                        }
                    }
                }
            });
    },

    put: function(url, params, dispatch, successCallback, errorCallback) {
        let req = request.put(url);
        Loader.submit(req, params, dispatch, successCallback, errorCallback);
    },

    post: function(url, params, dispatch, successCallback, errorCallback) {
        let req = request.post(url);
        Loader.submit(req, params, dispatch, successCallback, errorCallback);
    },

    submit: function(req, params, dispatch, successCallback, errorCallback) {
        let scope = Object.keys(params)[0];
        Object.keys(params[scope]).map((param, index) => {
            if (param === 'data') {
                // like this it is possible to upload one file through a file-input called data.
                // you need more file-inputs? change the implementation here!
                req.attach(`${scope}[${param}]`, params[scope][param]);
            } else {
                req.field(`${scope}[${param}]`, 
                    typeof(params[scope][param]) === 'object' ? JSON.stringify(params[scope][param]) : params[scope][param]
                );
            }
        })
        req.set('Accept', 'application/json')
        req.end( (error, res) => {
            if (error) {
                console.log("loading json from " + url + " failed: " + error);
                console.log("original error: " + error.original);
                dispatch(errorCallback(error));
            } else if (res) {
                let json = JSON.parse(res.text);
                if (res.error) {
                    if (typeof errorCallback === "function") {
                        dispatch(errorCallback(json));
                    } else {
                        console.log("loading json from " + url + " failed: " + error);
                    }
                } else if (json.error) {
                    if (typeof errorCallback === "function") {
                        dispatch(errorCallback(json));
                    } 
                } else {
                    if (typeof successCallback === "function") {
                        dispatch(successCallback(JSON.parse(res.text)));
                    }
                }
            }
        });
    },

};
//};

export default Loader;


