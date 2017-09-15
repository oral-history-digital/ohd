import request from 'superagent';

//if (typeof Loader == "undefined") {
  var Loader = {
    getJson: function(url, queryParams, callback) {
    //function getJson(url, callback) {
      request.get(url)
        .set('Accept', 'application/json')
        .query(queryParams)
        .end( (error, res) => {
          if (res) {
            if (res.error) {
              console.log("loading json from " + url + " failed: " + error);
            } else {
              if (typeof callback === "function") {
                callback(JSON.parse(res.text));
              }
            }
          }
        });
    }
  };
//};

export default Loader;


