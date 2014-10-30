var zetta = require('zetta');
var async = require('async');
//var OAuthExtension = require('zetta-volos-oauth');
//var config = require('./config');

zetta()
  .name('query.cloud')
//  .use(OAuthExtension(config))
  .use(function(server) {
    
    var mattsSecurityQuery = server.from('matt.dobson').where({ type: 'security-system' });
    var detroitScreenQuery = server.from('Detroit').where({ type: 'display' });

    server.observe([mattsSecurityQuery, detroitScreenQuery], function(securitySystem, detroitScreen) {
      server.log('Queries fulfilled.');
      var blinkAndWait = function(callback) {
        detroitScreen.call('change', 'Alert! Intruder at home!', function(err) {
          callback(err);
        });
      };
      securitySystem.on('start-alarm', function() {
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

