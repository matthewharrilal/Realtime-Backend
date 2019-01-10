var server = require("express")();
var http = require("http").Server(server);
var io = require("socket.io")(http)

server.get('/', (req, res) => {
    res.send('Hello World')
});

 io.on('connection', function(socket)  {
    console.log("User has connected!")

    socket.on('chat message', function(message) {
        console.log("SOCKET ID " + socket.id)
        console.log("Incoming Message " + message)
        // io.emit('chat message', messasge) // Emits or broadcasts chat message to other users connected
    });

    socket.on("createRoom", function(roomName){ // Just to highlight separation of concerns
        console.log("CREATING ROOM " + roomName)
        console.log("ALL ROOMS " + JSON.stringify(io.sockets.adapter.rooms)) // YOU CAN GIVE THE SPECIFIC SOCKET A NICKNAME
        // AND THEN YOU CAN IDENTIFY THEM VIA THE NICKNAME
        socket.join(roomName)
    });

    socket.on("joinRoom", function(roomName) { // Just to highlight separation of concerns
        socket.join(roomName)
    });


    socket.on('disconnect', function() {
        console.log("User has disconnected!") // No special teardown needed on our part
    });
});

http.listen(4000, function() {
    console.log("Listening on port 4000")
});