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
      playerNum: 5, //fake value
      
      deck: [],
      user: {},
      fullMatchName:'',
      host: false,      
      ready: false,
    };

    var user = firebase.auth().currentUser;
    this.getUserData(user.uid); //Also gets Game Data

  }

  getUserData(userID){
    firebase.database().ref('/users/' + userID).once('value').then((snapshot) => {
      this.setState({user: snapshot.val()})
      
      const fullMatchName = snapshot.val().in_game
      var indexOfType = fullMatchName.indexOf('_')
      const matchType = fullMatchName.substring(0, indexOfType)
      
      this.setState({fullMatchName: fullMatchName})
      this.setState({matchType: matchType})
      this.setState({matchName: fullMatchName.substring(indexOfType+1)})
      this.getGameData(matchType, fullMatchName)
    });
  }

  getGameData(matchType, matchName){
    firebase.database().ref('/games/'+ matchType + '/' + matchName).on('value', (snapshot) => {
      this.setState({game: snapshot.val()})
      //console.log(this.state.game)
      
      this.checkHost()
    });
  }

  setupCards(){
    var playerCards = this.state.myCards.map((cards) => {
      var obj = {
        rank: 10,
        myCards: cards
      } 
      return obj
    })
    //example output: [{rank: 10, myCards: [Card, Card]}, {rank: 10, myCards: [Card, Card]}]

    var editGame = {...this.state.game}
    editGame.player_cards = playerCards;
    editGame.deck = this.state.deck;
    this.setState({game: editGame})

    var updates = {};
    updates['/games/'+ this.state.matchType + '/' + this.state.fullMatchName + '/player_cards'] = playerCards;
    updates['/games/'+ this.state.matchType + '/' + this.state.fullMatchName + '/deck'] = this.state.deck;
    updates['/games/'+ this.state.matchType + '/' + this.state.fullMatchName + '/turn'] = 1;
    
    //firebase.database().ref().update(updates);
  }

  checkHost(){
    var playerNum = this.state.game.players.indexOf(this.state.user.username)
    if(playerNum == 0){
      this.setState({host: true})
      
      if(this.state.game.turn == 0){
        this.shuffleCards()
        this.giveOutCards()
        var myCardHold = this.state.myCards[playerNum]
        //^ We do this here to avoid the auto fetch feature of firebase
        this.setupCards()
        this.setState({myCards: myCardHold})
      }
      else{
        this.setState({myCards: this.state.game.player_cards[playerNum].myCards})
      }
      //console.log("host is true");
    }
    else{
      this.setState({host: false})
      this.setState({myCards: this.state.game.player_cards[playerNum].myCards})
      //if we are not the host that means the cards have already been uploaded to DB

      //console.log("host is false")
    }
    
    this.setState({playerNum: playerNum})
    this.setState({ready: true})
  }

  shuffleCards(){
    gameDeck.shuffle()
  }

  giveOutCards() {
    var playerDecks = []
    for(var i = 0; i < (this.state.game.size * 2); i+=2){
      playerDecks.push([gameDeck.cards.shift(), gameDeck.cards.shift()])
    }
    //output: [ [card, card], [card, card] ]
    this.setState({myCards: playerDecks})

    var deck = []
    for(var i = 0; i < 5; i++){
      deck.push(gameDeck.cards.shift())
    }
    this.setState({deck: deck})
  }
  
  updateGame(newGameData){
    var currGame = this.state.game

    var updates = {};
    var matchLocation = '/games/'+ this.state.matchType + '/' + this.state.fullMatchName + '/'
    const keys = object.keys(currGame)

    for(var i = 0; i < keys.length; i++){
      if(currGame[keys[i]] != newGameData[keys[i]]){
        updates[matchLocation + keys[i]] = newGameData[keys[i]];
      }
    }
    firebase.database().ref().update(updates);
  }
    
  leaveGame(){ //When player wants leave game in progress
    var editGame = this.state.game
    const playernum = this.state.playerNum
    
    const quitBalance = editGame.balance[playernum]
    const chipsRank = quitBalance - editGame.buyIn

    editGame.balance.splice(playernum,1)
    editGame.move.splice(playernum,1)
    editGame.player_cards.splice(playernum,1)
    editGame.players.splice(playernum,1)
    editGame.ready.splice(playernum,1)
    editGame.size -= 1

    var updates = {}; 
    var matchLocation = '/games/'+ this.state.matchType + '/' + this.state.fullMatchName

    if(editGame.size == 0){ //delete game
      //by setting the data of these location to NULL, the branch is deleted.
      //https://firebase.google.com/docs/database/web/read-and-write#delete_data

      updates[matchLocation] = null
      if(this.state.matchType == 'public'){
        updates['/games/list/' + this.state.fullMatchName] = null
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
    
    var user = firebase.auth().currentUser;
    updates['/users/'+ user.uid +'/in_game'] = '';
    updates['/users/'+ user.uid +'/chips'] = this.state.user.chips + quitBalance;
    updates['/users/'+ user.uid +'/games'] = this.state.user.games + 1;

    ///change this later to be round based, instead of game based
    if(chipsRank > 0){
      updates['/users/'+ user.uid +'/chips_won'] = this.state.user.chips + chipsRank;
    }
    else if(chipsRank < 0){
      updates['/users/'+ user.uid +'/chips_lost'] = this.state.user.chips + chipsRank;
    }

    firebase.database().ref().update(updates);
  }

  endGame(){ //When game ends and there is a winner 
    //maybe insert a if(size > 1) so doesn't count for solos.
    var endGame = this.state.game
    const playernum = this.state.playerNum
    
    const endBalance = endGame.balance[playernum]
    const chipsRank = endBalance - endGame.buyIn

    var updates = {}; 
    var matchLocation = '/games/'+ this.state.matchType + '/' + this.state.fullMatchName

    updates[matchLocation] = null
    if(this.state.matchType == 'public'){
      updates['/games/list/' + this.state.fullMatchName] = null
    }
    
    var user = firebase.auth().currentUser;
    updates['/users/'+ user.uid +'/in_game'] = '';
    updates['/users/'+ user.uid +'/chips'] = this.state.user.chips + endBalance;
    updates['/users/'+ user.uid +'/games'] = this.state.user.games + 1;

    if(endGame.balance[playernum] > 0){
      updates['/users/'+ user.uid +'/wins'] = this.state.user.wins + 1;
    }
    
    ///change this later to be round based, instead of game based
    if(chipsRank > 0){
      updates['/users/'+ user.uid +'/chips_won'] = this.state.user.chips + chipsRank;
    }
    else if(chipsRank < 0){
      updates['/users/'+ user.uid +'/chips_lost'] = this.state.user.chips + chipsRank;
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