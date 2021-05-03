import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  Modal,
  TextInput,
  BackHandler,
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import firebase from "firebase";

import GameView from "./GameAnimation/GameSetting";
import Deck from "../decks";
const gameDeck = new Deck();

import CardDealing from "./GameAnimation/cardDealing";

export default class GameSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      matchName: "",
      matchType: "",
      game: {},
      myCards: [],
      playerNum: 0, //fake value

      deck: [],
      user: {},
      fullMatchName: "",
      host: false,
      ready: false,
      newPlayer: true,
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const fullMatchName = this.props.userData.in_game;
    if (fullMatchName === "") {
      Alert.alert("You have not Joined/Created Game. Going back to Home Page");
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
      this.props.navigation.navigate("LandingPage");
    }

    var indexOfType = fullMatchName.indexOf("_");
    const matchType = fullMatchName.substring(0, indexOfType);
    const matchName = fullMatchName.substring(indexOfType + 1);

    this.setState({
      fullMatchName: fullMatchName,
      matchType: matchType,
      matchName: matchName,
    });
    this.gameData(matchType, fullMatchName);
  }

  async gameData(matchType, matchName) {
    firebase
      .database()
      .ref("/games/" + matchType + "/" + matchName)
      .on("value", (snapshot) => {
        const data = snapshot.val();
        console.log("game updated");
        this.checkHost(data);
        this.setState({ game: data }, () => this.gameTurnAction());

        //this.checkHost(data)
      });
  }

  checkHost(game) {
    //var game = this.state.game
    if (!this.state.host) {
      var playerNum = game.players.indexOf(
        this.props.userData.username.slice(
          0,
          this.props.userData.username.indexOf("#")
        )
      );
      var newPlayer = false;

      if (this.state.newPlayer) {
        //newPlayer is True by default
        if (playerNum >= game.size - game.newPlayer) {
          newPlayer = true;
        } else {
          newPlayer = false;
        }
      }
      this.setState({
        host: playerNum == 0,
        playerNum: playerNum,
        newPlayer: newPlayer,
      });
    }
  }

  /*
  turn = 0 //initial, shuffle cards and upload to database, 
  turn = 1 //buy in phase and distrute cards to players
  turn = 2 //place 3 cards on board, and players can fold/raise/check/call 
  turn = 3 //place 4th card, bet
  turn = 4 //place 5th card, bet
  turn = 5 //show cards, last turn and winner takes pot. RESET turn to 0
  */

  async gameTurnAction() {
    //check if all players are ready, by seeing if any player is not ready
    var game = { ...this.state.game };
    //check if start of game turn.

    if (this.state.host) {
      console.log("game.turn = ", game.turn);
      var updates = {};
      const matchPath =
        "/games/" + this.state.matchType + "/" + this.state.fullMatchName;

      if (game.turn == 0) {
        if (game.newPlayer > 0) {
          for (var i = 0; i < game.newPlayer; i++) {
            game.wins.push(0);
            game.chipsIn.push(0);
            game.chipsLost.push(0);
            game.chipsWon.push(0);
            game.move.push("check");
            game.ready.push(false);
          }

          updates[matchPath + "/wins"] = game.wins;
          updates[matchPath + "/move"] = game.move;
          updates[matchPath + "/chipsWon"] = game.chipsWon;
          updates[matchPath + "/chipsLost"] = game.chipsLost;
          updates[matchPath + "/chipsIn"] = game.chipsIn;
          updates[matchPath + "/ready"] = game.ready;
          updates[matchPath + "/newPlayer"] = 0;
        } else if (game.size == 1 || 
          Math.min(...game.balance) < game.blindAmount) {
          //don't move wait?
        } else {
          var cards = await this.giveOutCards();
          game.player_cards = cards[0];
          game.deck = cards[1];
          game.turn++;

          updates[matchPath + "/player_cards"] = game.player_cards;
          updates[matchPath + "/deck"] = game.deck;
          updates[matchPath + "/turn"] = game.turn;

          //prepare for game.turn == 1
          this.setState({
            myCards: game.player_cards[this.state.playerNum].myCards,
          });
        }
      } else if (game.turn < 5) {
        const allPlayersFolded = //does all players who folded or all in
          game.move.filter((move) => move != "fold" && move != "all in").length == 1;
        //^This line also works when the game.size is 1, thus ending the current round, and wait for new players.
        const allPlayersReady = !game.ready.includes(false);

        if (allPlayersReady || allPlayersFolded) {
          if (allPlayersFolded) {
            updates[matchPath + "/turn"] = 5;
          } else {
            if (game.turn < 4) {
              if (game.turn == 1) {
                //prep for turn 2
                game.board = game.deck.splice(0, 3);
              } else {
                //prep for turn 3 and 4
                game.board.push(...game.deck.splice(0, 1));
              }

              updates[matchPath + "/board"] = game.board;
              updates[matchPath + "/deck"] = game.deck;
            }
            game.turn++;
            updates[matchPath + "/turn"] = game.turn;
          }

          updates[matchPath + "/ready"] = game.ready.fill(false);
          updates[matchPath + "/raisedVal"] = 0;
        }
      } else if (game.turn == 5) {
        game.size -= game.newPlayer;

        // Figure out who won and give them pot
        // Could make an array called roundWinners that hold all winners with equal rank and give them all balance and chipsWon
        const roundWinner = 0 //await this.findRoundWinner(game);
        console.log("202: ", roundWinner);
        game.balance[roundWinner] += game.pot;
        game.chipsWon[roundWinner] += game.pot;
        game.wins[roundWinner] += 1;
        game.round++;

        for (var i = 0; i < game.size; i++) {
          if (i != roundWinner) {
            game.chipsLost[i] += game.chipsIn[i];
          }
        }

        game.smallBlindLoc += 1;
        game.playerTurn = game.smallBlindLoc;

        if (game.playerTurn == game.size) {
          game.playerTurn = 0;
        }
        if (game.smallBlindLoc > game.size) {
          game.smallBlindLoc = 1;
          game.playerTurn = 1;
        }

        updates[matchPath + "/move"] = game.move.fill("check");
        updates[matchPath + "/playerTurn"] = game.playerTurn;
        updates[matchPath + "/balance"] = game.balance;
        updates[matchPath + "/round"] = game.round;
        updates[matchPath + "/wins"] = game.wins;
        updates[matchPath + "/chipsWon"] = game.chipsWon;
        updates[matchPath + "/chipsLost"] = game.chipsLost;
        updates[matchPath + "/chipsIn"] = game.chipsIn.fill(0);
        updates[matchPath + "/pot"] = 0;
        updates[matchPath + "/raisedVal"] = 0;
        updates[matchPath + "/smallBlindLoc"] = game.smallBlindLoc;
        updates[matchPath + "/ready"] = game.ready.fill(false);
        updates[matchPath + "/turn"] = 0;
        updates[matchPath + "/board"] = "";
      } else {
        console.log("Something Wrong with GameTurnAction in GameController");
      }

      if (Object.keys(updates).length > 0) {
        firebase.database().ref().update(updates);
      }
    } else {
      //all players but host
      if (this.state.newPlayer) {
        this.setState({ myCards: [{ suit: "wait", value: "wait" }] });
      } else if (game.turn == 1) {
        this.setState({
          myCards: game.player_cards[this.state.playerNum].myCards,
        });
      }
    }
    this.setState({ ready: true });
  }

  async findRoundWinner(game) {
    // Assign ranks for players before sorting ranks in hand[] array

    // Loop through all players and assign them a rank
    game.size -= game.newPlayer;
    for (var i = 0; i < game.size; i++) {
      console.log("Assign Ranks loop reached");
      var position = i;
      if (this.isRoyalFlush(game, position)) {
        game.player_cards[i].rank = 1;
        console.log("Royal Flush", game.player_cards[i].rank);
      } else if (this.isStraightFlush(game, position)) {
        game.player_cards[i].rank = 2;
        console.log("Straight Flush", game.player_cards[i].rank);
      } else if (this.isFourOfKind(game, position)) {
        game.player_cards[i].rank = 3;
        console.log("4 Kind", game.player_cards[i].rank);
      } else if (this.isFullHouse(game, position)) {
        game.player_cards[i].rank = 4;
        console.log("Full House", game.player_cards[i].rank);
      } else if (this.isFlush(game, position)) {
        game.player_cards[i].rank = 5;
        console.log("Flush", game.player_cards[i].rank);
      } else if (this.isStraight(game, position)) {
        game.player_cards[i].rank = 6;
        console.log("Straight", game.player_cards[i].rank);
      } else if (this.isThreeOfKind(game, position)) {
        game.player_cards[i].rank = 7;
        console.log("3 Kind", game.player_cards[i].rank);
      } else if (this.isTwoPair(game, position)) {
        game.player_cards[i].rank = 8;
        console.log("Two Pair", game.player_cards[i].rank);
      } else if (this.isOnePair(game, position)) {
        game.player_cards[i].rank = 9;
        console.log("One Pair", game.player_cards[i].rank);
      } else if (this.isHighCard(game, position)) {
        game.player_cards[i].rank = 10;
        console.log("High Card", game.player_cards[i].rank);
      }
    }

    console.log("This is rank at all indexes: ", game.player_cards[0].rank);

    //  hands is an array of players with game.players_cards[i].rank sorted by highest rank to lowest (1, 2, 3, 4, 5, 6, 7, 8, 9, 10 hand rankings in order)
    var hands = game.player_cards.sort(function (a, b) {
      return a.rank - b.rank;
    }); //sorts from small to high
    console.log("Hands array sorted!", hands);

    var handsNotFolded = []; // An array of hand rankings of players that have not folded
    for (var i = 0; i < game.size; i++) {
      // Loop through all players
      if (game.move[i] != "fold") {
        // If the player at position "i" has not folded they can move into the hNF array
        handsNotFolded.push(hands[i]);
      }
      // else i++? Something should be here to fix if the first player or [0] index folds causing loop to crash/break
    }
    console.log("HNF: ", handsNotFolded);

    var highestRank = handsNotFolded[0].rank;
    console.log("highestRank before being found is: ", highestRank);
    var indexHighestHands = []; // An array of the same highest ranks as INDEXES
    var highestHands = []; // An array of hands with the same highest ranks
    for (var i = 0; i < handsNotFolded.length; i++) {
      if (handsNotFolded[i].rank < highestRank) {
        // Use less than < here because 1 as a rank is bigger than 10
        console.log("finding highest rank loop reached");
        highestRank = handsNotFolded[i].rank; // Loop through all hands to find highest/max rank
      }
    }
    console.log("highestRank after being found is: ", highestRank);

    for (var i = 0; i < handsNotFolded.length; i++) {
      if (highestRank == handsNotFolded[i].rank) {
        console.log("find who has highest ranks");
        indexHighestHands.push(i); // Loop through all hands to find all players with highest/max rank

        console.log("populating highestHands with players who have same ranks");
        highestHands.push(handsNotFolded[i]); // Loop through to make an array of hands with same high ranks
      }
    }
    console.log("indexHighestHands contents: ", indexHighestHands);
    console.log("highestHands contents: ", highestHands);

    var roundWinner = 0;
    var rW = 0;
    if (indexHighestHands.length == 1) {
      rW = indexHighestHands[0]; // Only 1 person with the highest rank, then they are winner
      roundWinner = rW;
      console.log("Only one player has the highest rank: ", handsNotFolded);
    }
    if (indexHighestHands.length > 1) {
      console.log(
        "Calling findHighestHand() to determine higher value hand of ranks - highestHands: ",
        highestHands
      );
      rW = this.findHighestHand(highestHands, indexHighestHands);
      roundWinner = rW;
      console.log("rW and roundWinner respectively: ", rW, roundWinner);

      //indexOfHighestRanks would be [0,3] or [1,2,3] or whatever amount of players have same # of cards
      //game.player_cards is [{rank: 2, myCards: [Card, Card]}, {rank: 2, myCards: [Card, Card]}]
      //Card = {suit: 'heart', value: '3', image: 'somefilepath'}
    }
    console.log("Round winner is: ", roundWinner);
    return roundWinner;
  }

  findHighestHand(highestHands, indexHighestHands) {
    console.log("findHighestHand called...finding highest hand value...");

    var allHands = [];
    for (var i = 0; i < highestHands.length; i++) {
      // Populate allHands with all the players cards
      //console.log("highestHands 402 ",highestHands[i].myCards);
      allHands.push(highestHands[i].myCards);
      console.log("allHands[" + i.toString() + "]: ", allHands[i]);
      //[ [[suit, value],[suit value]], [[suit, value],[suit value]] ]
    } //[[j,9],[10,a]]
    console.log("allHands: ", allHands);
    var aH = allHands.flat();
    console.log("aH: ", aH);
    var intAllHands = [];
    for (var i = 0; i < aH.length; i++) {
      intAllHands[i] = parseInt(aH[i].value);
      if (aH[i].value == "J") {
        intAllHands[i] = 11;
      }
      else if (aH[i].value == "Q") {
        intAllHands[i] = 12;
      }
      else if (aH[i].value == "K") {
        intAllHands[i] = 13;
      }
      else if (aH[i].value == "A") {
        intAllHands[i] = 14;
      }
      console.log("intAllHands[" + i.toString() + "]: ", intAllHands);
    }
    console.log("intAllHands: ", intAllHands);

    var valueOfHands = [];
    for (var i = 0; i < intAllHands.length; i += 2) {
      valueOfHands.push(intAllHands[i] + intAllHands[i + 1]);
      console.log(
        "valueOfHands[" + (i / 2).toString() + "]: ",
        valueOfHands[i / 2]
      );
    }
    console.log("valueOfHands: ", valueOfHands);

    var max = 0;
    var index = 0;
    for (var i = 0; i < valueOfHands.length; i++) {
      if (valueOfHands[i] > max) {
        max = valueOfHands[i];
        index = i;
        console.log("max: ", max);
        console.log("index and " + i.toString() + ": ", index, i);
      }
    }
    var rWHH;
    rWHH = indexHighestHands[index];
    console.log("rWHH or winner is at index: ", rWHH);
    return rWHH;
  }


  // Rank 1
  isRoyalFlush(game, position) {
    console.log("isRoyalFlush() called");
    var completeCards = [];
    completeCards.push(game.player_cards[position].myCards);
    completeCards.push(game.board);
    var hand = completeCards.flat();

    // Sort the array by the values (selection sort)
    for (var i = 0; i < hand.length; i++) {
      var max = i;
      for (var j = i + 1; j < hand.length; j++) {
        if (hand[j] > hand[max]) {
          max = j;
        }
      }
      // Swap
      if (max != i) {
        var temp = hand[i];
        hand[i] = hand[max];
        hand[max] = temp;
      }
    }
    console.log("isRoyalFlush Hand is populated, contents: ", hand);
    var aceCheck = false;
    var kingCheck = false;
    var queenCheck = false;
    var jackCheck = false;
    var tenCheck = false;
    var previousSuit = "";

    // Because the array is sorted by the "value" of the rank/value (not necessarily Ace first), find the Ace and its suit to compare against the rest
    for (var i = 0; i < hand.length; i++) {
      if (hand[i].value == "A") {
        var previousSuit = hand[i].suit;
        aceCheck = true;
      }
    }
    // Now check the rest of the hand for royal condition and if they are the same suit as the Ace
    for (var i = 0; i < hand.length; i++) {
      if (hand[i].value == "K" && hand[i].suit == previousSuit) {
        kingCheck = true;
      }
      if (hand[i].value == "Q" && hand[i].suit == previousSuit) {
        queenCheck = true;
      }
      if (hand[i].value == "J" && hand[i].suit == previousSuit) {
        jackCheck = true;
      }
      if (hand[i].value == "10" && hand[i].suit == previousSuit) {
        tenCheck = true;
      }
    }
    var royalCheck = false;
    console.log(
      "Suit for Royal: ",
      previousSuit,
      aceCheck,
      kingCheck,
      queenCheck,
      jackCheck,
      tenCheck
    );
    if (aceCheck && kingCheck && queenCheck && jackCheck && tenCheck) {
      royalCheck = true;
    }

    var straightFlushCheck = false;
    if (this.isStraightFlush(game, position)) {
      straightFlushCheck = true;
    }

    if (royalCheck && straightFlushCheck) {
      console.log(
        "Congratulations, Royal Flush!",
        royalCheck,
        straightFlushCheck
      );
      return true;
    }
    return false;
  }

  // Rank 2 - Five cards in a row all suit
  isStraightFlush(game, position) {
    console.log("isStraightFlush() called");
    if (this.isStraight(game, position) && this.isFlush(game, position)) {
      console.log("True returned isStraightFlush()");
      return true;
    }
    return false;
  }

  // Rank 3 - Same value in each suit
  isFourOfKind(game, position) {
    console.log("isFourOfKind() called");
    var completeCards = [];
    completeCards.push(game.player_cards[position].myCards);
    completeCards.push(game.board);
    var hand = completeCards.flat();
    console.log("isFourfKind hands is populated, contents: ", hand);

    // Loop through hand array to see if 4 cards have the same value (4 of a kind) then return true if so
    var counter = 1;
    for (var i = 0; i < hand.length - 2 && counter != 4; i++) {
      //console.log("Outer loop: ", "i is ", i, "counter is ", counter)
      counter = 1;
      for (var j = i + 1; j < hand.length; j++) {
        //console.log("Inner loop: ", "i is ", i, "j is ", j, "counter is ", counter)
        if (hand[i].value == hand[j].value) {
          counter++;
          //console.log("Inner if reached ", counter)
        }
      }
    }

    if (counter == 4) {
      console.log("True returned for isFourOfKind()");
      return true;
    }
  }

  //Rank 4 - A pair and three of kind
  isFullHouse(game, position) {
    console.log("isFullHouse() called");
    var completeCards = [];
    completeCards.push(game.player_cards[position].myCards);
    completeCards.push(game.board);
    var hand = completeCards.flat();
    var intHand = [];

    // Convert the array to numerical/int values to sort
    for (var i = 0; i < hand.length; i++) {
      intHand[i] = parseInt(hand[i].value);
      if (hand[i].value == "J") {
        intHand[i] = 11;
      }
      if (hand[i].value == "Q") {
        intHand[i] = 12;
      }
      if (hand[i].value == "K") {
        intHand[i] = 13;
      }
      if (hand[i].value == "A") {
        intHand[i] = 14;
      }
    }

    // Sort the array by the values (selection sort)
    for (var i = 0; i < intHand.length; i++) {
      var max = i;
      for (var j = i + 1; j < intHand.length; j++) {
        if (intHand[j] > intHand[max]) {
          max = j;
        }
      }
      // Swap
      if (max != i) {
        var temp = intHand[i];
        intHand[i] = intHand[max];
        intHand[max] = temp;
      }
    }
    console.log(
      "isFullHouse intHands is populated and sorted by value, contents: ",
      intHand
    );

    // Check for three of a kind and record the value to be checked again in the check for pair loop
    var counter = 1;
    var previousValue = 0;
    for (var i = 0; i < intHand.length - 2 && counter != 3; i++) {
      // console.log("Outer loop: ", "i is ", i, "counter is ", counter)
      counter = 1;
      for (var j = i + 1; j < intHand.length; j++) {
        // console.log("Inner loop: ", "i is ", i, "j is ", j, "counter is ", counter)
        if (intHand[i] == intHand[j]) {
          counter++;
          previousValue = intHand[i];
          // console.log("Inner if reached ", counter)
        }
      }
    }
    console.log("Previous value: ", previousValue);

    var isThree = false;
    if (counter == 3) {
      isThree = true;
    }

    // Check for a pair with the three kind's value in mind
    var isTwo = false;
    for (var i = 0; i < intHand.length; i++) {
      for (var j = i + 1; j < intHand.length; j++) {
        if (
          intHand[i] == intHand[j] &&
          intHand[i] != previousValue &&
          intHand[j] != previousValue
        ) {
          isTwo = true;
        }
      }
    }
    console.log("isTwo value: ", isTwo, "isThree value: ", isThree);
    if (isThree && isTwo) {
      return true;
    }
  }

  // Rank 5 - Five cards all same suit but not in numerical order
  isFlush(game, position) {
    console.log("isFlush() called");
    var completeCards = [];
    completeCards.push(game.player_cards[position].myCards);
    completeCards.push(game.board);
    var hand = completeCards.flat();
    console.log("isFlush hands is populated, contents: ", hand);

    // Sort the hands array by the suits (selection sort)
    for (var i = 0; i < hand.length; i++) {
      var min = i;
      for (var j = i + 1; j < hand.length; j++) {
        if (hand[j].suit < hand[min].suit) {
          min = j;
        }
      }
      // Swap
      var temp = hand[i];
      hand[i] = hand[min];
      hand[min] = temp;
    }

    var diamond = "♦";
    var diamondCounter = 0;

    var heart = "♥";
    var heartCounter = 0;

    var spade = "♠";
    var spadeCounter = 0;

    var club = "♣";
    var clubCounter = 0;
    for (var i = 0; i < hand.length; i++) {
      if (hand[i].suit == diamond) {
        console.log("isFlush() Diamond found");
        diamondCounter++;
      }
      if (hand[i].suit == heart) {
        console.log("isFlush() Heart found");
        heartCounter++;
      }
      if (hand[i].suit == spade) {
        console.log("isFlush() Spade found");
        spadeCounter++;
      }
      if (hand[i].suit == club) {
        console.log("isFlush() Club found");
        clubCounter++;
      }
      if (
        diamondCounter == 5 ||
        heartCounter == 5 ||
        spadeCounter == 5 ||
        clubCounter == 5
      ) {
        console.log("Flush found, returning true for isFlush()");
        return true;
      }
    }
  }

  // Rank 6 - Five cards in numerical order, but not of same suit
  isStraight(game, position) {
    console.log("isStraight() called");
    var completeCards = [];
    completeCards.push(game.player_cards[position].myCards);
    completeCards.push(game.board);
    var hand = completeCards.flat();
    var intHand = [];

    // Convert the array to numerical/int values to sort
    for (var i = 0; i < hand.length; i++) {
      intHand[i] = parseInt(hand[i].value);
      if (hand[i].value == "J") {
        intHand[i] = 11;
      }
      if (hand[i].value == "Q") {
        intHand[i] = 12;
      }
      if (hand[i].value == "K") {
        intHand[i] = 13;
      }
      if (hand[i].value == "A") {
        intHand[i] = 14;
      }
    }

    // Sort the array by the values (selection sort)
    for (var i = 0; i < intHand.length; i++) {
      var max = i;
      for (var j = i + 1; j < intHand.length; j++) {
        if (intHand[j] > intHand[max]) {
          max = j;
        }
      }
      // Swap
      if (max != i) {
        var temp = intHand[i];
        intHand[i] = intHand[max];
        intHand[max] = temp;
      }
    }
    console.log(
      "isStraight intHands is populated and sorted by value, contents: ",
      intHand
    );

    // Make an array removing duplicates (makes checking for straight easier)
    var uniqueHand = [...new Set(intHand)];
    console.log("uniqueHand is: ", uniqueHand);
    var counter = 0;
    // Check for decreasing values (straight)
    if (uniqueHand.length >= 5) {
      // A straight can only be made with 5 cards so the unique hand needs at least 5 cards
      console.log("uniqueHand[] has 5+ cards - checking for straight");
      for (var i = 1; i < uniqueHand.length; i++) {
        // Loop through unique hand
        if (
          counter >= 1 &&
          counter < 4 &&
          uniqueHand[i] - uniqueHand[i - 1] != -1
        ) {
          // Check for promising sequence
          console.log(
            "Promising sequence failed, ",
            uniqueHand[i],
            "-",
            uniqueHand[i - 1],
            "returning false"
          );
          return false;
        }
        if (uniqueHand[i] - uniqueHand[i - 1] == -1) {
          counter++;
        } // Count how many times a sequence (e.g 14 13 or 9 8) is found
        if (counter >= 4) {
          console.log("Counter is 4+ returning true");
          return true;
        }
        console.log("counter is: ", counter);
      }
    }
    console.log("Straight never found - returning false");
    return false;
  }

  // Rank 7 - Three of one card and two-non paired cards
  isThreeOfKind(game, position) {
    console.log("isThreeOfKind() called");
    var completeCards = [];
    completeCards.push(game.player_cards[position].myCards);
    completeCards.push(game.board);
    var hand = completeCards.flat();
    console.log("isThreeOfKind hands is populated, contents: ", hand);

    // Loop through hand array to see if 3 cards have the same value (3 of a kind) then return true if so
    var counter = 1;
    for (var i = 0; i < hand.length - 2 && counter != 3; i++) {
      //console.log("Outer loop: ", "i is ", i, "counter is ", counter)
      counter = 1;
      for (var j = i + 1; j < hand.length; j++) {
        //console.log("Inner loop: ", "i is ", i, "j is ", j, "counter is ", counter)
        if (hand[i].value == hand[j].value) {
          counter++;
          //console.log("Inner if reached ", counter)
        }
      }
    }

    if (counter == 3) {
      console.log("True returned for isThreeOfKind()");
      return true;
    }
  }

  // Rank 8 - Two different pairings or sets of the same card in one hand
  isTwoPair(game, position) {
    console.log("isTwoPair() called");
    var completeCards = [];
    completeCards.push(game.player_cards[position].myCards);
    completeCards.push(game.board);
    var hand = completeCards.flat();
    console.log("isTwoPair hands is populated, contents: ", hand);
    var match = 0;
    for (var i = 0; i < hand.length; i++) {
      for (var j = i + 1; j < hand.length; j++) {
        if (hand[i].value == hand[j].value) {
          match++;
          console.log("Match: ", match);
        }
      }
      if (match >= 2) {
        console.log("True returned for isTwoPair()");
        return true;
      }
    }
  }

  // Rank 9 - One pairing of the same card
  isOnePair(game, position) {
    console.log("isOnePair() called");
    var completeCards = []; // Array holding both player and board cards
    completeCards.push(game.player_cards[position].myCards); // Player cards
    completeCards.push(game.board); // Board cards
    var hand = completeCards.flat(); // Flatten the array to iterate through
    console.log("isOnePair hands is populated, contents: ", hand);
    for (var i = 0; i < hand.length; i++) {
      for (var j = i + 1; j < hand.length; j++) {
        if (hand[i].value == hand[j].value) {
          // One pair if two cards same value
          console.log("Return 9");
          return true;
        }
      }
    }
    console.log("False returned for isOnePair()");
    return false;
  }

  // Rank 10 - High card - no matching cards
  isHighCard(game, position) {
    console.log("isHighCard() called");
    var completeCards = [];
    completeCards.push(game.player_cards[position].myCards);
    completeCards.push(game.board);
    var hand = completeCards.flat();
    console.log("isHighCard hands is populated, contents: ", hand);
    var match = 0; // If match is > 1 then a match has been found at least once meaning no high card but higher rank
    for (var i = 0; i < hand.length; i++) {
      for (var j = i + 1; j < hand.length; j++) {
        if (hand[i].value == hand[j].value) {
          match++;
          console.log("Match: ", match);
        }
      }
    }
    if (match > 0) {
      return false;
    } else {
      return true;
    }
  }

  async giveOutCards() {
    gameDeck.shuffle();

    var playerDecks = [];
    for (var i = 0; i < this.state.game.size * 2; i += 2) {
      playerDecks.push([gameDeck.cards.shift(), gameDeck.cards.shift()]);
    }
    //output: [ [card, card], [card, card] ]
    this.setState({ myCards: playerDecks[0] });

    var playerRanks = playerDecks.map((cards) => {
      var obj = {
        rank: 10,
        myCards: cards,
      };
      return obj;
    });
    //example output: [{rank: 10, myCards: [Card, Card]}, {rank: 10, myCards: [Card, Card]}]

    var deck = [];
    for (var i = 0; i < 5; i++) {
      deck.push(gameDeck.cards.shift());
    }
    //this.setState({deck: deck})
    //console.log(playerRanks, deck, 'GameDeck, /n',gameDeck)
    return [playerRanks, deck];
  }

  updateGame(keys, newGameData, matchType, fullMatchName) {
    var updates = {};
    var matchLocation = "/games/" + matchType + "/" + fullMatchName + "/";

    for (var i = 0; i < keys.length; i++) {
      updates[matchLocation + keys[i]] = newGameData[keys[i]];
    }

    console.log("updateGame: ", updates);

    if (Object.keys(updates).length > 0) {
      firebase.database().ref().update(updates);
    }
  }

  /* Experimental code
  updateGame2(oldGameData, newGameData, matchType, fullMatchName){ 
    var updates = {};
    var matchLocation = '/games/'+ matchType + '/' + fullMatchName + '/'
    const keys = Object.keys(oldGameData)
    
    for(var i = 0; i < keys.length; i++){
      if(typeof(oldGameData[keys[i]]) == "object" &&
        oldGameData[keys[i]].every((value) => value != newGameData[keys[i]])){
        updates[matchLocation + keys[i]] = newGameData[keys[i]];
      }
    }

    console.log('updateGame: ', updates)

    if(Object.keys(updates).length > 0){
      firebase.database().ref().update(updates);
    }
  }
  */

  leaveGame(
    editGame,
    playernum,
    matchType,
    fullMatchName,
    userData,
    newPlayer
  ) {
    //When player wants leave game in progress
    //var editGame = this.props.game
    //const playernum = this.state.playerNum
    //editGame, playernum, matchType, fullMatchName
    var updates = {};
    var matchLocation = "/games/" + matchType + "/" + fullMatchName;
    var user = firebase.auth().currentUser;

    const quitBalance = editGame.balance[playernum];
    updates["/users/" + user.uid + "/data/in_game"] = ""; 
    updates["/users/" + user.uid + "/data/chips"] = userData.chips + quitBalance;

    editGame.balance.splice(playernum, 1);
    editGame.players.splice(playernum, 1);
    editGame.playerAvatar.splice(playernum, 1);
    editGame.size -= 1;

    if (newPlayer) {
      editGame.newPlayer -= 1;
      updates[matchLocation + "/balance"] = editGame.balance;
      updates[matchLocation + "/players"] = editGame.players;
      updates[matchLocation + "/playerAvatar"] = editGame.playerAvatar;
      updates[matchLocation + "/size"] = editGame.size;

      updates[matchLocation + "/newPlayer"] = editGame.newPlayer;
    } 
    else {
      const wins = editGame.wins[playernum] + userData.wins
      const games = userData.games + editGame.round
      const chipsWon = editGame.chipsWon[playernum];
      const chipsLost =
        editGame.chipsLost[playernum] + editGame.chipsIn[playernum];

      updates["/users/" + user.uid + "/data/wins"] = wins
      updates["/users/" + user.uid + "/data/games"] = games
      updates["/users/" + user.uid + "/data/chips_won"] =
        userData.chips_won + chipsWon;
      updates["/users/" + user.uid + "/data/chips_lost"] =
        userData.chips_lost + chipsLost;

      if (editGame.size == 0) {
        //delete game
        //by setting the data of these location to NULL, the branch is deleted.
        //https://firebase.google.com/docs/database/web/read-and-write#delete_data
        updates[matchLocation] = null;
        if (matchType == "public") {
          updates["/games/list/" + fullMatchName] = null;
        }
      } else {
        //update game
        updates["/games/list/" + fullMatchName + "/size"] = editGame.size;
        
        if(editGame.smallBlindLoc == editGame.size + 1){
          editGame.smallBlindLoc -= 1
          updates[matchLocation + "/smallBlindLoc"] = editGame.smallBlindLoc;
        } 
        editGame.wins.splice(playernum, 1);
        editGame.chipsWon.splice(playernum, 1);
        editGame.chipsLost.splice(playernum, 1);
        editGame.chipsIn.splice(playernum, 1);
        editGame.move.splice(playernum, 1);
        editGame.player_cards.splice(playernum, 1);
        editGame.ready.splice(playernum, 1);
        
        updates[matchLocation + "/balance"] = editGame.balance;
        updates[matchLocation + "/players"] = editGame.players;
        updates[matchLocation + "/playerAvatar"] = editGame.playerAvatar;
        updates[matchLocation + "/size"] = editGame.size;
        updates[matchLocation + "/wins"] = editGame.wins;
        updates[matchLocation + "/chipsLost"] = editGame.chipsLost;
        updates[matchLocation + "/chipsIn"] = editGame.chipsIn;
        updates[matchLocation + "/chipsWon"] = editGame.chipsWon;
        updates[matchLocation + "/move"] = editGame.move;
        updates[matchLocation + "/player_cards"] = editGame.player_cards;
        updates[matchLocation + "/ready"] = editGame.ready;
      }
    }
    firebase
      .database()
      .ref("/games/" + matchType + "/" + fullMatchName)
      .off();
    firebase.database().ref().update(updates);
  }

  endGame() {
    //When game ends and there is a winner
    //maybe insert a if(size > 1) so doesn't count for solos.
    var endGame = this.state.game;
    const playernum = this.state.playerNum;

    const endBalance = endGame.balance[playernum];
    const chipsWon = editGame.chipsWon[playernum];
    const chipsLost =
      editGame.chipsLost[playernum] + editGame.chipsIn[playernum];

    var updates = {};
    var matchLocation =
      "/games/" + this.state.matchType + "/" + this.state.fullMatchName;

    updates[matchLocation] = null;
    if (this.state.matchType == "public") {
      updates["/games/list/" + this.state.fullMatchName] = null;
    }

    var user = firebase.auth().currentUser;
    updates["/users/" + user.uid + "/in_game"] = "";
    updates["/users/" + user.uid + "/chips"] =
      this.props.userData.chips + endBalance;
    updates["/users/" + user.uid + "/games"] = this.props.userData.games + 1;
    updates["/users/" + user.uid + "/chips_won"] = chipsWon;
    updates["/users/" + user.uid + "/chips_lost"] = chipsLost;

    if (endGame.balance[playernum] > 0) {
      updates["/users/" + user.uid + "/wins"] = this.props.userData.wins + 1;
    }

    firebase.database().ref().update(updates);
  }

  render() {
    if (this.state.ready) {
      return (
        <GameView
          game={this.state.game}
          myCards={this.state.myCards}
          matchName={this.state.matchName}
          matchType={this.state.matchType}
          playerNum={this.state.playerNum}
          navigation={this.props.navigation}
          leaveGame={this.leaveGame}
          updateGame={this.updateGame}
          userData={this.props.userData}
          newPlayer={this.state.newPlayer}
        />
      );
    } else {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#FB6342" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#2ecc71",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
