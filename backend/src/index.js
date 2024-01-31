// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const database = {
    players: [],
    scores: [],
    deck: [],
    cards: [],
    noOfPlayers: 0,
    listPlayers: [],
    newPlayer,
    addPlayer,
    firstRound,
    nextCard,
    newDeck,
    newCard,
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  //extract payload from data
  const payload = data["payload"];
  let JSONpayload = {};

  const payloadStr = viem.hexToString(payload);
  JSONpayload = JSON.parse(JSON.parse(payloadStr));
  console.log(`received request ${JSON.stringify(JSONpayload)}`);
  console.log(database)

  let advance_req;

  const SUITS = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];


  if (JSONpayload.method === "createCard") {
    if (JSONpayload.data.message == "" || null) {
        console.log("message cannot be empty");
        const result = JSON.stringify({
            error: String("Message:" + JSONpayload.data.message),
        });
        const hexresult = viem.stringToHex(result);
        await fetch(rollup_server + "/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payload: hexresult,
            }),
        })
    }

    console.log("creating card.....")

    const createCard = (rank, suit) => {
        const value = () => {
          if (rank === "Ace") {
            return 11;
          } else {
            try {
              return parseInt(rank) || 10;
            } catch {
              return 10;
            }
          }
        };
      
        const toString = () => {
          return `${rank} of ${suit}`;
        };
      
        return {
          rank,
          suit,
          value,
          toString,
        };
      };

      const newCard = createCard();
      database.newCard = newCard;

    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({payload: hexResult}),
    });

  }

  if (JSONpayload.method === "createDeck") {
    if (JSONpayload.data.message == "" || null) {
        console.log("message cannot be empty");
        const result = JSON.stringify({
            error: String("Message:" + JSONpayload.data.message),
        });
        const hexresult = viem.stringToHex(result);
        await fetch(rollup_server + "/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payload: hexresult,
            }),
        })
    }

    console.log("creating deck.....")

    const createDeck = () => {
        for (const suit of SUITS) {
          for (const rank of RANKS) {
            const card = database.newCard(rank, suit);
            database.cards.push(card);
          }
        }
    };

    const newDeck = createDeck();
    database.newDeck = newDeck;
    
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({payload: hexResult}),
    });

  }

  if (JSONpayload.method === "createPlayer") {
    if (JSONpayload.data.message == "" || null) {
        console.log("message cannot be empty");
        const result = JSON.stringify({
            error: String("Message:" + JSONpayload.data.message),
        });
        const hexresult = viem.stringToHex(result);
        await fetch(rollup_server + "/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payload: hexresult,
            }),
        })
    }

    console.log("creating player.....")

    const createPlayer = (name) => {
        const individsPlayer = {
            name: "",
            hand: [],
            score: 0,
        }
        const hand = [];
        let score = 0;
      
        const toString = () => {
          return `${name} has score ${score}`;
        };
      
        return {
          name,
          hand,
          individsPlayer,
          get score() {
            return score;
          },
          toString,
        };
      };

      const newPlayer = createPlayer(JSONpayload);
      database.newPlayer = newPlayer.individsPlayer;

    
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({payload: hexResult}),
    });

  }

  if (JSONpayload.method === "createGame") {
    if (JSONpayload.data.message == "" || null) {
        console.log("message cannot be empty");
        const result = JSON.stringify({
            error: String("Message:" + JSONpayload.data.message),
        });
        const hexresult = viem.stringToHex(result);
        await fetch(rollup_server + "/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payload: hexresult,
            }),
        })
    }

    console.log("creating game.....")

    const createGame = () => {
        const players = [];
        const scores = [];
        let deck = [];
      
        const addPlayer = () => {
          players.push(database.newPlayer);
        };
      
        const firstRound = () => {
          const newDeck = database.newDeck;
          deck = [...newDeck];
      
          const payloadNum = parseInt(ethers.toUtf8String(payload));
      
          if (players.length > 0) {
            for (let i = 0; i < payloadNum; i++) {
              for (const player of players) {
                const card = deck.shift();
                player.hand.push(card);
                player.score += card.value;
              }
            }
          } else {
            console.log('Add players to start the game');
          }
      
          for (const player of players) {
            if (player.score === 22) {
              player.hand[0].rank = "Ace-1";
              player.score = 12;
            }
            scores.push(player.score);
          }
        };
      
        const nextCard = (player) => {
          const card = deck.shift();
          database.newPlayer.hand.push(card);
          database.newPlayer.score += card.value;
      
          if (database.newPlayer.score > 21) {
            for (const card of database.newPlayer.hand) {
              if (card.rank === 'Ace') {
                card.rank = 'Ace-1';
                database.newPlayer.score -= 10;
                break;
              }
            }
          }
        };
      
        return {
          players,
          scores,
          deck,
          addPlayer,
          firstRound,
          nextCard,
        };
      };

    const game = createGame();
    database.addPlayer = game.addPlayer();
    database.firstRound = game.firstRound();
    database.nextCard = game.nextCard();
    database.players = game.players;
    database.scores = game.scores;
    database.deck = game.deck
      
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({payload: hexResult}),
    });

  }

  if (JSONpayload.method === "getNumberOfPlayers") {
    if (JSONpayload.data.message == "" || null) {
        console.log("message cannot be empty");
        const result = JSON.stringify({
            error: String("Message:" + JSONpayload.data.message),
        });
        const hexresult = viem.stringToHex(result);
        await fetch(rollup_server + "/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payload: hexresult,
            }),
        })
    }

    console.log("get number of players.....")

    const getNumberOfPlayers = () => {
        let number = prompt("Enter number of players: ");
        while (!Number.isInteger(Number(number))) {
            console.log('Please enter an integer');
            number = prompt("Enter number of players: ");
        }
        return Math.min(Number(number), 4);
    };
    const numberOfPlayers = getNumberOfPlayers();
    database.noOfPlayers = numberOfPlayers;
 
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({payload: hexResult}),
    });

  }

  if (JSONpayload.method === "getPlayers") {
    if (JSONpayload.data.message == "" || null) {
        console.log("message cannot be empty");
        const result = JSON.stringify({
            error: String("Message:" + JSONpayload.data.message),
        });
        const hexresult = viem.stringToHex(result);
        await fetch(rollup_server + "/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payload: hexresult,
            }),
        })
    }

    console.log("get players.....")

    const getPlayers = () => {
        numberOfPlayers = database.noOfPlayers;
        const listPlayers = [];
        for (let idx = 0; idx < numberOfPlayers; idx++) {
          const name = prompt(`Player ${idx + 1}, please enter your name: `);
          listPlayers.push(createPlayer(name));
        }
        listPlayers.push(createPlayer('The BANK'));
        return listPlayers;
      };
    

    const listPlayers = getPlayers();
    database.listPlayers = listPlayers;
 
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({payload: hexResult}),
    });

  }

  if (JSONpayload.method === "playGame") {
    if (JSONpayload.data.message == "" || null) {
        console.log("message cannot be empty");
        const result = JSON.stringify({
            error: String("Message:" + JSONpayload.data.message),
        });
        const hexresult = viem.stringToHex(result);
        await fetch(rollup_server + "/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payload: hexresult,
            }),
        })
    }

    console.log("playing game.....")

    const playGame = (game) => {
        for (const player of database.listPlayers) {
           database.addPlayer(player);
        }
        
        database.firstRound();
        
        for (const player of database.players) {
            console.log(`\n${player.name} has a ${player.hand[0]} and a ${player.hand[1]}\n the score is ${player.score}\n`);
        }
        
        let playerWantCards = database.listPlayers.length - 1;
        
        while (playerWantCards > 0) {
            for (const player of database.players.slice(0, database.listPlayers.length - 1)) {
            let valid = 1;
            while (valid === 1) {
                if (player.score > 21) {
                answer = 'n';
                } else {
                const answer = prompt(`${player.name}, do you want one more card [y/n]: `);
                if (answer === 'y') {
                    database.nextCard(player);
                    valid = 0;
                    console.log(`${player.name} received a ${player.hand[player.hand.length - 1]}.\n Your score is ${player.score}`);
                }
                if (answer === 'n') {
                    playerWantCards -= 1;
                    valid = 0;
                } else {
                    valid = 1;
                }
                }
            }
            }
        }
        
        while (database.players[database.players.length - 1].score < 18) {
          database.nextCard(database.players[database.players.length - 1]);
        }
        
        for (const player of database.players.slice(0, database.listPlayers.length - 1)) {
            if (player.score > 21) {
            console.log(`${player.name} is BUST with score ${player.score}.`);
            } else if (database.players[database.players.length - 1].score > 21) {
            console.log(`${player.name} wins with score ${player.score}.\n ${database.players[database.players.length - 1].name} is BUST with score ${database.players[database.players.length - 1].score}.`);
            } else if (player.score > database.players[database.players.length - 1].score) {
            console.log(`${player.name} wins with score ${player.score}.\n ${database.players[database.players.length - 1].name} has score ${database.players[database.players.length - 1].score}.`);
            } else {
            console.log(`${player.name} has lost with score ${player.score}.\n ${database.players[database.players.length - 1].name} has score ${database.players[database.players.length - 1].score}.`);
            }
        }
    };

    playGame();
 
    const result = JSON.stringify(database);
    const hexResult = viem.stringToHex(result);
    advance_req = await fetch(rollup_server + "/notice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({payload: hexResult}),
    });
  }
 
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
