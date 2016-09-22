var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket){
	console.log("user connected via socket.io");

	socket.on('disconnect',function(){
		if(typeof clientInfo[socket.id] !== 'undefined'){
			var userData = clientInfo[socket.id];
			socket.leave(userData.room);
			io.to(userData.room).emit('message',{
				name: 'System',
				text: userData.name + " has left",
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function(req){
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message',{
			name: 'System',
			text: req.name + 'has Joined',
			timestamp: moment().valueOf()

		});
	});

	socket.on('message', function(message){
		console.log('Message received');
		console.log(message.text);
		message.timestamp = moment().valueOf();
		io.to(clientInfo[socket.id].room).emit('message', message); 
	});

	socket.emit('message',{
		name: 'System ',
		text: 'welcome to chat application',
		timestamp: moment().valueOf()
	});

});

http.listen(PORT, function(){
	console.log("server stated");
})