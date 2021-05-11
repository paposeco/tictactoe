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
      gameStart();
    } else {
      firstplayerName = output[0];
    }
    if (output[1] === "secondplayer") {
      otherplayerName = window.prompt("Name of Secondplayer:");
    } else {
      otherplayerName = output[1];
    }
    if (
      firstplayerName === "firstplayerAI" &&
      otherplayerName === "secondplayerAI"
    ) {
      return window.alert(
        "The computer doesn't like to play against itself. One human must always play."
      );
    }
    if (firstplayerName === "firstplayerAI") {
      setTimeout(
        playerAIfunc.bind(
          null,
          undefined,
          undefined,
          undefined,
          gameboardAIfirstplayer.currentBoard
        ),
        300
      );
      setTimeout(gameStart, 400);
    }
    if (otherplayerName === "secondplayerAI") {
      gameStart();
    }
    const starttext = document.getElementById("gameReady");
    starttext.classList.remove("hide");
  });
  const selectedNames = function () {
    return [firstplayerName, otherplayerName];
  };
  return { selectedNames };
})();

const gameboardAIfirstplayer = (function () {
  let currentBoard = [
    { 0: "0" },
    { 1: " " },
    { 2: "x" },
    { 3: "x" },
    { 4: " " },
    { 5: " " },
    { 6: "x" },
    { 7: "0" },
    { 8: "0" },
  ];
  const firstplayer = player("firstplayer", "x");
  const otherplayer = player("otherplayer", "0");
  let currentplayer = firstplayer;
  let playerNames;
  const restartgame = function () {
    //currentplayer = firstplayer;
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
    if (playersNames[0] === "firstplayerAI") {
      setTimeout(
        playerAIfunc.bind(
          null,
          firstplayer,
          undefined,
          undefined,
          currentBoard
        ),
        300
      );
    }
    displayCurrentBoard.updateDisplay(undefined, undefined, currentBoard);
  };
  const switchPlayers = function (firstplayer, otherplayer, currentPlayer) {
    if (currentPlayer === firstplayer) {
      return otherplayer;
    } else {
      return firstplayer;
    }
  };
  const pickBoardSquare = function (square) {
    playersNames = getPlayers.selectedNames();
    if (playersNames[1] === "secondplayerAI") {
      currentplayer = firstplayer;
    }
    if (playersNames[0] === "firstplayerAI") {
      currentplayer = otherplayer;
    }
    const playerPiece = currentplayer.getPlayerPiece();
    const picked = currentBoard.findIndex(
      (element) => Object.getOwnPropertyNames(element)[0] === square
    );
    currentBoard[picked][picked] = playerPiece;
    const winner = checkForWinner(
      square,
      currentBoard,
      playerPiece,
      currentplayer
    );
    const tie = checkForTie(currentBoard);
    displayCurrentBoard.updateDisplay(winner, tie, currentBoard);
    if (playersNames[0] === "firstplayerAI") {
      setTimeout(
        playerAIfunc.bind(null, firstplayer, winner, tie, currentBoard),
        1000
      );
    }
    if (playersNames[1] === "secondplayerAI") {
      setTimeout(
        playerAIfunc.bind(null, otherplayer, winner, tie, currentBoard),
        1000
      );
    }
    currentplayer = switchPlayers(firstplayer, otherplayer, currentplayer);
  };

  return { currentBoard, pickBoardSquare, restartgame };
})();

const getSelectedSquare = function (event) {
  const playerNames = getPlayers.selectedNames();
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
};

const gameStart = function () {
  const squares = document.querySelectorAll(".square p");
  squares.forEach(function (square) {
    square.addEventListener("click", getSelectedSquare);
  });
};

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
      let playersNames = getPlayers.selectedNames();
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

const playerAIfunc = function (playerinuse, winner, tie, currentBoard) {
  let playerpiece;
  let currentplayer;
  if (playerinuse === undefined) {
    playerpiece = "x";
    currentplayer = "";
  } else {
    playerpiece = playerinuse.getPlayerPiece();
    currentplayer = playerinuse;
  }
  if (winner != undefined) {
    return;
  }
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
  if (playerinuse !== undefined) {
    minimax(currentplayer, currentBoard, availableSquares);
  }
  const indexSelected = getRandomIntInclusive(0, availableSquares.length - 1);
  const squareSelected = Object.getOwnPropertyNames(
    availableSquares[indexSelected]
  );

  currentBoard[squareSelected[0]][squareSelected[0]] = playerpiece;
  winner = checkForWinner(
    squareSelected[0],
    currentBoard,
    playerpiece,
    currentplayer
  );
  console.log(winner);
  if (winner == undefined) {
    tie = checkForTie(currentBoard);
  }
  return displayCurrentBoard.updateDisplay(winner, tie, currentBoard);
};

const minimax = function (currentplayer, currentBoard, availableSquares) {
  const playerPiece = currentplayer.getPlayerPiece();
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
  let boardValues = [];
  currentBoard.forEach(function (obj) {
    boardValues.push(Object.values(obj).toString());
  });
  let matchIndex = [];
  boardValues.forEach(function (piece, index) {
    if (piece === playerPiece) {
      matchIndex.push(index);
    }
  });
  let winningArraymatch = [];
  matchIndex.forEach(function (match) {
    winningArray.forEach(function (miniarray) {
      if (miniarray.includes(match)) {
        winningArraymatch.push(miniarray);
      }
    });
  });
  console.log(winningArraymatch);
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
      let playerNames = getPlayers.selectedNames();
      let playerNameWinner;
      winner = currentplayer.getName();
      if (winner === "firstplayer") {
        playerNameWinner = playerNames[0];
      } else {
        playerNameWinner = playerNames[1];
      }
    }
  }
  return winner;
};

const restartgameListener = (function () {
  const restartbuttonB = document.getElementById("restartbutton");
  restartbuttonB.addEventListener("click", function () {
    gameboardAIfirstplayer.restartgame();
  });
})();
