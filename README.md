# Chess Game

A real-time multiplayer chess game built using **Node.js**, **Socket.io**, and **Chess.js**. Players can connect, play as white or black, and spectators can watch the game live.

## Features
- 🎮 **Multiplayer Gameplay**: Two players can join as white and black.
- 👀 **Spectator Mode**: Additional users can join as spectators.
- ⚡ **Real-time Updates**: Moves are updated live using WebSockets.
- 📜 **Move History**: Tracks and displays all moves played in the game.
- 🔄 **Turn Indicator**: Displays whose turn it is.
- 🏆 **Check & Checkmate Detection**: Chess.js handles game rules.

---

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript, Tailwind CSS
- **Backend:** Node.js, Express.js, Socket.io
- **Game Logic:** Chess.js

---

## Installation & Setup

### Prerequisites
Make sure you have **Node.js** installed on your system.

### Clone the Repository
```sh
git clone https://github.com/your-username/chess-game.git
cd chess-game
```

### Install Dependencies
```sh
npm install
```

### Run the Server
```sh
node app.js
```

The server will start on **http://localhost:3000**

---

## How to Play
1. Open **http://localhost:3000** in your browser.
2. The first player to join gets **White**, the second gets **Black**.
3. Additional users will join as **Spectators**.
4. Players make moves by dragging and dropping pieces.
5. The game follows standard **chess rules**.
6. The game ends when a player is checkmated.

---

## Folder Structure
```
chess-game/
│── public/              # Static files (CSS, JS, images)
│── views/               # EJS templates for rendering UI
│── app.js               # Server and game logic
│── package.json         # Dependencies and scripts
│── README.md            # Project documentation
```

---

## Future Improvements
- 🏁 **Game Restart Feature**
- ⏳ **Chess Timer (Clock)**
- 💬 **In-game Chat for Players & Spectators**
- 📱 **Mobile Responsive UI**
- 🌎 **Online Multiplayer with Room System**

---

## Contributing
Pull requests are welcome! If you'd like to contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Make your changes
4. Commit and push (`git commit -m "Added new feature" && git push origin feature-name`)
5. Open a pull request 🚀

---

## Contact
📧 **Your Email**: ilahitasmiya@gmail.com  
🐙 **GitHub**: [Tasmii](https://github.com/Tasmii)

