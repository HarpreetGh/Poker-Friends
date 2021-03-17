import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, Touchable } from 'react-native';
import Logo from './Logo';
import firebase from 'firebase'

export default class CreateGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: ''
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
    var d = new Date
    firebase.database().ref('games/' + type + 'match-' + this.name + d.getTime()).set({
      balance: [0],
      board: [''],
      deck: [''],
      move: [''],
      phase: 0,
      player_cards: [{rank: 0, card: ['']}],
      pot: 0,
      ready: [false],
      round: 0,
      size: 1,
    });
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

            <TouchableOpacity style={styles.buttonContainer}
              onPress={() => {
                this.createGame('public/')
                this.props.navigation.navigate('GameSetting')
                ScreenOrientation.lockAsync
                (ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)  
              }}>
                <Text style={styles.registerButtonText}>Create Public Game</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer}
              onPress={() => {
                this.createGame('private/')
                this.props.navigation.navigate('GameSetting')
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