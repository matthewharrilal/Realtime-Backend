var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http)

app.get('/', (req, res) => {
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
        socket.join(roomName)
    });

    socket.on("joinRoom", function(roomName) { // Just to highlight separation of concerns
        socket.join(roomName)
    });


    socket.on('disconnect', function() {
        console.log("User has disconnected!")
    });
});

http.listen(4000, function() {
    console.log("Listening on port 4000")
});