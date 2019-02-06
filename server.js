var server = require("express")();
var http = require("http").Server(server);
var io = require("socket.io")(http)
var JSON = require("circular-json")
var localStorage = require("localStorage");


server.get('/', (req, res) => {
    res.send('Hello World')
});

io.on('connection', function (socket) {
    console.log("User has connected!")
    // console.log("ROOMS WHEN SOCKET CONNECTS " + JSON.stringify(io.sockets.adapter.sids[socket.id])) //Nothing becuase the socket id is issues a new id for the socket connection that occurs when reconnecting (maybe there is something there )

    socket.on('chat message', function (message, roomName) {
        console.log("SOCKET ID " + socket.username + " " + socket.id)
        console.log("Incoming Message " + message)
        console.log("Outgoing Message " + message + " Room name" + roomName)
        socket.broadcast.to(roomName).emit('chat message', message) // Emits or broadcasts chat message to other users connected
    });


    socket.on("socketUsername", function (username) {

        // socket.id = username
        socket.nickname = username // Essentially useless because  does not persist as that socket connections nickname

        if (localStorage.getItem(username)) {
            console.log("THERE HAS BEEN A USERNAME COLLISION")
            socket.emit("usernameCollision", username)
        } else {
            localStorage.setItem(username, socket.id) // saving the item in local storage

            console.log("SOCKET USERNAME " + username)
        }

        console.log("Username after setting in local storage " + localStorage.getItem(username))
    })

    socket.on("createRoom", function (roomName) { // Just to highlight separation of concerns
        console.log("CREATING ROOM " + roomName)
        console.log("All Room Connections " + socket.nickname, " ", io.sockets.adapter.sids[socket.id])
        socket.join(roomName)
    });

    socket.on("joinRoom", function (roomName) { // Just to highlight separation of concerns
        console.log(" " + socket.id + " has joined the room " + roomName)
        // console.log("All Room Connections " + socket.nickname, " ", io.)
        socket.join(roomName)
        socket_id_map = {} // Mapping client ids to the nickname of the socket

        io.of("/").in(roomName).clients((error, clients) => {
            if (error) {
                console.log(error)
            }

            // console.log("Connected clients " + clients)
            for (i = 0; i < clients.length; i++) {
                client = clients[i]
                console.log("CLIENT " + client)
            }
        })
        // console.log("All Room Connections " + socket.nickname, " ", io.sockets.adapter.sids[socket.id])

    });

    socket.on("leaveRoom", function (roomName) {
        console.log("LEAVING ROOM " + roomName)
        socket.leave(roomName);
    });



    socket.on('disconnect', function () {
        console.log("User has disconnected!") // No special teardown needed on our part
        // localStorage.removeItem()

        username = getKeyByValue(localStorage, socket.id);

        localStorage.removeItem(username)
        console.log(localStorage)

    });

});

function archiveRoom() {
    // Archive Room when number of users turn to 0 ????? NEED MORE RESEARCH
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}


http.listen(4000, function () {
    console.log("Listening on port 4000")
});