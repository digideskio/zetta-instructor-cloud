var zetta = require('zetta');
var async = require('async');
var OAuthExtension = require('zetta-volos-oauth');
var config = require('./config');

zetta()
  .name('query.cloud')
  .use(OAuthExtension(config))
  .use(function(server) {
    var mattsSecurityQuery = server.from('matt.dobson').where({ type: 'security-system' });
    var detroitHubQuery = server.from('Detroit').where({ type: 'huehub' });

    server.observe([mattsSecurityQuery, detroitHubQuery], function(securitySystem, detroitHub) {
      var blinkAndWait = function(callback) {
        detroitHub.call('blink', function(err) {
          callback(err);
        });
      };
      securitySystem.on('alarm', function() {
        async.times(3, function(n, next) {
          blinkAndWait(next);
        }, function(err) {
          if(err) {
            console.log('Error blinking:' + err);
          }
        });
      });
    });

  })
  .listen(process.env.PORT || 3000);

