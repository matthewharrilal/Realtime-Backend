var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket)  {
    console.log("User has connected!")

    socket.on('chat message', function(message) {
        console.log("Incoming Message " + message)
    })
});

http.listen(4000, function() {
    console.log("Listening on port 4000")
});