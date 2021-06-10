const player = function (name, playerMark) {
  const getName = () => name;
  const getPlayerMark = () => playerMark;
  return { getName, getPlayerMark };
};

let aiboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// saves players names, and if the first player is AI, runs the AI player function
const getPlayers = (function () {
  const formAI = document.getElementById("playersinfoAI");
  let output = [];
  let firstplayerName;
  let otherplayerName;
  formAI.addEventListener("submit", function (e) {
    e.preventDefault();
    output = [];
    let data = new FormData(formAI);
    for (const entry of data) {
      output.push(entry[1]);
    }
    if (output.length !== 2) {
      alert("You must select both players first.");
      return;
    }
    //output[0] is firstplayer for humans and firstplayerAI for computer;
    if (output[0] === "firstplayer") {
      firstplayerName = window.prompt("Name of first player: ", "Player X");
      // on cancel return
      if (firstplayerName === null) {
        return;
      } else {
        gameStart();
      }
    } else {
      firstplayerName = output[0];
    }
    if (output[1] === "secondplayer") {
      otherplayerName = window.prompt("Name of second player: ", "Player O");
      if (otherplayerName === null) {
        return;
      }
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
    // resets game if the user wants to change players
    const freshboard = gameboard.resetPlayers();
    if (firstplayerName === "firstplayerAI") {
      playerAIfunc(undefined, undefined, undefined, freshboard);
      gameStart();
    }

    // at the start of the game displays information about the game
    const starttext = document.getElementById("gameStatus");
    const subtitle = document.createElement("h3");
    const para1 = document.createElement("p");
    const para2 = document.createElement("p");
    subtitle.textContent = "Game is ready!";
    para1.textContent =
      "Player 1 picks a square. Player 2 picks next. If you are playing against the computer, it will play automatically.";
    para2.textContent =
      "Continue until one player fills a line with 3 crosses or circles.";
    starttext.appendChild(subtitle);
    starttext.appendChild(para1);
    starttext.appendChild(para2);
  });

  const selectedNames = function () {
    return [firstplayerName, otherplayerName];
  };
  return { selectedNames };
})();

const gameboard = (function () {
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

  const firstplayer = player("firstplayer", "×");
  const otherplayer = player("otherplayer", "o");
  let currentplayer = firstplayer;
  let playerNames;
  let winner;
  let tie;
  // restarts game and maintains players
  const restartgame = function () {
    playerNames = getPlayers.selectedNames();
    if (playerNames[0] === undefined || playerNames[1] === undefined) {
      return alert("Select players to start playing.");
    }
    aiboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    winner = undefined;
    tie = undefined;
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
    currentplayer = firstplayer;
    // removes "O" mark class (that colors "O" in a different color) where it was applied before and removes winner/tie text
    const squaresPara = document.querySelectorAll(".markO");
    squaresPara.forEach((square) => square.classList.remove("markO"));
    const subtitle = document.querySelector("#gameStatus h3");
    const starttext = document.querySelector("#gameStatus");
    if (starttext.contains(subtitle)) {
      starttext.removeChild(subtitle);
    }
    if (playerNames[0] === "firstplayerAI") {
      playerAIfunc(firstplayer, undefined, undefined, currentBoard);
      gameStart();
    } else {
      gameStart();
    }
    drawOnCanvas.clearCanvas();
    displayCurrentBoard.updateDisplay(undefined, undefined, currentBoard);
  };
  // similar to restart function but resets players too; function runs after clicking the start button for a second time
  const resetPlayers = function () {
    aiboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    winner = undefined;
    tie = undefined;
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
    const squaresPara = document.querySelectorAll(".markO");
    squaresPara.forEach((square) => square.classList.remove("markO"));
    const subtitle = document.querySelector("#gameStatus h3");
    const starttext = document.querySelector("#gameStatus");
    if (starttext.contains(subtitle)) {
      starttext.removeChild(subtitle);
    }
    currentplayer = firstplayer;
    drawOnCanvas.clearCanvas();
    displayCurrentBoard.updateDisplay(undefined, undefined, currentBoard);
    return currentBoard;
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
    // switches players for AI; humans are switched with the switchPlayers function
    if (playersNames[1] === "secondplayerAI") {
      currentplayer = firstplayer;
    }
    if (playersNames[0] === "firstplayerAI") {
      currentplayer = otherplayer;
    }
    const currentSquare = document.getElementById(square);
    const playerMark = currentplayer.getPlayerMark();
    // colors mark "O" differently than "X"
    if (playerMark === "o") {
      currentSquare.classList.add("markO");
    }
    const picked = currentBoard.findIndex(
      (element) => Object.getOwnPropertyNames(element)[0] === square
    );
    // updates currentBoard objects, checks for winner or tie and updates display
    currentBoard[picked][picked] = playerMark;
    winner = checkForWinner(square, currentBoard, playerMark, currentplayer);
    tie = checkForTie(currentBoard, winner);
    displayCurrentBoard.updateDisplay(winner, tie, currentBoard);
    // after a play by a human, calls the AI player function if one is being used
    if (
      playersNames[0] === "firstplayerAI" &&
      winner === undefined &&
      tie === undefined
    ) {
      setTimeout(
        playerAIfunc.bind(null, firstplayer, winner, tie, currentBoard),
        300
      );
    }
    if (
      playersNames[1] === "secondplayerAI" &&
      winner === undefined &&
      tie === undefined
    ) {
      setTimeout(
        playerAIfunc.bind(null, otherplayer, winner, tie, currentBoard),
        300
      );
    }
    currentplayer = switchPlayers(firstplayer, otherplayer, currentplayer);
  };

  return { currentBoard, pickBoardSquare, restartgame, resetPlayers };
})();

// handles click events on gameboard for humans
const getSelectedSquare = function (event) {
  const squareID = event.target.getAttribute("id");
  if (event.target.textContent != " ") {
    return;
  }
  // removes text after the first play
  const starttext = document.getElementById("gameStatus");
  const subtitle = document.querySelector("#gameStatus h3");
  const paraS = document.querySelectorAll("#gameStatus p");
  if (starttext.contains(subtitle)) {
    starttext.removeChild(subtitle);
    paraS.forEach((para) => starttext.removeChild(para));
  }
  //removes hover coloring if the square isn't available
  const div = event.target.closest("div");
  div.classList.remove("availablesquare");
  // the ai keeps a separate board for keeping track of the order of mark placement
  const availableplaces = betterai.available(aiboard).length;
  const order = 9 - Number(availableplaces);
  aiboard[squareID] = "w" + order;
  gameboard.pickBoardSquare(squareID);
};

const gameStart = function () {
  const squares = document.querySelectorAll(".square p");
  squares.forEach(function (square) {
    square.addEventListener("click", getSelectedSquare);
  });
  const divs = document.querySelectorAll(".square");
  divs.forEach((div) => div.classList.add("availablesquare"));
};

const displayCurrentBoard = (function () {
  const paragraphs = document.querySelectorAll(".square p");
  const paraArray = Array.from(paragraphs, (para) => para);
  const currentBoard = gameboard.currentBoard;
  // displays the current board, by updating the textcontent of each p
  const updateDisplay = function (winner, tie, currentBoard) {
    const gameStatus = document.getElementById("gameStatus");
    const winnerPara = document.createElement("h3");
    for (i = 0; i < paraArray.length; i++) {
      paraArray[i].textContent = currentBoard[i][i];
    }
    //if a winner is found, removes listeners from squares and displays the winner's name
    if (winner !== undefined) {
      paragraphs.forEach(function (square) {
        square.removeEventListener("click", getSelectedSquare);
      });
      let playersNames = getPlayers.selectedNames();
      if (winner === "firstplayer") {
        if (playersNames[0] === "firstplayerAI") {
          winnerPara.textContent = "Computer is the winner!";
          gameStatus.appendChild(winnerPara);
        } else {
          winnerPara.textContent = playersNames[0] + " is the winner!";
          gameStatus.appendChild(winnerPara);
        }
      } else {
        if (playersNames[1] === "secondplayerAI") {
          winnerPara.textContent = "Computer is the winner!";
          gameStatus.appendChild(winnerPara);
        } else {
          winnerPara.textContent = playersNames[1] + " is the winner!";
          gameStatus.appendChild(winnerPara);
        }
      }
    }
    if (tie === "It's a tie") {
      winnerPara.textContent = "It's a tie!";
      gameStatus.appendChild(winnerPara);
    }
  };
  return { updateDisplay };
})();

const playerAIfunc = function (AIplayer, winner, tie, currentBoard) {
  if (winner != undefined) {
    return;
  }
  let availableSquares = [];
  currentBoard.forEach(function (obj) {
    if (Object.values(obj)[0] === " ") {
      availableSquares.push(obj);
    }
  });

  let playermark;
  let currentplayer;
  let bestIndex;
  let squareSelected;
  let indexSelected;

  // when the game first loads, player is undefined
  if (AIplayer === undefined) {
    playermark = "×";
    currentplayer = "";
  } else {
    // looks for a win or, if there isn't one, if the other player will win on the next round
    playermark = AIplayer.getPlayerMark();
    currentplayer = AIplayer;
  }

  // runs betterai function to look for the best move
  if (playermark === "×") {
    bestIndex = betterai.bestspot(aiboard, "x");
  } else {
    bestIndex = betterai.bestspot(aiboard, playermark);
  }

  squareSelected = [bestIndex];
  paraSelectedID = bestIndex;

  const paraID = squareSelected[0];
  const paraSelected = document.getElementById(paraID);

  // colors "O" differently
  if (playermark === "o") {
    paraSelected.classList.add("markO");
  }
  //removes hover coloring if the square isn't available
  const div = paraSelected.closest("div");
  div.classList.remove("availablesquare");

  // updates board with the selected square and checks if there's a winner or a tie

  const availableplaces = betterai.available(aiboard).length;
  const order = 9 - Number(availableplaces);
  aiboard[bestIndex] = "w" + order;
  currentBoard[squareSelected[0]][squareSelected[0]] = playermark;

  winner = checkForWinner(
    squareSelected[0],
    currentBoard,
    playermark,
    currentplayer
  );
  if (winner === undefined) {
    tie = checkForTie(currentBoard, winner);
  }

  // updates game display
  return displayCurrentBoard.updateDisplay(winner, tie, currentBoard);
};

const getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//inside betterai the board works with "w"+number to keep track of the sequence of mark placements. even numbers are plays by X and odd numbers are plays by O
const betterai = (function (boardnewai) {
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

  const flattenArray = function (array) {
    let flattenedarray = [];
    for (let i = 0; i < array.length; i++) {
      let currentarray = array[i];
      let currentarrayL = currentarray.length;
      if (currentarrayL !== 9) {
        for (let j = 0; j < currentarrayL; j++) {
          flattenedarray.push(currentarray[j]);
        }
      } else {
        flattenedarray.push(currentarray);
      }
    }
    return flattenedarray;
  };

  const reducer = function (accumulator, currentValue) {
    if (currentValue !== 0) {
      ++accumulator;
    }
    return accumulator;
  };

  // the board in the format "w"+number isn't very useful to determine if a line is either full of a specific mark or about to be full; transformMark transforms the board into x/o marks
  const transformMark = function (array) {
    const temparray = Array.from(array);
    for (let i = 0; i < temparray.length; i++) {
      if (
        temparray[i] === "w0" ||
        temparray[i] === "w2" ||
        temparray[i] === "w4" ||
        temparray[i] === "w6" ||
        temparray[i] === "w8"
      ) {
        temparray[i] = "x";
      } else if (temparray[i] === 0) {
        continue;
      } else if (
        temparray[i] === "w1" ||
        temparray[i] === "w3" ||
        temparray[i] === "w5" ||
        temparray[i] === "w7"
      ) {
        temparray[i] = "o";
      }
    }
    return temparray;
  };

  const available = function (array) {
    let availablearray = [];
    array.forEach(function (value, index) {
      if (value === 0) {
        availablearray.push(index);
      }
    });
    return availablearray;
  };

  const checkforThree = function (array, mark) {
    const temparray = Array.from(array);
    let transformedboardArray = transformMark(temparray);
    let winner;
    for (let k = 0; k < winningArray.length; k++) {
      const currentarray = winningArray[k];
      const valueOnBoard = [
        transformedboardArray[currentarray[0]],
        transformedboardArray[currentarray[1]],
        transformedboardArray[currentarray[2]],
      ];
      if (valueOnBoard.every((element) => element === mark)) {
        winner = true;
        break;
      } else {
        winner = false;
      }
    }
    return winner;
  };

  //checks if there are two equal marks on a winningarray; first checks for the player that is playing; if it can't find for the player, checks for the adversary.
  const checkForTwo = function (array, firstmark, secondmark) {
    let goodindex;
    let zeroLocation;
    const temparray = Array.from(array);
    for (let i = 0; i < winningArray.length; i++) {
      let arrayIndexes = [];
      const currentarray = winningArray[i];
      // for each winningarray, checks if there is an empty space on the current board; saves the index of the filled indexes
      const valueOnBoard = [
        temparray[currentarray[0]],
        temparray[currentarray[1]],
        temparray[currentarray[2]],
      ];
      if (valueOnBoard.includes(0)) {
        valueOnBoard.forEach(function (element, index) {
          if (element !== 0) {
            arrayIndexes.push(index);
          }
        });
      } else {
        continue;
      }
      // for the saved indexes, creates a new array with the values on the current board and checks if the marks are the same; if true returns the location of the empty space
      if (arrayIndexes.length === 2) {
        let newarray = [
          valueOnBoard[arrayIndexes[0]],
          valueOnBoard[arrayIndexes[1]],
        ];
        if (newarray.every((element) => element === firstmark)) {
          zeroLocation = valueOnBoard.findIndex((element) => element === 0);
          goodindex = currentarray[zeroLocation];
          return goodindex;
        } else {
          continue;
        }
      }
    }
    // repeats the same for the adversary mark (secondmark)
    for (let j = 0; j < winningArray.length; j++) {
      let arrayIndexes = [];
      const currentarray = winningArray[j];
      const valueOnBoard = [
        temparray[currentarray[0]],
        temparray[currentarray[1]],
        temparray[currentarray[2]],
      ];
      if (valueOnBoard.includes(0)) {
        valueOnBoard.forEach(function (element, index) {
          if (element !== 0) {
            arrayIndexes.push(index);
          }
        });
      } else {
        continue;
      }
      if (arrayIndexes.length === 2) {
        let newarray = [
          valueOnBoard[arrayIndexes[0]],
          valueOnBoard[arrayIndexes[1]],
        ];
        if (newarray.every((element) => element === secondmark)) {
          zeroLocation = valueOnBoard.findIndex((element) => element === 0);
          goodindex = currentarray[zeroLocation];
          return goodindex;
        } else {
          continue;
        }
      }
    }
  };

  //superfluous function for using checkfortwo
  const entireboard = function (boardnewai, mark) {
    let selected;
    const availablespots = available(boardnewai);
    if (availablespots.length === 1) {
      selected = availablespots[0];
      return selected;
    }
    const tempboard = Array.from(boardnewai);
    const currentboard = transformMark(tempboard);

    if (mark === "o") {
      let checkForTwoO = checkForTwo(currentboard, "o", "x");
      if (checkForTwoO !== undefined) {
        selected = checkForTwoO;
        return selected;
      }
    } else {
      let checkForTwoX = checkForTwo(currentboard, "x", "o");
      if (checkForTwoX !== undefined) {
        selected = checkForTwoX;
        return selected;
      }
    }
  };

  // calculates number of available spaces and fills the board on the provided index with "w"+ current number in sequence (0 to 8);
  const fill = function (index, currentboard) {
    let availableplaces = available(currentboard).length;
    const order = 9 - Number(availableplaces);
    currentboard[index] = "w" + order;
    availableplaces = available(currentboard).length;
    if (availableplaces === 1) {
      let temporaryboard = Array.from(currentboard);
      let winner = checkforThree(temporaryboard, "o");
      if (!winner) {
        let lastspot = currentboard.indexOf(0);
        currentboard[lastspot] = "w8";
      }
    }
    return currentboard;
  };

  // if all indexes on a winning array are filled with mark returns +10; if all are filled with other mark returns -10; else returns 0
  const calculateValue = function (array, mark) {
    let othermark;
    if (mark === "x") {
      othermark = "o";
    } else {
      othermark = "x";
    }
    let ev = 0;
    for (let k = 0; k < winningArray.length; k++) {
      const currentarray = winningArray[k];
      const valueOnBoard = [
        array[currentarray[0]],
        array[currentarray[1]],
        array[currentarray[2]],
      ];
      if (valueOnBoard.every((element) => element === mark)) {
        ev += 10;
        break;
      } else if (valueOnBoard.every((element) => element === othermark)) {
        ev += -10;
        break;
      } else {
        ev = 0;
      }
    }
    return ev;
  };

  // returns best possible index for a certain board and player
  const bestspot = function (boardnewai, mark) {
    let allcombos;
    if (mark === "x") {
      allcombos = combos(boardnewai);
    } else {
      allcombos = combosO(boardnewai);
    }
    const allcombosBackup = Array.from(allcombos);
    let goodboard;
    let goodspot;
    const numbercombos = allcombos.length;
    if (numbercombos === 9 && !Array.isArray(allcombos[0])) {
      goodboard = allcombos;
    } else {
      //for each possible board found in combos/combosO, looks for and saves winning boards for the current player
      let winningBoards = [];
      for (let i = 0; i < allcombos.length; i++) {
        let ev;
        if (allcombos[i].length === 0) {
          continue;
        }
        const tempboard = Array.from(allcombos[i]);
        const tempboardFlat = tempboard.flat();
        const tempboardTransformed = transformMark(tempboardFlat);
        ev = calculateValue(tempboardTransformed, mark);
        if (ev === 10) {
          winningBoards.push(tempboardFlat);
          continue;
        }
      }
      // if there are winning boards, gets a random board
      if (winningBoards.length > 0) {
        let winningplacesOptions = winningBoards.length;
        let randomBoard = getRandomIntInclusive(0, winningplacesOptions - 1);
        goodboard = winningBoards[randomBoard];
      }
      // if there were no winning boards, checks for boards where a tie can be found and uses that board
      if (goodboard === undefined) {
        let tieBoards = [];
        for (let j = 0; j < allcombosBackup.length; j++) {
          let ev;
          const tempboard = Array.from(allcombosBackup[j]);
          const tempboardFlat = tempboard.flat();
          const tempboardTransformed = transformMark(tempboardFlat);
          ev = calculateValue(tempboardTransformed, mark);
          if (ev === 0) {
            tieBoards.push(tempboardFlat);
            continue;
          }
        }
        if (tieBoards.length > 0) {
          let tieplacesOptions = tieBoards.length;
          let randomBoard = getRandomIntInclusive(0, tieplacesOptions - 1);
          goodboard = tieBoards[randomBoard];
        }
      }
    }
    // once a goodboard has been found, looks at the current board for the next place that needs to be filled (if the largest filled place is w2, the next place to be filled is w3); looks for the index for this place on the selected goodboard (for example, looks for the index of w3 on goodboard); returns the index
    if (goodboard !== undefined) {
      const onlyZero = (currentValue) => currentValue === 0;
      if (boardnewai.every(onlyZero)) {
        goodspot = goodboard.findIndex((element) => element === "w0");
      } else {
        const arrayToSort = Array.from(boardnewai);
        arrayToSort.sort();
        const largestFilled = arrayToSort[arrayToSort.length - 1];
        const largestFilledNumber = Number(largestFilled.slice(1));
        goodspot = goodboard.findIndex(
          (element) => element === "w" + (largestFilledNumber + 1)
        );
      }
    }
    return goodspot;
  };

  const combinationsForOtherPlayer = function (
    currentboard,
    newpositions,
    player
  ) {
    let adversary;
    if (player === "o") {
      adversary = "x";
    } else {
      adversary = "o";
    }
    let adversaryiswinner = checkforThree(currentboard, adversary);
    if (adversaryiswinner) {
      return currentboard;
    }
    let possible = [];
    const availablespaces = newpositions.length;
    if (availablespaces === 0) {
      return currentboard;
    }
    // calls function bestspot for currentboard and player to determine best possible index
    let bestplace = bestspot(currentboard, player);
    if (bestplace !== -1 && bestplace !== undefined) {
      currentboard = fill(bestplace, currentboard);
      possible.push(currentboard);
      return possible;
    }
    // if a win or tie isn't possible and therefore bestplace is undefined, fills the first available spot
    for (let i = 0; i < availablespaces; i++) {
      let workingboard = Array.from(currentboard);
      workingboard = fill(newpositions[i], workingboard);
      possible.push(workingboard);
    }
    return possible;
  };

  // for a certain board, gets all combinations for the next two open spaces. one for the current player and, if a winner hasn't been found, one for the next player.
  const combinationsForCurrentPlayer = function (array, player) {
    let adversary;
    if (player === "x") {
      adversary = "o";
    } else {
      adversary = "x";
    }
    let emptyarray = [];
    if (array.length === 9 && !Array.isArray(array[0])) {
      let adversaryiswinner = checkforThree(array, adversary);
      if (adversaryiswinner) {
        return array;
      }
    }
    for (let i = 0; i < array.length; i++) {
      let boardarray = Array.from(array[i]);
      let availablespots = available(boardarray);
      //looks for a bestplace to fill - either a place where player makes three in line, or if that's not possible, a place to stop the adversary to make three in line
      let bestplace = entireboard(boardarray, player);
      if (bestplace !== undefined) {
        //if a place is found, fills the board on that index
        boardarray = fill(bestplace, boardarray);
        availablespots = available(boardarray);
        // checks if there are winners
        let playeriswinner = checkforThree(boardarray, player);
        let adversaryiswinner = checkforThree(boardarray, adversary);
        if (playeriswinner) {
          emptyarray.push(boardarray);
          continue;
        } else if (adversaryiswinner) {
          continue;
          // if there aren't winners calls the combinations function for the other player for the current board and available places
        } else {
          let newboardarray = combinationsForOtherPlayer(
            boardarray,
            availablespots,
            adversary
          );
          // pushes the combinations found to emptyarray and goes to next board
          emptyarray.push(newboardarray);
          continue;
        }
      } else {
        // if there isn't a bestplace, fills the first available spot and calls the combinations functions for the other player
        for (let j = 0; j < availablespots.length; j++) {
          let freshboardarray = Array.from(boardarray);
          freshboardarray = fill(availablespots[j], freshboardarray);
          let newavailablespots = available(freshboardarray);
          let newboardarray = combinationsForOtherPlayer(
            freshboardarray,
            newavailablespots,
            adversary
          );
          // pushes the combinations found to empty array and goes to next board
          emptyarray.push(newboardarray);
        }
      }
    }
    return emptyarray;
  };

  // same as combinationsForCurrentPlayer, but starts with a single array, instead of an array of arrays
  const combinationsSingle = function (array, player) {
    let adversary;
    if (player === "x") {
      adversary = "o";
    } else {
      adversary = "x";
    }
    let workingarray = Array.from(array);
    if (workingarray.length === 9 && !Array.isArray(workingarray[0])) {
      let adversaryiswinner = checkforThree(workingarray, adversary);
      let playeriswinner = checkforThree(workingarray, player);
      if (adversaryiswinner) {
        return workingarray;
      }
      if (playeriswinner) {
        return workingarray;
      }
    }
    let emptyarray = [];
    let availablespots = available(workingarray);
    //looks for a bestplace to fill - either a place where player makes three in line, or if that's not possible, a place to stop the adversary to make three in line
    let bestplace = entireboard(workingarray, player);
    if (bestplace !== undefined) {
      //if a place is found, fills the board on that index
      workingarray = fill(bestplace, workingarray);
      availablespots = available(workingarray);
      if (availablespots.length === 0) {
        return workingarray;
      } else {
        // checks if there are winners
        let playeriswinner = checkforThree(workingarray, player);
        let adversaryiswinner = checkforThree(workingarray, adversary);
        if (playeriswinner) {
          return workingarray;
        } else if (adversaryiswinner) {
          return;
        } else {
          // if there aren't winners calls the combinations function for the other player for the current board and available places
          let newboardarray = combinationsForOtherPlayer(
            workingarray,
            availablespots,
            adversary
          );
          emptyarray.push(newboardarray);
          return emptyarray;
        }
      }
    } else {
      // if there isn't a bestplace, fills the first available spot and calls the combinations functions for the other player
      for (let i = 0; i < availablespots.length; i++) {
        let freshboardarray = Array.from(array);
        freshboardarray = fill(availablespots[i], freshboardarray);
        let newavailablespots = available(freshboardarray);
        let newboardarraySecond = combinationsForOtherPlayer(
          freshboardarray,
          newavailablespots,
          adversary
        );
        emptyarray.push(newboardarraySecond);
      }
    }
    return emptyarray;
  };

  // controls game sequence for X player according to the number of places to be filled on the board
  const combos = function (thisboard) {
    const initialfilledspots = thisboard.reduce(reducer, 0);
    let combosTwo;
    let combosFour;
    let combosSix;
    let combosEight;
    // empty board
    if (initialfilledspots === 0) {
      let combosTwoTemp = [];
      // for each possible starting move, fills the board for X player and gets all the possible moves for the other player
      for (let j = 0; j < 9; j++) {
        let workingboard = Array.from(thisboard);
        workingboard = fill(j, workingboard);
        let availablespots = available(workingboard);
        combosTwoTemp.push(
          combinationsForOtherPlayer(workingboard, availablespots, "o")
        );
      }
      combosTwo = flattenArray(combosTwoTemp);
      // continues filling the board in this manner until a winner is found or a tie
      let combosFourTemp = combinationsForCurrentPlayer(combosTwo, "x");
      combosFour = flattenArray(combosFourTemp);
      let combosSixTemp = combinationsForCurrentPlayer(combosFour, "x");
      combosSix = flattenArray(combosSixTemp);
      let temparray = [];
      if (combosSix.length === 9 && !Array.isArray(combosSix[0])) {
        let isOwinner = checkforThree(combosSix, "o");
        if (isOwinner) {
          return;
        } else {
          return combosSix;
        }
      } else {
        for (let i = 0; i < combosSix.length; i++) {
          let aboard = combosSix[i];
          let isOwinner = checkforThree(aboard, "o");
          if (isOwinner) {
            continue;
          } else {
            temparray.push(combosSix[i]);
          }
        }
      }
      combosSix = Array.from(temparray);
      combosEight = combinationsForCurrentPlayer(combosSix, "x");
    } else if (initialfilledspots === 2) {
      //same as before, but there are now 2 places filled on the board
      let combosFourTemp = combinationsSingle(thisboard, "x");
      combosFour = flattenArray(combosFourTemp);
      let combosSixTemp = combinationsForCurrentPlayer(combosFour, "x");
      combosSix = flattenArray(combosSixTemp);
      let temparray = [];
      if (combosSix.length === 9 && !Array.isArray(combosSix[0])) {
        let isOwinner = checkforThree(combosSix, "o");
        if (isOwinner) {
          return;
        } else {
          return combosSix;
        }
      } else {
        for (let i = 0; i < combosSix.length; i++) {
          let aboard = combosSix[i];
          let isOwinner = checkforThree(aboard, "o");
          if (isOwinner) {
            continue;
          } else {
            temparray.push(combosSix[i]);
          }
        }
      }
      combosSix = Array.from(temparray);
      combosEight = combinationsForCurrentPlayer(combosSix, "x");
    } else if (initialfilledspots === 4) {
      let combosSixTemp = combinationsSingle(thisboard, "x");
      if (combosSixTemp.length === 9 && !Array.isArray(combosSixTemp[0])) {
        combosSix = combosSixTemp;
      } else {
        combosSix = flattenArray(combosSixTemp);
      }

      let temparray = [];
      if (combosSix.length === 9 && !Array.isArray(combosSix[0])) {
        let isOwinner = checkforThree(combosSix, "o");
        if (isOwinner) {
          return;
        } else {
          return combosSix;
        }
      } else {
        for (let i = 0; i < combosSix.length; i++) {
          let aboard = combosSix[i];
          let isOwinner = checkforThree(aboard, "o");
          if (isOwinner) {
            continue;
          } else {
            temparray.push(combosSix[i]);
          }
        }
      }
      combosSix = Array.from(temparray);
      combosEight = combinationsForCurrentPlayer(combosSix, "x");
    } else {
      combosEight = combinationsSingle(thisboard, "x");
    }
    return combosEight;
  };

  // same as combos but for O player
  const combosO = function (thisboard) {
    const initialfilledspots = thisboard.reduce(reducer, 0);
    let combosThree;
    let combosFive;
    let combosSeven;
    let combosNine;
    if (initialfilledspots === 1) {
      let combosThreeTemp = combinationsSingle(thisboard, "o");
      combosThree = flattenArray(combosThreeTemp);
      let combosFiveTemp = combinationsForCurrentPlayer(combosThree, "o");
      combosFive = flattenArray(combosFiveTemp);
      let temparray = [];
      if (combosFive.length === 9 && !Array.isArray(combosFive[0])) {
        let isxwinner = checkforThree(combosFive, "x");
        if (isxwinner) {
          return;
        } else {
          return combosFive;
        }
      } else {
        for (let i = 0; i < combosFive.length; i++) {
          let aboard = combosFive[i];
          let isxwinner = checkforThree(aboard, "x");
          if (isxwinner) {
            continue;
          } else {
            temparray.push(combosFive[i]);
          }
        }
      }
      combosFive = Array.from(temparray);
      let combosSevenTemp = combinationsForCurrentPlayer(combosFive, "o");
      combosSeven = flattenArray(combosSevenTemp);
      let temparray2 = [];
      if (combosSeven.length === 9 && !Array.isArray(combosSeven[0])) {
        let isxwinner = checkforThree(combosSeven, "x");
        if (isxwinner) {
          return;
        } else {
          return combosSeven;
        }
      } else {
        for (let i = 0; i < combosSeven.length; i++) {
          let aboard = combosSeven[i];
          let isxwinner = checkforThree(aboard, "x");
          if (isxwinner) {
            continue;
          } else {
            temparray2.push(combosSeven[i]);
          }
        }
      }
      combosSeven = Array.from(temparray2);
      combosNine = combinationsForCurrentPlayer(combosSeven, "o");
    } else if (initialfilledspots === 3) {
      let combosFiveTemp = combinationsSingle(thisboard, "o");
      if (combosFiveTemp.length === 0) {
        return;
      }
      combosFive = flattenArray(combosFiveTemp);
      let temparray = [];
      if (combosFive.length === 9 && !Array.isArray(combosFive[0])) {
        let isxwinner = checkforThree(combosFive, "x");
        if (isxwinner) {
          return;
        } else {
          return combosFive;
        }
      } else {
        for (let i = 0; i < combosFive.length; i++) {
          let aboard = combosFive[i];
          let isxwinner = checkforThree(aboard, "x");
          if (isxwinner) {
            continue;
          } else {
            temparray.push(combosFive[i]);
          }
        }
      }
      combosFive = Array.from(temparray);
      let combosSevenTemp = combinationsForCurrentPlayer(combosFive, "o");
      if (combosSevenTemp.length === 0) {
        return;
      }
      combosSeven = flattenArray(combosSevenTemp);
      let temparray2 = [];
      if (combosSeven.length === 9 && !Array.isArray(combosSeven[0])) {
        let isxwinner = checkforThree(combosSeven, "x");
        if (isxwinner) {
          return;
        } else {
          return combosSeven;
        }
        return combosSeven;
      } else {
        for (let i = 0; i < combosSeven.length; i++) {
          let aboard = combosSeven[i];
          let isxwinner = checkforThree(aboard, "x");
          if (isxwinner) {
            continue;
          } else {
            temparray2.push(combosSeven[i]);
          }
        }
      }
      combosSeven = Array.from(temparray2);
      combosNine = combinationsForCurrentPlayer(combosSeven, "o");
    } else if (initialfilledspots === 5) {
      let combosSevenTemp = combinationsSingle(thisboard, "o");
      if (combosSevenTemp.length === 9 && !Array.isArray(combosSevenTemp[0])) {
        combosSeven = combosSevenTemp;
      } else {
        combosSeven = flattenArray(combosSevenTemp);
      }
      let temparray = [];
      if (combosSeven.length === 9 && !Array.isArray(combosSeven[0])) {
        let isxwinner = checkforThree(combosSeven, "x");
        if (isxwinner) {
          return;
        } else {
          return combosSeven;
        }
      } else {
        for (let i = 0; i < combosSeven.length; i++) {
          let aboard = combosSeven[i];
          let isxwinner = checkforThree(aboard, "x");
          if (isxwinner) {
            continue;
          } else {
            temparray.push(combosSeven[i]);
          }
        }
      }
      combosSeven = Array.from(temparray);
      combosNine = combinationsForCurrentPlayer(combosSeven, "o");
    } else {
      combosNine = combinationsSingle(thisboard, "o");
    }
    return combosNine;
  };
  return { bestspot, available, fill };
})();

// if after checking for winners, the board is full and a winner isn't found, it's a tie
const checkForTie = function (currentBoard, winner) {
  if (winner !== undefined) {
    return;
  }
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
  mark,
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
  //function is called every time a square is filled; creates array with every winning combination that includes the current square
  let miniArraysWithSquare = winningArray.filter((miniarray) =>
    miniarray.includes(Number(currentSquareID))
  );

  let winner;
  for (let i = 0; i < miniArraysWithSquare.length; i++) {
    const currentArray = miniArraysWithSquare[i];
    //gets objects for each index of the winning combination selected previously
    let currentBoardValuesForThisArray = [
      currentBoard[currentArray[0]],
      currentBoard[currentArray[1]],
      currentBoard[currentArray[2]],
    ];

    let objectvaluesarray = [];
    currentBoardValuesForThisArray.forEach(function (obj) {
      objectvaluesarray.push(Object.values(obj));
    });
    // gets values of objects
    let objectvalueOneArray = [
      objectvaluesarray[0][0],
      objectvaluesarray[1][0],
      objectvaluesarray[2][0],
    ];
    //checks if all marks on the winning combination are equal to current player mark
    let numberMarks = objectvalueOneArray.filter((element) => element === mark)
      .length;

    // if there are 3 players, sets the winner and draws line on canvas of the 3 in line
    if (numberMarks === 3) {
      let playerNames = getPlayers.selectedNames();
      let playerNameWinner;
      winner = currentplayer.getName();
      drawOnCanvas.drawLine(currentArray, winner);
    }
  }
  return winner;
};

const restartgameListener = (function () {
  const restartbuttonB = document.getElementById("restartbutton");
  restartbuttonB.addEventListener("click", function () {
    gameboard.restartgame();
  });
})();

const drawOnCanvas = (function () {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const drawLine = function (array, winner) {
    canvas.style.zIndex = "1";
    ctx.beginPath();
    if (winner === "firstplayer") {
      ctx.strokeStyle = "#2a3e39";
    } else {
      ctx.strokeStyle = "#2e7b67";
    }
    ctx.lineWidth = 8;
    const startingPoint = array[0];
    // draws a line starting at the lowest number of the winning combination
    switch (startingPoint) {
      case 0:
        if (array[1] === 1) {
          ctx.moveTo(15, 61);
          ctx.lineTo(345, 61);
        } else if (array[1] === 3) {
          ctx.moveTo(61, 15);
          ctx.lineTo(61, 345);
        } else {
          ctx.moveTo(15, 15);
          ctx.lineTo(345, 345);
        }
        break;
      case 3:
        ctx.moveTo(15, 183);
        ctx.lineTo(345, 183);
        break;
      case 6:
        ctx.moveTo(15, 305);
        ctx.lineTo(345, 305);
        break;
      case 1:
        ctx.moveTo(183, 15);
        ctx.lineTo(183, 345);
        break;
      case 2:
        if (array[1] === 5) {
          ctx.moveTo(305, 15);
          ctx.lineTo(305, 345);
        } else {
          ctx.moveTo(345, 15);
          ctx.lineTo(15, 345);
        }
        break;
    }
    ctx.stroke();
  };
  const clearCanvas = function () {
    canvas.style.zIndex = "-1";
    ctx.clearRect(0, 0, 360, 366);
  };
  return { drawLine, clearCanvas };
})();
