import React, { useEffect } from "react";
import { FC } from "react";
import { useState } from "react";

import { Notices } from "../Notices";
import { Input } from "../Input";
import { Vouchers } from "../Vouchers";
import { Reports } from "../Reports";

const Card = ({ card }: { card: string }) => {
  return <img src={`./cards/${card}.png`} className="w-32" alt={card} />;
};

const Game: FC = () => {
  const [dappAddress, setDappAddress] = useState<string>(
    "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C"
  );

  const [dealerSum, setDealerSum] = useState<number>(0);
  const [yourSum, setYourSum] = useState<number>(0);
  const [dealerAceCount, setDealerAceCount] = useState<number>(0);
  const [yourAceCount, setYourAceCount] = useState<number>(0);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [yourCards, setYourCards] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string | null>(null);
  const [deck, setDeck] = useState<string[]>([]);
  const [canHit, setCanHit] = useState<boolean>(true);
  const [deckBuilt, setDeckBuilt] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await buildDeck();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (deckBuilt) {
      shuffleDeck();
      startGame();
    }
  }, [deckBuilt]);

  function buildDeck(): void {
    let values: string[] = [
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
    let types: string[] = ["C", "D", "H", "S"];
    let newDeck: string[] = [];

    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < values.length; j++) {
        newDeck.push(values[j] + "-" + types[i]);
      }
    }

    setDeck(newDeck);
    setDeckBuilt(true);
  }

  function shuffleDeck(): void {
    // Ensure deck is not empty
    if (deck.length === 0) {
      console.error("Deck is empty");
      return;
    }

    let newDeck: string[] = [...deck];

    for (let i = 0; i < newDeck.length; i++) {
      let j: number = Math.floor(Math.random() * newDeck.length);
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    console.log("new", newDeck);

    setDeck(newDeck);
  }

  // function startGame(): void {
  //   let newHidden: string = deck.pop() || "";
  //   setHidden(newHidden);
  //   setDealerSum(getValue(newHidden));
  //   setDealerCards([newHidden]); // Initialize as an array with the first card
  //   setDealerAceCount(checkAce(newHidden));

  //   while (dealerSum < 17) {
  //     let card: string = deck.pop() || "";
  //     setDealerSum((prevSum) => prevSum + getValue(card));
  //     setDealerAceCount((prevCount) => prevCount + checkAce(card));
  //     setDealerCards((prevCards) => [...prevCards, card]);
  //   }

  //   for (let i = 0; i < 2; i++) {
  //     let card: string = deck.pop() || "";
  //     setYourSum((prevSum) => prevSum + getValue(card));
  //     setYourAceCount((prevCount) => prevCount + checkAce(card));
  //     setYourCards((prevCards) => [...prevCards, card]);
  //   }
  // }

  function startGame(): void {
    // Initial dealer card
    let newHidden: string = deck.pop() || "";
    setHidden(newHidden);
    setDealerSum(getValue(newHidden));
    setDealerAceCount(checkAce(newHidden));

    // Remaining dealer cards
    let dealerCards: string[] = [];
    while (dealerSum < 17) {
      let card: string = deck.pop() || "";
      dealerCards.push(card);
      setDealerSum((prevSum) => prevSum + getValue(card));
      setDealerAceCount((prevCount) => prevCount + checkAce(card));
    }
    setDealerCards((prevCards) => [...prevCards, ...dealerCards]);

    // Your cards
    let yourCards: string[] = [];
    for (let i = 0; i < 2; i++) {
      let card: string = deck.pop() || "";
      yourCards.push(card);
      setYourSum((prevSum) => prevSum + getValue(card));
      setYourAceCount((prevCount) => prevCount + checkAce(card));
    }
    setYourCards((prevCards) => [...prevCards, ...yourCards]);
  }

  function hit(): void {
    if (!canHit) {
      return;
    }

    let card: string = deck.pop() || "";
    setYourSum((prevSum) => prevSum + getValue(card));
    setYourCards((prevCards) => [...prevCards, card]); // Update state with the new card
    setYourAceCount((prevCount) => prevCount + checkAce(card));

    if (reduceAce(yourSum, yourAceCount) > 21) {
      setCanHit(false);
    }
  }

  function stay(): void {
    let reducedDealerSum: number = reduceAce(dealerSum, dealerAceCount);
    let reducedYourSum: number = reduceAce(yourSum, yourAceCount);

    setCanHit(false);
    setHidden(hidden || ""); // ensure hidden is not null

    let message: string = "";
    if (reducedYourSum > 21) {
      message = "You Lose!";
    } else if (reducedDealerSum > 21) {
      message = "You win!";
    } else if (reducedYourSum === reducedDealerSum) {
      message = "Tie!";
    } else if (reducedYourSum > reducedDealerSum) {
      message = "You Win!";
    } else if (reducedYourSum < reducedDealerSum) {
      message = "You Lose!";
    }

    setDealerSum(reducedDealerSum);
    setYourSum(reducedYourSum);
    alert(message);
  }

  function getValue(card: string): number {
    let data: string[] = card.split("-");
    let value: string = data[0];

    if (isNaN(parseInt(value))) {
      if (value === "A") {
        return 11;
      }
      return 10;
    }

    return parseInt(value);
  }

  function checkAce(card: string): number {
    if (card[0] === "A") {
      return 1;
    }
    return 0;
  }

  function reduceAce(playerSum: number, playerAceCount: number): number {
    let newPlayerSum: number = playerSum;
    let newPlayerAceCount: number = playerAceCount;

    while (newPlayerSum > 21 && newPlayerAceCount > 0) {
      newPlayerSum -= 10;
      newPlayerAceCount -= 1;
    }

    return newPlayerSum;
  }
  return (
    <div>
      <main className="flex flex-col gap-5 mt-10 items-center justify-center">
        <div className="flex gap-48 mt-10">
          <div className="flex flex-col items-center gap-8">
            <h2 className="font-bold text-lg">
              Dealer: <span id="dealer-sum">{dealerSum}</span>
            </h2>
            <div className="flex justify-around gap-5" id="dealer-cards">
              <img
                id="hidden"
                src={`./cards/${hidden ? hidden : "BACK"}.png`}
                className="w-32"
              />
              {dealerCards.map((card, index) => (
                <Card key={index} card={card} />
              ))}
              {/* <img id="hidden" src="./cards/2-C.png" className="w-32" /> */}
            </div>
          </div>
          <div className="flex flex-col items-center gap-8">
            <h2 className="font-bold text-lg">
              You: <span id="your-sum">{yourSum}</span>
            </h2>
            <div className="flex justify-around gap-5" id="your-cards">
              {yourCards.map((card, index) => (
                <Card key={index} card={card} />
              ))}
            </div>
          </div>
        </div>
        <br />
        <div className="flex gap-10">
          <button
            className="p-3 font-bold border border-yellow-100 hover:border-yellow-300 hover:text-yellow-300 cursor-pointer rounded"
            onClick={hit}
            id="hit"
          >
            Hit
          </button>
          <button
            className="p-3 font-bold border border-yellow-100 hover:border-yellow-300 hover:text-yellow-300 cursor-pointer rounded"
            onClick={stay}
            id="stay"
          >
            Stay
          </button>
        </div>
        <p className="font-bold" id="results">
          Dealer bust. You win!
        </p>
      </main>
      <Input dappAddress={dappAddress} />
      <h2>Reports</h2>
      <Reports />
      <h2>Notices</h2>
      <Notices />
      <h2>Vouchers</h2>
      <Vouchers dappAddress={dappAddress} />
    </div>
  );
};

export default Game;
