/*----- constants -----*/
  const suits = ["Hearts", "Diamond", "Clubs", "Spades"];
  const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  /*----- state variables -----*/

   let deck = []; 
   let playerHand = []; 
   let dealerHand = []; 
   let bankroll = 1000;
   let currentBet = 0;
   let winLoss = 0;

  /*----- cached elements  -----*/
const messageElement = document.getElementById('message'); 
const dealerHandElement = document.getElementById('dealer-hand'); 
const playerHandElement = document.getElementById('player-hand'); 
const bankrollElement = document.getElementById('bankroll'); 
const currentBetElement = document.getElementById('current-bet'); 
const winLossElement = document.getElementById('win-loss');

  /*----- event listeners -----*/


  /*----- functions -----*/
  function init() { 
    createDeck(); 
    shuffleDeck();
     playerHand = [];
      dealerHand = [];
       message.textContent = 'Game started. Deal cards!';
        updateHands();
       render() 
  }