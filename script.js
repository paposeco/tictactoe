const gameboard = (function () {
  const currentBoard = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const pickBoardSquare = function (square, player) {
    const playerPiece = player.getPlayerPiece();
    const picked = currentBoard.findIndex((element) => element === square);
    currentBoard[picked] = playerPiece;
    return displayCurrentBoard.updateDisplay();
  };
  return { currentBoard, pickBoardSquare };
})();

const player = function (name, playerPiece) {
  const getName = () => name;
  const getPlayerPiece = () => playerPiece;
  return { getName, getPlayerPiece };
};

const displayCurrentBoard = (function () {
  const divs = document.querySelectorAll(".square p");
  const divsarray = Array.from(divs, (div) => div);
  const currentBoard = gameboard.currentBoard;
  const updateDisplay = function () {
    for (i = 0; i < divsarray.length; i++) {
      divsarray[i].textContent = currentBoard[i];
    }
  };
  updateDisplay();
  return { updateDisplay };
})();

// const makeplayer = (name, piece) => {
//   const newplayer = player(name, piece);
//   console.log(newplayer.getName() + "selected");
//   return { newplayer };
// };

// const makeplayerone = function () {
//   player1 = player("player1", "0");
//   console.log("player1 selected");
//   return player1;
// };

const makeplayer_ = function (name, piece, outarg) {
  tmp = player(name, piece);
  outarg.getName = tmp.getName;
  outarg.getPlayerPiece = tmp.getPlayerPiece;
};

// const makeplayer = function (name, piece) {
//   let playervariablename = name;
//   console.log(playervariablename);
//   playervariablename = player(name, piece);
//   console.log(playervariablename.getName() + "selected");
//   /* return newplayer; */
// };

const makeplayertwo = function () {
  const player2 = player("player2", "x");
  console.log("player2 selected");
  return player2;
};

const setupButtons = function () {
  const player1Button = document.getElementById("player1Div");
  const player2Button = document.getElementById("player2Div");
  let player1;
  player1Button.addEventListener("click", function () {
    makeplayer_("player1", "0", player1);
    console.log(player1.getName());
    console.log("clicked");
  });
  player2Button.addEventListener("click", makeplayertwo);
};

setupButtons();
