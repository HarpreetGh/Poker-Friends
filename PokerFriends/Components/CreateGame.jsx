import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, Touchable, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import Logo from './Logo';
import firebase from 'firebase'
import * as ScreenOrientation from 'expo-screen-orientation';

export default class CreateGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      buyIn: 50
    }
  }
  /*
  getGames(){
    var games = firebase.database().ref('games/public').orderByChild('$')
    games.on('value', (snapshot) => {
      const data = snapshot.val();
      updateStarCount(postElement, data);
    });
  }
  */

  createGame(type){
    var user = firebase.auth().currentUser;
    const username = user.displayName
    //const username = user.displayName
    const buyIn = Number(this.state.buyIn)
    
    if(this.props.userData.chips - buyIn < 0){
      Alert.alert('Insufficent Balance','Your BuyIn is higher than you current Balance, please lower Buy-In to Proceed')
      return false
    }
    else if(!this.props.userData.in_game === ''){
      Alert.alert('Already in a Game', 'Please leave the game you currently are in, to create a Game')
      return false
    }
    else if(this.state.name === ''){
      Alert.alert('Match must have a Name', 'Please enter a valid name for the Match')
      return false
    }  
    this.props.userData.chips -= buyIn 
    var d = new Date
    var matchName = type + '_' + this.state.name.trim() +"-"+ d.getTime();
    var updates = {};
    updates['/users/'+ user.uid +'/data/in_game'] = matchName;
    updates['/users/'+ user.uid +'/data/chips'] = this.props.userData.chips

    firebase.database().ref('games/' + type + '/' + matchName).set({
      balance: [buyIn],
      blindAmount: buyIn * 0.1,
      smallBlindLoc: 0,
      board: [''],
      buyIn: buyIn,
      chipsWon: [0],
      chipsLost: [0],
      chipsIn: [0],
      deck: [''],
      move: [''],
      newPlayer: 0,
      turn: 0,
      player_cards: [{rank: 0, cards: ['']}],
      playerTurn: 0,
      players: [username],
      playerAvatar: [user.photoURL],
      pot: 0,
      raisedVal: 0,
      ready: [false],
      round: 1,
      roundWinner: -1,
      roundWinnerRank: -1,
      size: 1,
      wins: [0]
    });
    
    if(type === 'public'){
      firebase.database().ref('games/list/' + matchName).set({
        size:1,
        buyIn: buyIn
      }); 
    }

    firebase.database().ref().update(updates);
    return true
  }

  render(){
    return (
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.container}
          >
            <Logo />
            <Text style={styles.textStyle}>Make Game</Text>

            <TextInput
                placeholder="Lobby Name"
                maxLength={20}
                placeholderTextColor="rgba(255, 255, 255, 0.75)"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                onChangeText={text => this.setState({name: text})}
                value={this.state.name}
            />

            <Text style={styles.textStyle}> Buy-In {this.state.buyIn} </Text>
            
            <Slider 
                style={{width: 350, height: 30, marginBottom: 20}}
                minimumValue={50}
                maximumValue={500}
                step={50}
                onValueChange={(buyIn) => { 
                  this.setState({buyIn});
                }}
                value={this.state.buyIn}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
              />
              {/* //https://github.com/callstack/react-native-slider */}

            <TouchableOpacity style={styles.buttonContainer}
              onPress={() => {
                if(this.createGame('public')){
                  this.props.navigation.navigate('GameController')
                  ScreenOrientation.lockAsync
                  (ScreenOrientation.OrientationLock.LANDSCAPE)  
                }
              }}>
                <Text style={styles.registerButtonText}>Create Public Game</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer}
              onPress={() => {
                if(this.createGame('private')){
                  this.props.navigation.navigate('GameController')
                  ScreenOrientation.lockAsync
                  (ScreenOrientation.OrientationLock.LANDSCAPE)  
                }
              }}>
                <Text style={styles.registerButtonText}>Create Private Game</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('LandingPage')}>
                <Text style={styles.registerButtonText}>Go Back</Text>
            </TouchableOpacity>


        </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    marginBottom: 10,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
    container: {
      padding: 20,
      flex: 1,
      backgroundColor: '#2ecc71',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonContainer:{
      backgroundColor: '#27ae60',
      paddingVertical: 20,
      padding: 20,
      borderRadius: 50,
      width:"100%",
      marginBottom: 20
    },
    registerButtonText: {
      textAlign: 'center',
      color: '#FFF',
      fontWeight: '900'
    },
    input: {
    height:40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 20,
    color: '#FFF',
    paddingHorizontal: 20,
    paddingEnd: 10,
    borderRadius: 50,
    width:'100%'
  },
})