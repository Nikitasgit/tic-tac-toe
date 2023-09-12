const cells = document.querySelectorAll(".cell");
const score1 = document.getElementById("score-1");
const score2 = document.getElementById("score-2");
const scoreDraw = document.getElementById("draw-score");
const gameboard = document.getElementById("gameboard");
const restartBtn = document.getElementById("restart-btn");
const trophies1 = document.querySelector(".trophies-1");
const trophies2 = document.querySelector(".trophies-2");
const icon1 = document.getElementById("player-1-icon");
const icon2 = document.getElementById("player-2-icon");
const roundWinnerText = document.getElementById("round-winner");
const sound1 = new Audio("./assets/sounds/man-sound.mp3");
const sound2 = new Audio("./assets/sounds/woman-sound.mp3");
const soundDraw = new Audio("./assets/sounds/draw-sound.mp3");
const playerFactory = (name, current, marker, score, trophies, moves) => {
  return {
    name,
    current,
    marker,
    score,
    trophies,
    moves,
  };
};

const player1 = playerFactory("player 1", true, "🧙🏼‍♂️", 0, 0, []);
const player2 = playerFactory("player 2", false, "🧙🏼‍♀️", 0, 0, []);
const winningPatterns = [
  [1, 2, 3],
  [2, 5, 8],
  [1, 4, 7],
  [3, 6, 9],
  [7, 8, 9],
  [4, 5, 6],
  [1, 5, 9],
  [3, 5, 7],
];
let moves = [];
let countMoves = 0;
let draw = 0;
let roundOver = false;
let possibleMoves = [];
const playSound = () => {
  player2.current ? sound1.play() : sound2.play();
};
const resetGame = () => {
  roundOver = false;
  player1.moves = [];
  player2.moves = [];
  countMoves = 0;
  possibleMoves = [];
  moves = [];
  player1.current = true;
  player2.current = false;
  cells.forEach((cell) => {
    cell.innerHTML = "";
  });
};
const ai = () => {
  let allMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < moves.length; i++) {
    possibleMoves = allMoves.filter((pm) => !moves.includes(pm));
  }
  let aiMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  const cell = cells[aiMove - 1];
  moves.push(aiMove);
  addMove(player2, cell);
  if (roundOver && player2.score === 3) {
    playerWonGame(player2);
  } else if (roundOver && player2.score < 3) {
    return playerWonRound(player2);
  }
  if (countMoves === 9) {
    return drawRound();
  }
};
const turnIndicator = () => {
  player1.current
    ? ((icon1.style.animation = "up-and-down 1s infinite alternate"),
      (icon2.style.animation = ""))
    : ((icon2.style.animation = "up-and-down 1s infinite alternate"),
      (icon1.style.animation = ""));
};
const displayScores = () => {
  score1.innerHTML = player1.score;
  score2.innerHTML = player2.score;
};
const trophy = "🍄";
const displayTrophies = () => {
  trophies1.innerHTML = trophy.repeat(player1.trophies);
  trophies2.innerHTML = trophy.repeat(player2.trophies);
};

const isSubset = (array1, array2) =>
  array2.every((element) => array1.includes(element));

const endGame = () => {
  resetGame();
  turnIndicator();
  player1.score = 0;
  player2.score = 0;
  displayScores();
  draw = 0;
  scoreDraw.innerHTML = draw;
};
const addMove = (player, cell) => {
  countMoves += 1;
  moves.push(parseInt(cell.id));
  const marker = document.createElement("span");
  marker.textContent = player.marker;
  marker.classList.add("marker");
  cell.appendChild(marker);
  player.moves.push(parseInt(cell.id));
  player1.current = !player1.current;
  player2.current = !player2.current;
  turnIndicator();
  for (let i = 0; i < winningPatterns.length; i++) {
    if (isSubset(player.moves, winningPatterns[i])) {
      roundOver = true;
      player.score += 1;
      displayScores();
    }
  }
  return roundOver;
};

gameboard.addEventListener("click", (e) => {
  let cell = e.target;
  const currentPlayer = player1.current ? player1 : player2;
  if (cell.textContent == "") {
    addMove(currentPlayer, cell);

    if (roundOver && currentPlayer.score === 3) {
      return playerWonGame(currentPlayer);
    } else if (roundOver && currentPlayer.score < 3) {
      return playerWonRound(currentPlayer);
    }
    if (countMoves === 9) {
      return drawRound();
    } else return ai();
  }
});
const drawRound = () => {
  draw += 1;
  scoreDraw.innerHTML = draw;
  roundWinnerText.style.display = "block";
  roundWinnerText.textContent = `🌀 That's a draw !`;
  gameboard.style.pointerEvents = "none";
  setTimeout(() => {
    roundWinnerText.style.display = "none";
    gameboard.style.pointerEvents = "";
    roundWinnerText.textContent = "";
    resetGame();
    turnIndicator();
  }, "4000");
};
const playerWonRound = (player) => {
  playSound();
  roundWinnerText.style.display = "block";
  roundWinnerText.textContent = `${player.marker} won this round !`;
  gameboard.style.pointerEvents = "none";
  setTimeout(() => {
    roundWinnerText.style.display = "none";
    gameboard.style.pointerEvents = "";
    roundWinnerText.textContent = "";
    resetGame();
    turnIndicator();
  }, "4000");
  countMoves = 0;
};
const playerWonGame = (player) => {
  player.trophies += 1;
  displayTrophies();
  playSound();
  roundWinnerText.style.display = "block";
  roundWinnerText.textContent =
    player1 == player
      ? `${player1.marker} won a new trophy: ${trophy}`
      : `${player2.marker} won a new trophy: ${trophy}`;
  gameboard.style.pointerEvents = "none";
  setTimeout(() => {
    roundWinnerText.style.display = "none";
    gameboard.style.pointerEvents = "";
    roundWinnerText.textContent = "";
    endGame();
    turnIndicator();
  }, "4000");
};
restartBtn.addEventListener("click", () => {
  if (
    confirm(
      "you're about to restart the game, only the trophies will be saved. Do you confirm?"
    ) == true
  ) {
    endGame();
  }
});
displayTrophies();
turnIndicator();
