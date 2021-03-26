import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, Touchable } from 'react-native';
import Logo from './Logo';
import firebase from 'firebase'
import * as ScreenOrientation from 'expo-screen-orientation';

export default class CreateGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      buyIn: ''
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
    console.log('create game triggered')
    var user = firebase.auth().currentUser;
    //var username = user.displayName.slice(0, user.displayName.indexOf('#'))
    var username = user.displayName
    
    var d = new Date
    var matchName = type + '_' + this.state.name +"-"+ d.getTime();

    firebase.database().ref('games/' + type + '/' + matchName).set({
      balance: [this.state.buyIn],
      board: [''],
      buyIn: Number(this.state.buyIn),
      deck: [''],
      move: [''],
      pause: true,
      turn: 0,
      turnStart: true,
      player_cards: [{rank: 0, cards: ['']}],
      players: [username],
      pot: 0,
      ready: [false],
      round: 1,
      size: 1,
    });
    
    if(type === 'public'){
      firebase.database().ref('games/list/' + matchName).set({
        size:1
      }); 
    }

    var updates = {};
    updates['/users/'+ user.uid +'/in_game'] = matchName;
    firebase.database().ref().update(updates);

    console.log('create game finished')
  }

  render(){
    return (
        <KeyboardAvoidingView 
          style={styles.container}
          >
            <Logo />
            <Text style={styles.textStyle}>Make Game</Text>

            <TextInput
                placeholder="Lobby Name"
                placeholderTextColor="rgba(255, 255, 255, 0.75)"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                onChangeText={text => this.setState({name: text})}
                value={this.state.name}
            />

            <TextInput
                placeholder="Buy In"
                placeholderTextColor="rgba(255, 255, 255, 0.75)"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType='number-pad'
                style={styles.input}
                onChangeText={text => this.setState({buyIn: text})}
                value={this.state.buyIn}
            />

            <TouchableOpacity style={styles.buttonContainer}
              onPress={() => {
                this.createGame('public')
                this.props.navigation.navigate('GameController')
                ScreenOrientation.lockAsync
                (ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)  
              }}>
                <Text style={styles.registerButtonText}>Create Public Game</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer}
              onPress={() => {
                this.createGame('private')
                this.props.navigation.navigate('GameController')
                ScreenOrientation.lockAsync
                (ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)  
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