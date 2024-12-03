/*----- constants -----*/
const suits = ["s", "c", "d", "h"];
const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

/*----- state variables -----*/

let deck = [];
let playerHand = [];
let dealerHand = [];
let bankroll = 1000;
let currentBet = 0;
let winLoss = 0;

/*----- cached elements  -----*/
const messageElement = document.getElementById("message");
const dealerHandElement = document.getElementById("dealer-hand");
const playerHandElement = document.getElementById("player-hand");
const bankrollElement = document.getElementById("bankroll");
const currentBetElement = document.getElementById("current-bet");
const winLossElement = document.getElementById("win-loss");

/*----- event listeners -----*/

document.getElementById("deal-button").addEventListener("click", handleDeal);
document.getElementById("hit-button").addEventListener("click", handleHit);
document.getElementById("stand-button").addEventListener("click", handleStand);
document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("new-game-button").addEventListener("click", newGame);
document
  .getElementById("reset-bank-button")
  .addEventListener("click", resetBank);

/*----- functions -----*/
init();
function init() {
  createDeck();
  shuffleDeck();
  startGame();
  stakeMoney();
  playerHand = [];
  dealerHand = [];
  message.textContent = "Game started. Deal cards!";
  updateHands();
  hitStand();
  winnerLoser();
  newGame();
  resetBank();
  render();
}

// LET THE SHOW BEGIN
function createDeck() {
  deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ suit, value });
    });
  });
}