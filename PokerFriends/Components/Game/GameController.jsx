import React, { Component} from 'react';
import { Text, StyleSheet, View, TouchableOpacity,
         StatusBar, Image, Modal, TextInput,
         BackHandler, Alert, Animated, Dimensions,
         ActivityIndicator,
         } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import firebase from 'firebase'

import GameView from './GameAnimation/GameSetting'
import Deck from '../decks'
const gameDeck = new Deck()

import CardDealing from './GameAnimation/cardDealing'


export default class GameSetting extends Component {
  constructor(props){
    super(props)

    this.state = {
      matchName:'',
      matchType:'', 
      game: {},
      myCards: [],
      playerNum: 0, //fake value
      
      deck: [],
      user: {},
      fullMatchName:'',
      host: false,      
      ready: false,
    };
  }

  componentDidMount(){
    this.getData();
  }

  async getData(){
    const fullMatchName = this.props.userData.in_game
    if(fullMatchName === ''){
      Alert.alert('You have not Joined/Created Game. Going back to Home Page')
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      this.props.navigation.navigate('LandingPage')
    }
    
    var indexOfType = fullMatchName.indexOf('_')
    const matchType = fullMatchName.substring(0, indexOfType)
    const matchName = fullMatchName.substring(indexOfType+1)

    this.setState({fullMatchName: fullMatchName, 
      matchType: matchType, 
      matchName: matchName
    })
    this.gameData(matchType, fullMatchName)
  }
  
  async gameData(matchType, matchName){
    firebase.database().ref('/games/'+ matchType + '/' + matchName).on('value', (snapshot) => {
      const data =  snapshot.val()
      console.log('game updated')
      this.checkHost(data)
      this.setState({game: data}, () => this.gameTurnAction()) 
      
      //this.checkHost(data)
    })
  }

 checkHost(game){
    //var game = this.state.game
    if(!this.state.host){
      var playerNum = game.players.indexOf(this.props.userData.username)
      this.setState({host: playerNum == 0, playerNum: playerNum})
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

  gameTurnAction(){
    //check if all players are ready, by seeing if any player is not ready
    var game = {...this.state.game}
    const allPlayersReady = !game.ready.includes(false)
    //check if start of game turn.

    if(this.state.host){
      console.log('game.turn = ',game.turn)
      var updates = {};
      const matchPath = '/games/'+ this.state.matchType + '/' + this.state.fullMatchName

      if(game.turn == 0){
        var cards = this.giveOutCards()
        game.player_cards = cards[0];
        game.deck = cards[1];
        game.turn++

        updates[matchPath + '/player_cards'] = game.player_cards;
        updates[matchPath + '/deck'] = game.deck;
        updates[matchPath + '/turn'] = game.turn;
        
        //prepare for game.turn == 1
        this.setState({myCards: game.player_cards[this.state.playerNum].myCards})
      }

      else if(game.turn < 5){
        if(allPlayersReady){
           if(game.turn < 4){ //prep for turn 2
            if(game.turn == 1){
              game.board = game.deck.splice(0,3)
            }
            else{
              game.board.push(...game.deck.splice(0,1))
            }
            //prep for turn 3 and 4
            updates[matchPath + '/board'] = game.board
            updates[matchPath + '/deck'] = game.deck
          }

          game.turn++
          updates[matchPath + '/turn'] = game.turn
          updates[matchPath + '/ready'] = game.ready.fill(false)
          updates[matchPath + '/turnStart'] = true
          updates[matchPath + '/raisedVal'] = 0;
        }
      }
      else if(game.turn == 5){
        //Figure out who won and give them the pot of the round
        const roundWinner = this.findRoundWinner(game) //0 
        
        
        game.balance[roundWinner] += game.pot
        game.chipsWon[roundWinner] += game.pot
        game.round++

        for(var i = 0; i < game.size; i++){
          if(i != roundWinner){
            game.chipsLost[i] += game.chipsIn[i]
          }
        }
        //game.turn = 0
        //game.pot = 0
        

        
        updates[matchPath + '/move'] = game.move.fill('check')
        updates[matchPath + '/playerTurn'] = 0
        updates[matchPath + '/balance'] = game.balance
        updates[matchPath + '/round'] = game.round
        updates[matchPath + '/chipsWon'] = game.chipsWon
        updates[matchPath + '/chipsLost'] = game.chipsLost
        updates[matchPath + '/chipsIn'] = game.chipsIn.fill(0)
        updates[matchPath + '/pot'] = 0
        updates[matchPath + '/raisedVal'] = 0;
        //updates[matchPath + '/turnStart'] = true
        updates[matchPath + '/ready'] = game.ready.fill(false)
        updates[matchPath + '/turn'] = 0
        updates[matchPath + '/board'] = ''
      }
      else{
        console.log("Something Wrong with GameTurnAction in GameController")
      }

      if(Object.keys(updates).length > 0){
        firebase.database().ref().update(updates);
      }
    }
    
    else{ //all players but host
      if(game.turn == 1 && turnStart){
        this.setState({myCards: game.player_cards[this.state.playerNum].myCards})
      }
    }
    this.setState({ready: true})
  }

  findRoundWinner(game){
    // Assign ranks for players before sorting ranks in hand[] array therefore updating
    // game.player_cards[i].rank should be updated

    // Loop through number of players with game.size
    // For each player check their hand/cards 
    // with game.player_cards[i].myCards[i or 1 or 2] and the game board with
    // game.board[i].suit and game.board[i].value
    // Update game.player_cards.rank

    //TODO: Check for fold here maybe? Maybe not 
    for (var i = 0; i < game.size; i++){
      console.log("Assign ranks loop reached")
      var position = i
      if (this.isRoyalFlush(game, position)){
        game.player_cards[i].rank = 1
        console.log("Royal Flush")
        break
      }
      if (this.isStraightFlush(game, position)){
        game.player_cards[i].rank = 2
        console.log("Straight Flush")
        break
      }
      if (this.isFourOfKind(game, position)){
        game.player_cards[i].rank = 3
        console.log("4 Kind")
        break
      }
      if (this.isFullHouse(game, position)){
        game.player_cards[i].rank = 4
        console.log("Full House", game.player_cards[i].rank)
        break
      }
      if (this.isFlush(game, position)){
        game.player_cards[i].rank = 5
        console.log("Flush")
        break
      }
      if (this.isStraight(game, position)){
        game.player_cards[i].rank = 6
        console.log("Straight")
        break
      }
      if (this.isThreeOfKind(game, position)){
        game.player_cards[i].rank = 7
        console.log("3 Kind")
        break
      }
      if (this.isTwoPair(game, position)){
        game.player_cards[i].rank = 8
        console.log("Two Pair", game.player_cards[i].rank)
        break
      }
      if (this.isOnePair(game, position)){
        game.player_cards[i].rank = 9
        console.log("One Pair", game.player_cards[i].rank)
        break
      }
      if (this.isHighCard(game, position)){
        game.player_cards[i].rank = 10
        console.log("High Card", game.player_cards[i].rank)
        break
      }
    }

    console.log("This is rank at 0: ", game.player_cards[0].rank)

    //  hands is an array of players with game.players_cards[i].rank sorted by highest rank to lowest (1, 2, 3, 4, 5, 6, 7, 8, 9, 10 hand rankings in order)
    var hands = game.player_cards.sort(function(a, b){return a.rank - b.rank}); //sorts from small to high
    console.log("Hands array sorted!")


    var handsNotFolded = [] // An array of hand rankings of players that have not folded
    for(var i = 0; i < game.size; i++){ // Loop through all players
      if(game.move[i] != "fold"){ // If the player at position "i" has not folded they can move into the hNF array
          handsNotFolded.push(hands[i])
      }
    }
    var highestRank = handsNotFolded[0].rank

    var indexOfHighestRanks = []
    for(var i = 0; i < game.size; i++){
      if(highestRank == game.player_cards[i].rank){
        indexOfHighestRanks.push(i)
      }
    }

    var roundWinner;
    if(indexOfHighestRanks.length == 1){
      roundWinner = indexOfHighestRanks[0]
    }
    else{
      roundWinner = CompareCards(indexOfHighestRanks, game.player_cards)
      //index would be [0,3] or [1,2,3] or whatever amount of players have same # of cards
      //game.player_cards is [{rank: 2, myCards: [Card, Card]}, {rank: 2, myCards: [Card, Card]}]
      //Card = {suit: 'heart', value: '3', image: 'somefilepath'}
    }
    console.log("Rounder winner is: ", roundWinner)
    return roundWinner
  }

  CompareCards(index, cards){ //TODO
    /*
    Because this is only called when there are more than 1 people with the same rank
    depending on their rank, you can do shortcut comparisons such as straight flush
    compare just the first and/or last value of their hand with the other person's hand
    Special Case: Royal Flush (I doubt this will happen), divide pot by how many players have royal flush
    */
    return 0
  }

  // TODO: Current code doesn't work! Just use isFlush isStraight and check for Ace
  // Rank 1
  isRoyalFlush(game, position){
    return false
    console.log("isRoyalFlush() called")
    var completeCards = []
    completeCards.push(game.player_cards[position].myCards)
    completeCards.push(game.board)
    var hand = completeCards.flat()
    console.log("isRoyalFlush hands is populated, contents: ", hand)
    
    // Sort the hands array by the suits (selection sort)
    for (var i = 0; i < hand.length; i++){
      var min = i
      for (var j = i + 1; j < hand.length; j++){
        if (hand[j].suit < hand[min].suit){
          min = j
        }
      }
      // Swap
      var temp = hand[i]
      hand[i] = hand[min]
      hand[min] = temp
    }
    if (hand[0].suit == hand[4].suit){ // If you have 5 cards that are the same suit (flush condition)
      // If royal condition Ace, King, Queen, Jack, 10
      if (hand[0].value == 'A' && hand[1].value == 'K' && hand[2].value == 'Q' && hand[3].value == 'J' && hand[4].value == '10'){ 
        console.log("Wow you actually got a Royal Flush! Unless you are cheating as the chances are 1 in 649737...")
        return true 
      }
    }

    return false
  }

  // Rank 2 - Five cards in a row all suit
  isStraightFlush(game, position){
    if (this.isStraight(game, position) && this.isFlush(game, position)){ return true }
    return false
  }

  // Rank 3 - Same value in each suit
  isFourOfKind(game, position){
    console.log("isFourOfKind() called")
    var completeCards = []
    completeCards.push(game.player_cards[position].myCards)
    completeCards.push(game.board)
    var hand = completeCards.flat()
    console.log("isFourfKind hands is populated, contents: ", hand)

    // Loop through hand array to see if 4 cards have the same value (4 of a kind) then return true if so
    var counter = 1
    for(var i = 0; i < hand.length - 2 && counter != 4; i++){
      console.log("Outer loop: ", "i is ", i, "counter is ", counter)
      counter = 1
      for(var j = i + 1; j < hand.length; j++){
        console.log("Inner loop: ", "i is ", i, "j is ", j, "counter is ", counter)
        if (hand[i].value == hand[j].value){
          counter++
          console.log("Inner if reached ", counter)
        }
      }
    }

    if (counter == 4){ 
      console.log("True returned for isFourOfKind()")
      return true 
    }
  }

  //Rank 4 - A pair and three of kind 
  isFullHouse(game, position){
    console.log("isFullHouse() called")
    return false
    //if(this.isThreeOfKind(game, position) && this.isOnePair(game, position)){ return true }
  }  
  
  // Rank 5 - Five cards all same suit but not in numerical order
  isFlush(game, position){
    console.log("isFlush() called")
    var completeCards = []
    completeCards.push(game.player_cards[position].myCards)
    completeCards.push(game.board)
    var hand = completeCards.flat()
    console.log("isFlush hands is populated, contents: ", hand)
    
    // Sort the hands array by the suits (selection sort)
    for (var i = 0; i < hand.length; i++){
      var min = i
      for (var j = i + 1; j < hand.length; j++){
        if (hand[j].suit < hand[min].suit){
          min = j
        }
      }
      // Swap
      var temp = hand[i]
      hand[i] = hand[min]
      hand[min] = temp
    }
    if (hand[0].suit == hand[4].suit){ return true } // Return true because hand has a flush since it is sorted by suit
  }  
  
  // Rank 6 - Five cards in numerical order, but not of same suit
  isStraight(game, position){
    return false
    console.log("isStraight() called")
    var completeCards = []
    completeCards.push(game.player_cards[position].myCards)
    completeCards.push(game.board)
    var hand = completeCards.flat()
    
    
    //TODO/FIXME: 10 IS SELECTED AS THE MOST MINMUM VALUE AFTER SORTING AND IS PUT AT BOTTOM OF ARRAY
    // Sort the hands array by the values (selection sort)
    for (var i = 0; i < hand.length; i++){
      var max = i
      for (var j = i + 1; j < hand.length; j++){
        if (hand[j].value > hand[max].value){
          max = j
        }
      }
      // Swap
      if (max != i){
        var temp = hand[i]
        hand[i] = hand[max]
        hand[max] = temp
      }
    }
    console.log("isStraight hands is populated and sorted by value, contents: ", hand)
    
    //TODO/FIXME: Although the hand is already sorted descending, need to check if it decreasing values
    // Check for straight
    var decValue = hand[0].value + 1
    for (var i = 1; i < hand.length; i++){
      if (hand[i].value != decValue){
        return false 
      }
      decValue++ // Increment to become next card
    }
    return true
    /*
    var counterStraight = 0
    for (var i = 0; i < hand.length; i++){
      for (var j = i + 1; j < hand.length + 1; j++)
      if (hand[i].value > hand[j].value && hand[i].value > hand[j+1].value){
        counterStraight++
        console.log("inner loop: ", counterStraight)
      }
    }
    */
    console.log("outside the loop: ", counterStraight)
    
    if(counterStraight >= 5) {
      console.log("counterStraight is equal or more than 5 returning true")
      return true
    }
  }

  // Rank 7 - Three of one card and two-non paired cards
  isThreeOfKind(game, position){
    console.log("isThreeOfKind() called")
    var completeCards = []
    completeCards.push(game.player_cards[position].myCards)
    completeCards.push(game.board)
    var hand = completeCards.flat()
    console.log("isThreeOfKind hands is populated, contents: ", hand)

    // Loop through hand array to see if 3 cards have the same value (3 of a kind) then return true if so
    var counter = 1
    for(var i = 0; i < hand.length - 2 && counter != 3; i++){
      console.log("Outer loop: ", "i is ", i, "counter is ", counter)
      counter = 1
      for(var j = i + 1; j < hand.length; j++){
        console.log("Inner loop: ", "i is ", i, "j is ", j, "counter is ", counter)
        if (hand[i].value == hand[j].value){
          counter++
          console.log("Inner if reached ", counter)
        }
      }
    }

    if (counter == 3){ 
      console.log("True returned for isThreeOfKind()")
      return true 
    }
  }

  // Rank 8 - Two different pairings or sets of the same card in one hand
  isTwoPair(game, position){
    console.log("isHighCard() called")
    var completeCards = []
    completeCards.push(game.player_cards[position].myCards) 
    completeCards.push(game.board) 
    var hand = completeCards.flat()
    console.log("isTwoPair hands is populated, contents: ", hand)
    var match = 0 
    for(var i = 0; i < hand.length; i++){
      for(var j = i + 1; j < hand.length; j++){
        if (hand[i].value == hand[j].value){
          match++
          console.log("Match: ", match)
        } 
      }
      if (match >= 2) { 
        console.log("True returned for isTwoPair()")
        return true
      }
    }
  }

  // Rank 9 - One pairing of the same card
  isOnePair(game, position){
    console.log("isOnePair() called")
    var completeCards = [] // Array holding both player and board cards
    completeCards.push(game.player_cards[position].myCards) // Player cards
    completeCards.push(game.board) // Board cards
    var hand = completeCards.flat() // Flatten the array to iterate through
    console.log("isOnePair hands is populated, contents: ", hand)
    for(var i = 0; i < hand.length; i++){
      for(var j = i + 1; j < hand.length; j++){
        if (hand[i].value == hand[j].value){ // One pair if two cards same value
          console.log("Return 9")
          return true
        }
      }
    }
    console.log("False returned for isOnePair()")
    return false
  }

  // Rank 10 - High card - no matching cards
  isHighCard(game, position){
    console.log("isHighCard() called")
    var completeCards = []
    completeCards.push(game.player_cards[position].myCards) 
    completeCards.push(game.board) 
    var hand = completeCards.flat()
    console.log("isHighCard hands is populated, contents: ", hand)
    var match = 0 // If match is > 1 then a match has been found at least once meaning no high card but higher rank
    for(var i = 0; i < hand.length; i++){
      for(var j = i + 1; j < hand.length; j++){
        if (hand[i].value == hand[j].value){
          match++
          console.log("Match: ", match)
        } 
      }
    }
    if (match > 0){ return false }
    else { return true }
  }

  

  giveOutCards() {
    gameDeck.shuffle()

    var playerDecks = []
    for(var i = 0; i < (this.state.game.size * 2); i+=2){
      playerDecks.push([gameDeck.cards.shift(), gameDeck.cards.shift()])
    }
    //output: [ [card, card], [card, card] ]
    this.setState({myCards: playerDecks[0]})

    var playerRanks = playerDecks.map((cards) => {
      var obj = {
        rank: 10,
        myCards: cards
      } 
      return obj
    })
    //example output: [{rank: 10, myCards: [Card, Card]}, {rank: 10, myCards: [Card, Card]}]

    var deck = []
    for(var i = 0; i < 5; i++){
      deck.push(gameDeck.cards.shift())
    }
    //this.setState({deck: deck})
    return [playerRanks, deck]
  }

  updateGame(keys, newGameData, matchType, fullMatchName){
    var updates = {};
    var matchLocation = '/games/'+ matchType + '/' + fullMatchName + '/'
    
    for(var i = 0; i < keys.length; i++){
      updates[matchLocation + keys[i]] = newGameData[keys[i]];
    }

    console.log('updateGame: ', updates)

    if(Object.keys(updates).length > 0){
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
    
  leaveGame(editGame, playernum, matchType, fullMatchName, userData){ //When player wants leave game in progress
    //var editGame = this.props.game
    //const playernum = this.state.playerNum
    //editGame, playernum, matchType, fullMatchName

    const quitBalance = editGame.balance[playernum]
    const chipsWon = editGame.chipsWon[playernum]
    const chipsLost = editGame.chipsLost[playernum] + editGame.chipsIn[playernum]

    editGame.balance.splice(playernum,1)
    editGame.chipsWon.splice(playernum,1)
    editGame.chipsLost.splice(playernum,1)
    editGame.chipsIn.splice(playernum,1)
    editGame.move.splice(playernum,1)
    editGame.player_cards.splice(playernum,1)
    editGame.players.splice(playernum,1)
    editGame.ready.splice(playernum,1)
    editGame.size -= 1

    var updates = {}; 
    //var matchLocation = '/games/'+ this.state.matchType + '/' + this.state.fullMatchName
    var matchLocation = '/games/'+ matchType + '/' + fullMatchName

    var user = firebase.auth().currentUser;

    updates['/users/'+ user.uid +'/in_game'] = '';
    updates['/users/'+ user.uid +'/chips'] = userData.chips + quitBalance;
    updates['/users/'+ user.uid +'/games'] = userData.games + 1;
    updates['/users/'+ user.uid +'/chips_won'] = chipsWon;
    updates['/users/'+ user.uid +'/chips_lost'] = chipsLost;

    if(editGame.size == 0){ //delete game
      //by setting the data of these location to NULL, the branch is deleted.
      //https://firebase.google.com/docs/database/web/read-and-write#delete_data
      updates[matchLocation] = null
      if(matchType == 'public'){
        updates['/games/list/' + fullMatchName] = null
      }
    }
    else{ //update game
      updates[matchLocation + '/balance']       = editGame.balance
      updates[matchLocation + '/move']          = editGame.move
      updates[matchLocation + '/player_cards']  = editGame.player_cards
      updates[matchLocation + '/players']       = editGame.players
      updates[matchLocation + '/ready']         = editGame.ready
      updates[matchLocation + '/size']          = editGame.size
    }
    firebase.database().ref('/games/'+ matchType + '/' + fullMatchName).off()
    firebase.database().ref().update(updates);
  }

  endGame(){ //When game ends and there is a winner 
    //maybe insert a if(size > 1) so doesn't count for solos.
    var endGame = this.state.game
    const playernum = this.state.playerNum
    
    const endBalance = endGame.balance[playernum]
    const chipsWon = editGame.chipsWon[playernum]
    const chipsLost = editGame.chipsLost[playernum] + editGame.chipsIn[playernum]

    var updates = {}; 
    var matchLocation = '/games/'+ this.state.matchType + '/' + this.state.fullMatchName

    updates[matchLocation] = null
    if(this.state.matchType == 'public'){
      updates['/games/list/' + this.state.fullMatchName] = null
    }
    
    var user = firebase.auth().currentUser;
    updates['/users/'+ user.uid +'/in_game'] = '';
    updates['/users/'+ user.uid +'/chips'] = this.props.userData.chips + endBalance;
    updates['/users/'+ user.uid +'/games'] = this.props.userData.games + 1;
    updates['/users/'+ user.uid +'/chips_won'] = chipsWon;
    updates['/users/'+ user.uid +'/chips_lost'] = chipsLost;

    if(endGame.balance[playernum] > 0){
      updates['/users/'+ user.uid +'/wins'] = this.props.userData.wins + 1;
    }

    firebase.database().ref().update(updates);
  }

  render() { 
    if(this.state.ready){
      return(
        <GameView game={this.state.game} 
          myCards={this.state.myCards}
          matchName={this.state.matchName}
          matchType={this.state.matchType}
          playerNum={this.state.playerNum}
          navigation = {this.props.navigation}
          leaveGame = {this.leaveGame}
          updateGame = {this.updateGame}
          userData = {this.props.userData}
        />
      )
    }
    else{
      return(
      <View style={[styles.container, styles.horizontal] }>
        <ActivityIndicator size='large' color="#FB6342"/>
      </View>
      )
    }
  }
}
 

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#2ecc71',
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
})