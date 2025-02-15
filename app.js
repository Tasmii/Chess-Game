const express = require("express");
const socket = require("socket.io");
const http = require("http");
const path = require("path");
const {Chess} = require("chess.js");
const { title } = require("process");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "w";
let moveHistory = [];

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req, res)=>{
    res.render("index", {title:"Chess Game"});
})
io.on("connection", function(socket){
    console.log("connected");
    if (!players.white){
        players.white=socket.id;
        socket.emit("playerRole", "w");
    }
    else if(!players.black){
        players.black=socket.id;
        socket.emit("playerRole", "b");
    }
    else{
        socket.emit("spectatorRole");
    }
    socket.emit("moveHistory", moveHistory);
    socket.on("disconnect", function(){
        if (socket.id === players.white){
            delete players.white;
        }
        else if (socket.id === players.black){
            delete players.black;
        }
    });
    socket.on("move", (move) => {
        try {
            if (chess.turn() === "w" && socket.id !== players.white) return;
            if (chess.turn() === "b" && socket.id !== players.black) return;
            
            const result = chess.move(move);
            if (result) {
                currentPlayer = chess.turn();
                moveHistory.push(move);
                io.emit("move", move);
                io.emit("boardState", chess.fen());
                io.emit("turnUpdate", currentPlayer);
                io.emit("moveHistory", moveHistory);
            } else {
                console.log("Invalid move:", move);
                socket.emit("invalidMove", { message: "Invalid move! Please try again." });
            }
        } catch (err) {
            console.log("Error:", err);
            socket.emit("invalidMove", { message: "Invalid move! Please try again." });
        }
    });
});
server.listen(3000, function(){
    console.log("server is listening");
});