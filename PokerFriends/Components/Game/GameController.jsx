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
        //Figure out who won and give them pot
        const roundWinner = 0//this.findRoundWinner(game)
        
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
    var hands = game.player_cards.sort(function(a, b){return a.rank - b.rank}); //sorts from small to high
    var highestRank = hands[0].rank //CHECK IF THEY FOLDED FIX ME

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
    return roundWinner
  }

  CompareCards(indexs, cards){
    return 0
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