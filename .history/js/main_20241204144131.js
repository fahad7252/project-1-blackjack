//----- constants -----
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

//----- state variables -----

let deck = [];
let playerHand = [];
let dealerHand = [];
let bankroll = 1000;
let currentBet = 0;
let winLoss = 0;

//----- cached elements  -----
const messageElement = document.getElementById("message");
const dealerHandElement = document.getElementById("dealer-hand");
const playerHandElement = document.getElementById("player-hand");
const bankrollElement = document.getElementById("bankroll");
const currentBetElement = document.getElementById("current-bet");
const winLossElement = document.getElementById("win-loss");

//----- event listeners -----

document.getElementById("deal-button").addEventListener("click", handleDeal);
document.getElementById("hit-button").addEventListener("click", handleHit);
document.getElementById("stand-button").addEventListener("click", handleStand);
document.getElementById("start-button").addEventListener("click", init);
document.getElementById("bet-5").addEventListener("click", () => placeBet(5));
document.getElementById("bet-10").addEventListener("click", () => placeBet(10));
document.getElementById("bet-25").addEventListener("click", () => placeBet(25));
document
  .getElementById("bet-100")
  .addEventListener("click", () => placeBet(100));
//document.getElementById("clear-bet").addEventListener("click", clearBet);
/*----- functions -----*/
/*init();
function init() {
  createDeck();
  shuffleDeck();
  startGame();
  stakeMoney();
  handleDeal();
  playerHand = [];
  dealerHand = [];
  message.textContent = "Game started. Deal cards!";
  updateHand(); // card elements and properties and value with css and new card
  calculateHand(); // will be doing the math
  settleBet(); // banks math
  draw(card); // push new card
  hitStand();
  winnerLoser();
  newGame();
  render();
}*/
function init() {
  createDeck();
  shuffleDeck();
  playerHand = [];
  dealerHand = [];
  currentBet = 0;
  gameState = "betting";
  messageElement.textContent = "Place your bet to start!";
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

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}
/*function updateHands() {
  playerHandElement.innerHTML = "";
  dealerHandElement.innerHTML = "";
  playerHand.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = `card ${card.suit[0].toLowerCase()}${card.value}`;
    playerHandElement.appendChild(cardElement);
  });
  dealerHand.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = `card ${card.suit[0].toLowerCase()}${card.value}`;
    dealerHandElement.appendChild(cardElement);
  });
}*/
//////
function updateHands() {
  playerHandElement.innerHTML = "";
  dealerHandElement.innerHTML = "";

  dealerHand.forEach((card, index) => {
    const cardElement = document.createElement("div");
    if (gameState === "playing" && index === 1) {
      cardElement.className = "card back";
    } else {
      let value = card.value;
      if (value === "10") value = "r10";
      else if (["2", "3", "4", "5", "6", "7", "8", "9"].includes(value))
        value = "r0" + value;
      cardElement.className = `card ${card.suit}${value}`;
    }
    dealerHandElement.appendChild(cardElement);
  });

  playerHand.forEach((card) => {
    const cardElement = document.createElement("div");
    let value = card.value;
    if (value === "10") value = "r10";
    else if (["2", "3", "4", "5", "6", "7", "8", "9"].includes(value))
      value = "r0" + value;
    cardElement.className = `card ${card.suit}${value}`;
    playerHandElement.appendChild(cardElement);
  });
}
///////

function drawCard() {
  return deck.pop();
}

function startGame() {
  // create draw card and update hands functions remain
  if (currentBet > 0) {
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];
    messageElement.textContent = "Hit or Stand";
    updateHands();
    render();
  } else {
    messageElement.textContent = " Place Bet to start the game ";
  }
}

function handleDeal() {
  if (currentBet > 0) {
    startGame();
  }
}

function handleHit() {
  playerHand.push(drawCard());
  if (calculateHand(playerHand) > 21) {
    messageElement.textContent = "Bust! Dealer wins";
    settleBet(false);
  } else {
    updateHands();
    render();
  }
}
function handleStand() {
  while (calculateHand(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }
  const playerTotal = calculateHand(playerHand);
  const dealerTotal = calculateHand(dealerHand);
  if (dealerTotal > 21 || playerTotal > dealerTotal) {
    messageElement.textContent = "you win";
    settleBet(true);
  } else if (playerTotal < dealerTotal) {
    messageElement.textContent = "dealer wins";
    settleBet(false);
  } else {
    messageElement = "its tie";
    settleBet(false, true);
  }
}

function calculateHand(hand) {
  let total = 0;
  let aceCount = 0;
  hand.forEach((card) => {
    if (["J", "Q", "K"].includes(card.value)) {
      total += 10;
    } else if (card.value === "A") {
      total += 11;
      aceCount++;
    } else {
      total += Number(card.value);
    }
  });
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }
  return total;
}
function settleBet(playerWins, tie = false) {
  if (tie) {
  } else if (playerWins) {
    bankroll += currentBet;
    winLoss += currentBet;
  } else {
    bankroll -= currentBet;
    winLoss -= currentBet;
  }
  currentBet = 0;
  updateBankroll();
  render();
}
function updateBankroll() {
  bankrollElement.textContent = `Bankroll: $${bankroll}`;
  currentBetElement.textContent = `Current Bet: $${currentBet}`;
  winLossElement.textContent = `Win/Loss: $${winLoss}`;
}
function stakeMoney() {
  currentBet = 0;
  currentBetElement.textContent = `CurrentBet: $${currentBet}`;
}
function render() {
  updateBankroll();
  updateHands();
}

init();

function init() {
  createDeck();
  shuffleDeck();
  render();
}