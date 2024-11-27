/*----- constants -----*/


  /*----- state variables -----*/
// Array to hold the current deck of cards 
   let deck = []; 
// Arrays to hold the player's and dealer's hands
   let playerHand = []; 
   let dealerHand = []; 
// Variable to hold the message element 
   let messageElement;

  /*----- cached elements  -----*/


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