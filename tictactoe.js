let aiboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
const getRandomIntInclusive = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

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

  const checkForTwo = function (array, firstmark, secondmark) {
    let goodindex;
    let zeroLocation;
    const temparray = Array.from(array);
    for (let i = 0; i < winningArray.length; i++) {
      let arrayIndexes = [];
      const currentarray = winningArray[i];
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
        if (newarray.every((element) => element === firstmark)) {
          zeroLocation = valueOnBoard.findIndex((element) => element === 0);
          goodindex = currentarray[zeroLocation];
          return [true, goodindex];
        } else {
          continue;
        }
      }
    }
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
          return [true, goodindex];
        } else {
          continue;
        }
      }
    }
  };

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
      if (checkForTwoO !== undefined && checkForTwoO[0] === true) {
        selected = checkForTwoO[1];
        return selected;
      } else {
        let checkForTwoX = checkForTwo(currentboard, "x", "o");
        if (checkForTwoX !== undefined && checkForTwoX[0] === true) {
          selected = checkForTwoX[1];
          return selected;
        }
      }
    } else {
      let checkForTwoX = checkForTwo(currentboard, "x", "o");
      if (checkForTwoX !== undefined && checkForTwoX[0] === true) {
        selected = checkForTwoX[1];
        return selected;
      } else {
        let checkForTwoO = checkForTwo(currentboard, "o", "x");
        if (checkForTwoO !== undefined && checkForTwoO[0] === true) {
          selected = checkForTwoO[1];
          return selected;
        }
      }
    }
  };

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
      } else if (valueOnBoard.every((element) => element === mark)) {
        ev += -10;
        break;
      } else {
        ev += 0;
      }
    }
    return ev;
  };

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
      if (winningBoards.length > 0) {
        let winningplacesOptions = winningBoards.length;
        let randomBoard = getRandomIntInclusive(0, winningplacesOptions - 1);
        goodboard = winningBoards[randomBoard];
      }
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
    let bestplace = bestspot(currentboard, player);
    if (bestplace !== -1 && bestplace !== undefined) {
      currentboard = fill(bestplace, currentboard);
      possible.push(currentboard);
      return possible;
    }
    for (let i = 0; i < availablespaces; i++) {
      let workingboard = Array.from(currentboard);
      workingboard = fill(newpositions[i], workingboard);
      possible.push(workingboard);
    }
    return possible;
  };

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
      let bestplaceX = entireboard(boardarray, player);
      if (bestplaceX !== undefined) {
        boardarray = fill(bestplaceX, boardarray);
        availablespots = available(boardarray);
        let playeriswinner = checkforThree(boardarray, player);
        let adversaryiswinner = checkforThree(boardarray, adversary);
        if (playeriswinner) {
          emptyarray.push(boardarray);
          continue;
        } else if (adversaryiswinner) {
          continue;
        } else {
          let newboardarray = combinationsForOtherPlayer(
            boardarray,
            availablespots,
            adversary
          );
          emptyarray.push(newboardarray);
          continue;
        }
      } else {
        for (let j = 0; j < availablespots.length; j++) {
          let freshboardarray = Array.from(boardarray);
          freshboardarray = fill(availablespots[j], freshboardarray);
          let newavailablespots = available(freshboardarray);
          let newboardarray = combinationsForOtherPlayer(
            freshboardarray,
            newavailablespots,
            adversary
          );
          emptyarray.push(newboardarray);
        }
      }
    }
    return emptyarray;
  };

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
    let bestplace = entireboard(workingarray, player);
    if (bestplace !== undefined) {
      workingarray = fill(bestplace, workingarray);
      availablespots = available(workingarray);
      if (availablespots.length === 0) {
        return workingarray;
      } else {
        let playeriswinner = checkforThree(workingarray, player);
        let adversaryiswinner = checkforThree(workingarray, adversary);
        if (playeriswinner) {
          return workingarray;
        } else if (adversaryiswinner) {
          return;
        } else {
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

  const combos = function (thisboard) {
    const initialfilledspots = thisboard.reduce(reducer, 0);
    let combosTwo;
    let combosFour;
    let combosSix;
    let combosEight;
    if (initialfilledspots === 0) {
      let combosTwoTemp = [];
      for (let j = 0; j < 9; j++) {
        let workingboard = Array.from(thisboard);
        workingboard = fill(j, workingboard);
        let availablespots = available(workingboard);
        combosTwoTemp.push(
          combinationsForOtherPlayer(workingboard, availablespots, "o")
        );
      }
      combosTwo = flattenArray(combosTwoTemp);
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
    } else {
      combosEight = combinationsSingle(thisboard, "x");
    }
    return combosEight;
  };

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
      combosSeven = flattenArray(combosSevenTemp);
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
  return { available, fill, bestspot };
})();

console.log(betterai.bestspot(aiboard, "x"));

// const bestspotFinal = function (boardnewai, mark) {
//   let allcombos;
//   if (mark === "x") {
//     allcombos = combos(boardnewai);
//   } else {
//     allcombos = combosO(boardnewai);
//   }
//   const allcombosBackup = Array.from(allcombos);
//   let goodboard;
//   let goodspot;
//   const numbercombos = allcombos.length;
//   if (numbercombos === 9 && !Array.isArray(allcombos[0])) {
//     goodboard = allcombos;
//   } else {
//     let winningBoards = [];
//     for (let i = 0; i < allcombos.length; i++) {
//       let ev;
//       if (allcombos[i].length === 0) {
//         continue;
//       }
//       const tempboard = Array.from(allcombos[i]);
//       const tempboardFlat = tempboard.flat();
//       const tempboardTransformed = transformMark(tempboardFlat);
//       ev = calculateValue(tempboardTransformed, mark);
//       if (ev === 10) {
//         winningBoards.push(tempboardFlat);
//         continue;
//       }
//     }
//     if (winningBoards.length > 0) {
//       let winningplacesOptions = winningBoards.length;
//       let randomBoard = getRandomIntInclusive(0, winningplacesOptions - 1);
//       goodboard = winningBoards[randomBoard];
//     }
//     if (goodboard === undefined) {
//       let tieBoards = [];
//       for (let j = 0; j < allcombosBackup.length; j++) {
//         let ev;
//         const tempboard = Array.from(allcombosBackup[j]);
//         const tempboardFlat = tempboard.flat();
//         const tempboardTransformed = transformMark(tempboardFlat);
//         ev = calculateValue(tempboardTransformed, mark);

//         if (ev === 0) {
//           tieBoards.push(tempboardFlat);
//           continue;
//         }
//       }
//       if (tieBoards.length > 0) {
//         let tieplacesOptions = tieBoards.length;
//         let randomBoard = getRandomIntInclusive(0, tieplacesOptions - 1);
//         goodboard = tieBoards[randomBoard];
//       }
//     }
//   }

//   if (goodboard !== undefined) {
//     const onlyZero = (currentValue) => currentValue === 0;
//     if (boardnewai.every(onlyZero)) {
//       goodspot = goodboard.findIndex((element) => element === "w0");
//     } else {
//       const arrayToSort = Array.from(boardnewai);
//       arrayToSort.sort();
//       const largestFilled = arrayToSort[arrayToSort.length - 1];
//       const largestFilledNumber = Number(largestFilled.slice(1));
//       goodspot = goodboard.findIndex(
//         (element) => element === "w" + (largestFilledNumber + 1)
//       );
//     }
//   }
//   return goodspot;
// };
