const cells = document.querySelectorAll(".cell");
const score1 = document.getElementById("score-1");
const score2 = document.getElementById("score-2");
const scoreDraw = document.getElementById("draw-score");
const gameboard = document.getElementById("gameboard");
const restartBtn = document.getElementById("restart-btn");
const trophies1 = document.querySelector(".trophies-1");
const trophies2 = document.querySelector(".trophies-2");
const playerFactory = (name, current, marker, score, trophies, moves) => {
  const isWinner = () => alert(`${name} won a trophy!`);
  return {
    name,
    current,
    marker,
    score,
    trophies,
    moves,
    isWinner,
  };
};

const player1 = playerFactory("player 1", true, "x", 0, 0, []);
const player2 = playerFactory("player 2", false, "o", 0, 0, []);
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
let countMoves = 0;
let draw = 0;
let roundOver = false;
const resetGame = () => {
  player1.moves = [];
  player2.moves = [];
  countMoves = 0;
  player1.current = true;
  player2.current = false;
  cells.forEach((cell) => {
    cell.innerHTML = "";
  });
};
const displayScores = () => {
  score1.innerHTML = player1.score;
  score2.innerHTML = player2.score;
};
const trophy = "🏆";
const displayTrophies = () => {
  trophies1.innerHTML = trophy.repeat(player1.trophies);
  trophies2.innerHTML = trophy.repeat(player2.trophies);
};
const isSubset = (array1, array2) =>
  array2.every((element) => array1.includes(element));

const endGame = () => {
  resetGame();
  player1.score = 0;
  player2.score = 0;
  displayScores();
  draw = 0;
  scoreDraw.innerHTML = draw;
};
gameboard.addEventListener("click", (e) => {
  let cell = e.target;
  const currentPlayer = player1.current ? player1 : player2;
  if (cell.textContent == "") {
    countMoves += 1;
    const marker = document.createElement("span");
    marker.textContent = currentPlayer.marker;
    marker.classList.add("marker");
    cell.appendChild(marker);
    currentPlayer.moves.push(parseInt(cell.id));
    player1.current = !player1.current;
    player2.current = !player2.current;
    for (let i = 0; i < winningPatterns.length; i++) {
      if (isSubset(currentPlayer.moves, winningPatterns[i])) {
        roundOver = true;
      }
    }
    if (roundOver) {
      currentPlayer.score += 1;
      resetGame();
      displayScores();
      roundOver = false;
    }
    if (countMoves === 9) {
      resetGame();
      draw += 1;
      scoreDraw.innerHTML = draw;
    }
    if (currentPlayer.score === 3) {
      currentPlayer.isWinner();
      currentPlayer.trophies += 1;
      endGame();
      displayTrophies();
    }
  }
});
restartBtn.addEventListener("click", () => {
  if (confirm("you're about to restart the game, are you sure?") == true) {
    endGame();
  }
});
displayTrophies();
