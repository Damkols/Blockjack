import React, { useEffect, useRef, useState } from "react";

const suits = ["♠", "♥", "♣", "♦"];
const values = [
  "A",
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
];

function CardModel() {
  return <div className="card"></div>;
}

function Card({ value, suit, isDealer }) {
  return (
    <div
      className={`card ${isDealer ? "back" : ""} ${
        suit === "♥" || suit === "♦" ? "text-red-500" : ""
      }`}
    >
      {value}
      {suit}
    </div>
  );
}

function Game() {
  const [allDecks, setAllDecks] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const dealerRef = useRef();
  const playerRef = useRef();

  const createCardModel = () => {
    return <CardModel />;
  };

  const [noticeText, setNoticeText] = useState("");
  const [noticeDisplay, setNoticeDisplay] = useState("none");
  const [buttonContainerDisplay, setButtonContainerDisplay] = useState("block");

  useEffect(() => {
    shuffleDecks(3);
    play();
  }, []);

  const createDeck = () => {
    const deck = [];
    suits.forEach((suit) => {
      values.forEach((value) => {
        const card = value + suit;
        deck.push(card);
      });
    });
    return deck;
  };

  const shuffleDecks = (num) => {
    for (let i = 0; i < num; i++) {
      const newDeck = createDeck();
      setAllDecks((prevAllDecks) => [...prevAllDecks, ...newDeck]);
    }
  };

  const chooseRandomCard = () => {
    const totalCards = allDecks.length;
    let randomNumber = Math.floor(Math.random() * totalCards);
    const randomCard = allDecks[randomNumber];
    allDecks.splice(randomNumber, 1);
    return randomCard;
  };

  const dealHands = async () => {
    const newDealerHand = [await chooseRandomCard(), await chooseRandomCard()];
    const newPlayerHand = [await chooseRandomCard(), await chooseRandomCard()];
    setDealerHand(newDealerHand);
    setPlayerHand(newPlayerHand);
    return { dealerHand: newDealerHand, playerHand: newPlayerHand };
  };

  const calcHandValue = (hand) => {
    let value = 0;
    let hasAce = false;
    hand.forEach((card) => {
      let cardValue =
        card.length === 2 ? card.substring(0, 1) : card.substring(0, 2);
      if (cardValue === "A") hasAce = true;
      else if (cardValue === "J" || cardValue === "Q" || cardValue === "K")
        value += 10;
      else value += Number(cardValue);
    });
    if (hasAce) value + 11 > 21 ? (value += 1) : (value += 11);
    return value;
  };

  const showNotice = (text) => {
    setNoticeText(text);
    setNoticeDisplay("flex");
    setButtonContainerDisplay("none");
  };

  const determineWinner = async () => {
    let playerValue = await calcHandValue(playerHand);
    let dealerValue = await calcHandValue(dealerHand);
    let text = `
        Your hand is ${playerHand} with a value of ${playerValue}.
        The dealers hand is ${dealerHand} with a value of ${dealerValue}.
        ${
          playerValue > dealerValue
            ? "<em>You win!</em>"
            : "<em>Dealer Wins!</em>"
        }
    `;
    showNotice(text);
  };

  const hitDealer = async () => {
    const hiddenCard = dealerRef.current.children[0];
    hiddenCard.classList.remove("back");
    hiddenCard.innerHTML = dealerHand[0];
    const card = await chooseRandomCard();
    setDealerHand((prevDealerHand) => [...prevDealerHand, card]);
    const newCard = createCardModel();
    newCard.innerHTML = card;
    dealerRef.current.append(newCard);
    let handValue = await calcHandValue(dealerHand);
    if (handValue <= 16) {
      hitDealer();
    } else if (handValue === 21) {
      showNotice("Dealer has 21! Dealer wins!");
    } else if (handValue > 21) {
      showNotice("Dealer bust! You win!");
    } else {
      determineWinner();
    }
  };

  const hitPlayer = async () => {
    const card = await chooseRandomCard();
    setPlayerHand((prevPlayerHand) => [...prevPlayerHand, card]);
    let handValue = await calcHandValue(playerHand);
    const newCard = createCardModel();
    newCard.innerHTML = card;
    playerRef.current.append(newCard);
    if (handValue <= 21) {
    } else {
      let text = `Bust! Your hand is ${playerHand} with a value of ${handValue}.`;
      showNotice(text);
    }
  };

  const clearHands = () => {
    while (dealerRef.current.children.length > 0) {
      dealerRef.current.children[0].remove();
    }
    while (playerRef.current.children.length > 0) {
      playerRef.current.children[0].remove();
    }
    return true;
    // setDealerHand([]);
    // setPlayerHand([]);
    // return true;
  };

  const play = async () => {
    if (allDecks.length < 10) shuffleDecks();
    clearHands();
    const { dealerHand, playerHand } = await dealHands();
    dealerHand.forEach((card, index) => {
      const newCard = createCardModel();
      (card[card.length - 1] === "♥" || card[card.length - 1] === "♦") &&
        newCard.setAttribute("data-red", true);
      index === 0 ? newCard.classList.add("back") : (newCard.innerHTML = card);
      dealerRef.current.append(newCard);
    });

    playerHand.forEach((card) => {
      const newCard = createCardModel();
      (card[card.length - 1] === "♥" || card[card.length - 1] === "♦") &&
        newCard.setAttribute("data-red", true);
      newCard.innerHTML = card;
      playerRef.current.append(newCard);
    });
    setNoticeDisplay("none");
    // setButtonContainerDisplay("block");
  };

  useEffect(() => {
    shuffleDecks(3);
    play();
  }, []);

  return (
    <div className="layout">
      <h2>Dealer Hand</h2>
      <div className="wrapper">
        <div className="cards" id="dealer" ref={dealerRef}>
          {/* Add React components for dealer cards */}
        </div>
      </div>
      <h2>Player Hand</h2>
      <div className="wrapper">
        <div className="cards" id="player" ref={playerRef}>
          {/* Add React components for player cards */}
        </div>
      </div>
      <div className="wrapper">
        <div className="container" id="button-container">
          <button id="hit" onClick={() => hitPlayer()}>
            Hit
          </button>
          <button id="pass" onClick={() => hitDealer()}>
            Pass
          </button>
        </div>
      </div>
      <div className="background" id="notice">
        <div className="notice">
          <p></p>
          <button id="next-hand" onClick={() => play()}>
            Deal Next Hand
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
