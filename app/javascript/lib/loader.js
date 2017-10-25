import request from 'superagent';

//if (typeof Loader == "undefined") {
  var Loader = {
    getJson: function(url, queryParams, dispatch, callback) {
      request.get(url)
        .set('Accept', 'application/json')
        .query(queryParams)
        .end( (error, res) => {
          if (res) {
            if (res.error) {
              console.log("loading json from " + url + " failed: " + error);
            } else {
              if (typeof callback === "function") {
                console.log(JSON.parse(res.text));
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

    put: function(url, params, dispatch, callback) {
      request.put(url)
        .send(params)
        .set('Accept', 'application/json')
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

    post: function(url, params, dispatch, callback) {
      request.post(url)
        .send(params)
        .set('Accept', 'application/json')
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
    }
  };
//};

export default Loader;


