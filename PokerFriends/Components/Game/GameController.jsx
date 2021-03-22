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
    
    //firebase.database().ref().update(updates);
  }

  checkHost(){
    var playerNum = this.state.game.players.indexOf(this.state.user.username)
    if(playerNum == 0){
      this.setState({host: true})
      this.shuffleCards()
      this.giveOutCards()
      var myCardHold = this.state.myCards[playerNum]
      //^ We do this here to avoid the auto fetch feature of firebase
      this.setupCards()
      this.setState({myCards: myCardHold})
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