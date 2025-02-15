const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const historyList = document.getElementById("history-list");
const historyContainer = document.querySelector(".history-container");

// Ensure move history auto-scrolls on updates
const observer = new MutationObserver(() => {
  historyContainer.scrollTop = historyContainer.scrollHeight;
});

// Observe changes in the move history list
observer.observe(historyList, { childList: true });

const updateMoveHistory = (move) => {
    const piece = chess.get(move.to) || chess.get(move.from); // Get moved piece
    if (!piece) return; // If no piece is found, return
  
    const pieceSymbol = getPieceUnicode(piece); // Get Unicode symbol
    const pieceColor = piece.color === "w" ? "White" : "Black"; // Determine color
  
    const moveText = `${pieceColor} ${pieceSymbol} ${move.from} → ${move.to}`;
    const listItem = document.createElement("li");
    listItem.textContent = moveText;
    historyList.appendChild(listItem);
  };
  

const turnIndicator = document.getElementById("turnIndicator");
const updateTurnIndicator = () => {
  const turn = chess.turn() === "w" ? "White" : "Black";
  turnIndicator.innerText = `${turn}'s Turn`;
};

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";
  board.forEach((row, rowindex) => {
    row.forEach((square, squareindex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
      );
      squareElement.dataset.row = rowindex;
      squareElement.dataset.col = squareindex;
      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );
        pieceElement.innerText = getPieceUnicode(square);
        pieceElement.draggable = playerRole === square.color;
        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowindex, col: squareindex };
            e.dataTransfer.setData("text/plain", "");
          }
        });
        pieceElement.addEventListener("dragend", (e) => {
          draggedPiece = null;
          sourceSquare = null;
        });
        squareElement.appendChild(pieceElement);
      }

      squareElement.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      squareElement.addEventListener("drop", function (e) {
        e.preventDefault();
        if (draggedPiece) {
          const targetSource = {
            row: parseInt(squareElement.dataset.row),
            col: parseInt(squareElement.dataset.col),
          };
          handleMove(sourceSquare, targetSource);
        }
      });
      boardElement.appendChild(squareElement);
    });
  });

  updateTurnIndicator();

  if (playerRole === "b") {
    boardElement.classList.add("flipped");
  } else {
    boardElement.classList.remove("flipped");
  }
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q",
  };

  socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
  const unicodePieces = {
    p: "♙",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
    P: "♙",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
  };
  return unicodePieces[piece.type] || "";
};

socket.on("moveHistory", function (history) {
  historyList.innerHTML = ""; // Clear previous history
  history.forEach((move) => updateMoveHistory(move));
});

socket.on("playerRole", function (role) {
  playerRole = role;
  renderBoard();
});

socket.on("spectatorRole", function () {
  playerRole = null;
  renderBoard();
});

socket.on("boardState", function (fen) {
  chess.load(fen);
  renderBoard();
});

socket.on("move", function (move) {
  chess.load(move);
  renderBoard();
  updateMoveHistory(move);
});

socket.on("turnUpdate", function (turn) {
  turnIndicator.innerText = (turn === "w" ? "White" : "Black") + "'s Turn";
});

const messageBox = document.createElement("div");
messageBox.style.position = "absolute";
messageBox.style.top = "10px";
messageBox.style.left = "50%";
messageBox.style.transform = "translateX(-50%)";
messageBox.style.backgroundColor = "red";
messageBox.style.color = "white";
messageBox.style.padding = "10px";
messageBox.style.borderRadius = "5px";
messageBox.style.display = "none"; // Initially hidden
document.body.appendChild(messageBox);

socket.on("invalidMove", function (data) {
  messageBox.innerText = data.message;
  messageBox.style.display = "block";
  setTimeout(() => {
    messageBox.style.display = "none";
  }, 2000); // Hide after 2 seconds
});

renderBoard();
