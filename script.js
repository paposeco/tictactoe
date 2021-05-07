const playeridentities = (function () {
  const inputSubmit = document.getElementById("submitinput");
  const firstplayerNameInput = document.getElementById("firstplayer");
  const otherplayerNameInput = document.getElementById("otherplayer");
  let firstplayerName;
  let otherplayerName;
  inputSubmit.addEventListener("click", function (event) {
    event.preventDefault();
    firstplayerName = firstplayerNameInput.value;
    otherplayerName = otherplayerNameInput.value;
    const starttext = document.getElementById("gameReady");
    starttext.classList.remove("hide");
    gameboardAIfirstplayer.restartgame();
  });
  const selectedNames = function () {
    return [firstplayerName, otherplayerName];
  };
  return { selectedNames };
})();

const player = function (name, playerPiece) {
  const getName = () => name;
  const getPlayerPiece = () => playerPiece;
  return { getName, getPlayerPiece };
};

const getPlayers = (function () {
  const formAI = document.getElementById("playersinfoAI");
  let output = [];
  let firstplayerName;
  let otherplayerName;
  formAI.addEventListener("submit", function (e) {
    e.preventDefault();
    let data = new FormData(formAI);
    for (const entry of data) {
      output.push(entry[1]);
    }
    if (output[0] === "firstplayer") {
      firstplayerName = window.prompt("Name of Firstplayer:");
    } else {
      firstplayerName = output[0];
    }
    if (output[1] === "secondplayer") {
      otherplayerName = window.prompt("Name of Secondplayer:");
    } else {
      otherplayerName = output[1];
    }
    if (firstplayerName === "firstplayerAI") {
      setTimeout(
        firstplayerAIfunc.bind(
          null,
          undefined,
          undefined,
          gameboardAIfirstplayer.currentBoard
        ),
        500
      );
    }
  });
  const selectedNames = function () {
    return [firstplayerName, otherplayerName];
  };
  return { selectedNames };
})();

const gameboardAIfirstplayer = (function () {
  let currentBoard = [
    { 0: " " },
    { 1: " " },
    { 2: " " },
    { 3: " " },
    { 4: " " },
    { 5: " " },
    { 6: " " },
    { 7: " " },
    { 8: " " },
  ];
  let players = getPlayers.selectedNames();
  const firstplayer = player("firstplayer", "x");
  const otherplayer = player("otherplayer", "0"); // acho que isto nao esta a ser guardado porque a funcao esta a correr logo no inicio, em vez de ser depois do submit. tenho de ver como se fazia anteshmmm
  // console.log(otherplayer);
  let currentplayer = otherplayer; // otherplayer plays next
  const restartgame = function () {
    currentBoard = [
      { 0: " " },
      { 1: " " },
      { 2: " " },
      { 3: " " },
      { 4: " " },
      { 5: " " },
      { 6: " " },
      { 7: " " },
      { 8: " " },
    ];
    displayCurrentBoard.updateDisplay(undefined, undefined, currentBoard);
  };
  //console.log(currentBoard);
  const switchPlayers = function (firstplayer, otherplayer, currentPlayer) {
    if (currentPlayer === firstplayer) {
      return otherplayer;
    } else {
      return firstplayer;
    }
  };
  const pickBoardSquare = function (square) {
    console.log("selected square: " + square);
    const playerPiece = currentplayer.getPlayerPiece();
    const picked = currentBoard.findIndex(
      (element) => Object.getOwnPropertyNames(element)[0] === square
    );
    currentBoard[picked][picked] = playerPiece;
    const winner = checkForWinner(square, currentBoard, "0", otherplayer);
    const tie = checkForTie(currentBoard);
    //currentplayer = switchPlayers(firstplayer, otherplayer, currentplayer); nao é preciso neste caso
    displayCurrentBoard.updateDisplay(winner, tie, currentBoard);
    // console.log(currentBoard);
    //firstplayerAIfunc(currentBoard);
    setTimeout(firstplayerAIfunc.bind(null, winner, tie, currentBoard), 1000);
  };

  return { currentBoard, pickBoardSquare, restartgame };
})();

// const gameboard = (function () {
//   let currentBoard = [
//     { 0: " " },
//     { 1: " " },
//     { 2: " " },
//     { 3: " " },
//     { 4: " " },
//     { 5: " " },
//     { 6: " " },
//     { 7: " " },
//     { 8: " " },
//   ];
//   let players = getPlayers.selectedNames();
//   const firstplayer = player(players[0], "x");
//   const otherplayer = player(players[1], "0");
//   let currentplayer = firstplayer;
//   const restartgame = function () {
//     currentBoard = [
//       { 0: " " },
//       { 1: " " },
//       { 2: " " },
//       { 3: " " },
//       { 4: " " },
//       { 5: " " },
//       { 6: " " },
//       { 7: " " },
//       { 8: " " },
//     ];
//     //console.log("restarted");
//     displayCurrentBoard.updateDisplay(undefined, undefined, currentBoard);
//   };
//   //console.log(currentBoard);
//   const switchPlayers = function (firstplayer, otherplayer, currentPlayer) {
//     if (currentPlayer === firstplayer) {
//       return otherplayer;
//     } else {
//       return firstplayer;
//     }
//   };
//   const pickBoardSquare = function (square) {
//     const playerPiece = currentplayer.getPlayerPiece();
//     const picked = currentBoard.findIndex(
//       (element) => Object.getOwnPropertyNames(element)[0] === square
//     );
//     currentBoard[picked][picked] = playerPiece;
//     const winner = checkForWinner(
//       square,
//       currentBoard,
//       playerPiece,
//       currentplayer
//     );
//     const tie = checkForTie(currentBoard);
//     currentplayer = switchPlayers(firstplayer, otherplayer, currentplayer);
//     return displayCurrentBoard.updateDisplay(winner, tie, currentBoard);
//   };
//   console.log(currentBoard);
//   return { currentBoard, pickBoardSquare, restartgame };
// })();

const getSelectedSquare = function (event) {
  let playerNames = getPlayers.selectedNames();
  if (playerNames[0] === undefined || playerNames[1] === undefined) {
    alert("Please pick your names before playing.");
    return "please pick your names first";
  }

  const squareID = event.target.getAttribute("id");
  if (event.target.textContent != " ") {
    return;
  }
  const starttext = document.getElementById("gameReady");
  starttext.classList.add("hide");
  gameboardAIfirstplayer.pickBoardSquare(squareID);
  const currentBoard = gameboardAIfirstplayer.currentBoard;
  //console.log(currentBoard);
};

const gameStart = (function () {
  const squares = document.querySelectorAll(".square p");
  squares.forEach(function (square) {
    square.addEventListener("click", getSelectedSquare);
  });
})();

const displayCurrentBoard = (function () {
  const divs = document.querySelectorAll(".square p");
  const divsarray = Array.from(divs, (div) => div);
  const currentBoard = gameboardAIfirstplayer.currentBoard;
  const winnerPara = document.getElementById("winner");
  const updateDisplay = function (winner, tie, currentBoard) {
    for (i = 0; i < divsarray.length; i++) {
      divsarray[i].textContent = currentBoard[i][i];
    }
    if (winner !== undefined) {
      divs.forEach(function (square) {
        square.removeEventListener("click", getSelectedSquare);
      });
      let playersNames = playeridentities.selectedNames();
      if (winner === "firstplayer") {
        winnerPara.textContent = playersNames[0] + " is the winner!";
      } else {
        winnerPara.textContent = playersNames[1] + " is the winner!";
      }
    }
    if (tie === "It's a tie") {
      console.log(tie);
      winnerPara.textContent = "It's a tie!";
    }
  };
  updateDisplay(undefined, undefined, currentBoard);
  return { updateDisplay };
})();

const firstplayerAIfunc = function (winner, tie, currentBoard) {
  let availableSquares = [];
  currentBoard.forEach(function (obj) {
    if (Object.values(obj)[0] === " ") {
      availableSquares.push(obj);
    }
  });
  const getRandomIntInclusive = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const indexSelected = getRandomIntInclusive(0, availableSquares.length - 1);
  //  console.log("available squares");

  const squareSelected = Object.getOwnPropertyNames(
    availableSquares[indexSelected]
  );
  console.log(squareSelected[0]);
  currentBoard[squareSelected[0]][squareSelected[0]] = "x";
  //  console.log(currentBoard);
  checkForWinner(squareSelected[0], currentBoard, "x", firstplayer);
  return displayCurrentBoard.updateDisplay(winner, tie, currentBoard);
};

const checkForTie = function (currentBoard) {
  let objectValues = [];
  currentBoard.forEach(function (obj) {
    objectValues.push(Object.values(obj));
  });
  let objectValuesExtracted = [];
  objectValues.forEach(function (array) {
    objectValuesExtracted.push(array[0]);
  });
  const emptySquares = objectValuesExtracted.includes(" ");
  if (!emptySquares) {
    return "It's a tie";
  }
};

const checkForWinner = function (
  currentSquareID,
  currentBoard,
  piece,
  currentplayer
) {
  const winningArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let miniArraysWithSquare = winningArray.filter((miniarray) =>
    miniarray.includes(Number(currentSquareID))
  );

  let winner;
  for (i = 0; i < miniArraysWithSquare.length; i++) {
    const currentArray = miniArraysWithSquare[i];
    let currentBoardValuesForThisArray = [
      currentBoard[currentArray[0]],
      currentBoard[currentArray[1]],
      currentBoard[currentArray[2]],
    ];

    let objectvaluesarray = [];
    currentBoardValuesForThisArray.forEach(function (obj) {
      objectvaluesarray.push(Object.values(obj));
    });
    let objectvalueOneArray = [
      objectvaluesarray[0][0],
      objectvaluesarray[1][0],
      objectvaluesarray[2][0],
    ];
    let numberPieces = objectvalueOneArray.filter(
      (element) => element === piece
    ).length;

    if (numberPieces === 3) {
      let playerNames = playeridentities.selectedNames();
      let playerNameWinner;
      winner = currentplayer.getName();
      if (winner === "firstplayer") {
        playerNameWinner = playerNames[0];
      } else {
        playerNameWinner = playerNames[1];
      }
      //console.log("we have a winner: " + playerNameWinner);
    }
  }
  return winner;
};

const restartgameListener = (function () {
  const restartbuttonB = document.getElementById("restartbutton");
  // const functionRestart = gameboard.restartgame();
  restartbuttonB.addEventListener("click", function () {
    gameboardAIfirstplayer.restartgame();
  });
})();

//check who is playing and run different functions. leave current functions as they are
// dont let second player play while firstplayer hasnt played or decreased timeout on first play
