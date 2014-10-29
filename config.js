var usergrid = require('usergrid');

var ug = new usergrid.client({
  orgName: 'dobson',
  appName: 'sandbox'
});

var config = {
  organization: 'dobson',
  uri: 'http://dobson-test.apigee.net/apigee-remote-proxy',
  user: process.env.APIGEE_USER,
  password: process.env.APIGEE_PASSWORD,
  key: process.env.CONSUMER_KEY,
  secret: process.env.CONSUMER_SECRET,
  validGrantTypes: [ 'client_credentials', 'authorization_code', 'implicit_grant', 'password' ],
  passwordCheck: checkPassword
};

function checkPassword(username, password, cb){
  ug.login(username, password, function(err, data, user) {
    if(err) {
      cb(err);
    } else {
      cb(null, true);
    }
  });
}

var Management = require('volos-management-apigee');
var management = Management.create(config);

var OAuth = require('volos-oauth-apigee');
var oauth = OAuth.create(config);

module.exports = {
  managment: management,
  oauth: oauth,
  config: config,
  localPort: 1337
};


