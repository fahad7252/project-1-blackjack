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
let gameState = "betting";
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

document.getElementById("bet-5").addEventListener("click", () => placeBet(5));
document.getElementById("bet-10").addEventListener("click", () => placeBet(10));
document.getElementById("bet-25").addEventListener("click", () => placeBet(25));
document
  .getElementById("bet-100")
  .addEventListener("click", () => placeBet(100));
document.getElementById("clear-bet").addEventListener("click", clearBet);

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

function updateHands() {
  playerHandElement.innerHTML = "";
  dealerHandElement.innerHTML = "";

  dealerHand.forEach((card, index) => {
    const cardElement = document.createElement("div");
    if (gameState === "playing" && index === 1) {
      cardElement.className = "card back";
    } else {
      cardElement.className = formatCardClass(card);
    }
    dealerHandElement.appendChild(cardElement);
  });

  playerHand.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = formatCardClass(card);
    playerHandElement.appendChild(cardElement);
  });
}

function formatCardClass(card) {
  const suitMap = { s: "spades", h: "hearts", d: "diamonds", c: "clubs" };
  let value = card.value;
  if (["2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(value)) {
    value = "r" + (value.length === 1 ? "0" : "") + value;
  }

  return `card ${suitMap[card.suit]} ${value}`;
}

function placeBet(amount) {
  if (gameState !== "betting" || amount > bankroll) return;
  bankroll -= amount;
  currentBet += amount;
  messageElement.textContent = `Bet placed: $${currentBet}. Deal to start!`;
  render();
}

function clearBet() {
  if (gameState !== "betting") return;
  bankroll += currentBet;
  currentBet = 0;
  render();
}

function drawCard() {
  if (deck.length < 10) {
    createDeck();
    shuffleDeck();
  }
  return deck.pop();
}

function startGame() {
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
  if (currentBet <= 0) {
    messageElement.textContent = "Place a bet first!";
    return;
  }
  startGame();
  gameState = "playing";
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  messageElement.textContent = "Hit or Stand?";
  render();
}

function handleHit() {
  if (gameState !== "playing") return;
  playerHand.push(drawCard());
  if (calculateHand(playerHand) > 21) {
    messageElement.textContent = "Bust! Dealer wins!";
    gameState = "finished";
    settleBet(false);
  }
  render();
}

function handleStand() {
  if (gameState !== "playing") return;
  while (calculateHand(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }

  const playerTotal = calculateHand(playerHand);
  const dealerTotal = calculateHand(dealerHand);

  if (dealerTotal > 21) {
    messageElement.textContent = "Dealer busts! You win!";
    settleBet(true);
  } else if (playerTotal > dealerTotal) {
    messageElement.textContent = "You win!";
    settleBet(true);
  } else if (dealerTotal > playerTotal) {
    messageElement.textContent = "Dealer wins!";
    settleBet(false);
  } else {
    messageElement.textContent = "Push!";
    settleBet(false, true);
  }
  gameState = "finished";
  render();
}

function calculateHand(hand) {
  let total = 0;
  let aces = 0;
  hand.forEach((card) => {
    if (["J", "Q", "K"].includes(card.value)) {
      total += 10;
    } else if (card.value === "A") {
      total += 11;
      aces++;
    } else {
      total += parseInt(card.value);
    }
  });
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function settleBet(playerWins, tie = false) {
  if (tie) {
    bankroll += currentBet;
  } else if (playerWins) {
    bankroll += currentBet * 2;
  }
  currentBet = 0;
  gameState = "betting";
  render();
}

function updateBankroll() {
  bankrollElement.textContent = bankroll;
  currentBetElement.textContent = currentBet;
  winLossElement.textContent = winLoss;
}

function render() {
  updateBankroll();
  updateHands();
}

init();
