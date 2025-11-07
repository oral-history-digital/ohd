import request from 'superagent';
import noCache from 'superagent-no-cache';

const Loader = {
    getJson: function(url, queryParams, dispatch, callback) {
        request.get(url)
            .use(noCache)
            .set('Accept', 'application/json')
            .query(queryParams)
            .end( (error, res) => {
                if (error) {
                    console.log("loading json from " + url + " failed: " + error);
                    console.log("original error: " + error.original);
                    if (typeof callback === 'function') {
                        dispatch(callback(error));
                    }
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

    delete: function(url, dispatch, callback, cb) {
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
                            //dispatch(callback(JSON.parse(res.text)));
                            dispatch(callback());
                        }
                        if (typeof cb === 'function') {
                            cb(JSON.parse(res.text));
                        }
                    }
                }
            });
    },

    put: function(url, params, dispatch, successCallback, errorCallback, callback) {
        let req = request.put(url);
        Loader.submit(req, url, params, dispatch, successCallback, errorCallback, callback);
    },

    post: function(url, params, dispatch, successCallback, errorCallback, callback) {
        let req = request.post(url);
        Loader.submit(req, url, params, dispatch, successCallback, errorCallback, callback);
    },

    submit: function(req, url, params, dispatch, successCallback, errorCallback, cb) {
        let scope = Object.keys(params)[0];
        Object.keys(params[scope]).map((param, index) => {
            if (params[scope][param] !== undefined && params[scope][param] !== null) {
                if ((params[scope][param]) instanceof File) {
                    // like this it is possible to upload one file through a file-input called data.
                    // you need more file-inputs? change the implementation here!
                    req.attach(`${scope}[${param}]`, params[scope][param]);
                } else {
                    if (Array.isArray(params[scope][param])) {
                        // value is an array
                        params[scope][param].map((elem, elemIndex) => {
                            if (typeof(elem) === 'object') {
                                // array elements are hashes/ objects
                                Object.keys(elem).map((e) => {
                                    //
                                    // second layer nested e.g. registry_entry[registry_names[registry_name_translations]]
                                    //
                                    // Parameters: {"registry_entry"=>{"workflow_state"=>"public",
                                    // "registry_names_attributes"=>[{"registry_entry_id"=>"28205",
                                    // "translations_attributes"=>[{"locale"=>"de", "id"=>"", "descriptor"=>"sdfsdfsdf"}],
                                    // "name_position"=>"3", "registry_name_type_id"=>"4"}]}, "locale"=>"de", "id"=>"28205"}
                                    //
                                    if (Array.isArray(elem[e])) {
                                        elem[e].map((i, index) => {
                                            Object.keys(i).map((j) => {
                                                if (i[j] && i[j] !== '')
                                                    req.field(`${scope}[${param}][${elemIndex}][${e}][${index}][${j}]`, i[j]);
                                            })
                                        })
                                    } else {
                                        req.field(`${scope}[${param}][${elemIndex}][${e}]`, elem[e] || '');
                                    }
                                })
                            } else {
                                // array values are some non-complex values like strings or ints
                                req.field(`${scope}[${param}][]`, elem);
                            }
                        })
                    } else if (typeof(params[scope][param]) === 'object') {
                        // value is a hash/ object
                        req.field(`${scope}[${param}]`, JSON.stringify(params[scope][param]));
                    } else {
                        // normal value
                        req.field(`${scope}[${param}]`, params[scope][param]);
                    }
                }
            } else {
                // clean params from undefined values
                delete params[scope][param];
            }
        })
        req.set('Accept', 'application/json')
        req.end( (error, res) => {
            if (error) {
                console.log("loading json from " + url + " failed: " + error);
                console.log("original error: " + error.original);
                console.log("url: " + url);
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
                        dispatch(successCallback(json));
                    }
                    if (typeof cb === 'function') {
                        cb(json);
                    }
                }
            }
        });
    },

};

export default Loader;
