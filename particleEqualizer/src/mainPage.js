SC.initialize({
  client_id: '1c78c29753054d2e9af8926dd4a77db3',
  redirect_uri: 'https://avseoul.github.io/particleEqualizer/src/callback'
});

// initiate auth popup
SC.connect().then(function() {
  return SC.get('/me');
}).then(function(me) {
  alert('Hello, ' + me.username);
});
