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
          if (res) {
            if (res.error) {
              console.log("loading json from " + url + " failed: " + error);
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
          if (res) {
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
      request.put(url)
        .send(params)
        .set('Accept', 'application/json')
        .end( (error, res) => {
          if (res) {
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

    post: function(url, params, dispatch, successCallback, errorCallback) {
      request.post(url)
        .send(params)
        .set('Accept', 'application/json')
        .end( (error, res) => {
          if (res) {
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
    }
  };
//};

export default Loader;


