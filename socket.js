var WS_PORT = require('./port').wsPort;
var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io');
 
var server = http.createServer(function(req, res) {
    
}).listen(WS_PORT, function() {
    console.log('Listening at:'+WS_PORT);
});
 var io=socketio.listen(server);
 function broadcast(msg){
 	 console.log('Message Received: ', msg);
  io.on('connection', function (socket) {
   
        //console.log('Message Received: ', msg);
        socket.emit('message', msg);

});
}
module.exports = {
  io: io
};
