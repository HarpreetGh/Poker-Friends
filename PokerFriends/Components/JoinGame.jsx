import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, FlatList, List, ListItem, Touchable, Alert, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';
import Logo from './Logo';
import firebase from 'firebase'
import * as ScreenOrientation from 'expo-screen-orientation';

import Balance from './Balance'



export default class JoinGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      gameList: []
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

  componentDidMount(){
    firebase.database().ref('/games/list/').orderByChild('size').endAt(3).on('value', (snapshot) => {
          var data =  []
          snapshot.forEach((child) => {
            data.push({
              key: child.key,
              buyIn:child.val().buyIn,
              size: child.val().size
            })
          })
          this.setState({gameList: data})
    })
   }

   componentWillUnmount(){
    //stops checking for updates on list
    firebase.database().ref('/games/list/').off()
  }


  async joinGame(matchName){
    var user = firebase.auth().currentUser;
    const username = user.displayName
    const matchPath =  '/games/' + 'public' + '/' + matchName;
    const matchListPath = '/games/list/' + matchName;

    
    
    firebase.database().ref(matchPath).once('value', (snapshot) => {
      console.log('game data recieved')
      var data = snapshot.val()
      data.balance.push(data.buyIn)
      data.players.push(username)
      data.newPlayer +=1
      data.size += 1

      this.props.userData.chips -= data.buyIn
      
      var updates = {};
      
      updates['/users/'+ user.uid +'/data/in_game'] = matchName
      updates['/users/'+ user.uid +'/data/chips'] = this.props.userData.chips

      updates[matchPath + '/balance'] = data.balance
      updates[matchPath + '/players'] = data.players
      updates[matchPath + '/newPlayer'] = data.newPlayer
      updates[matchPath + '/size'] = data.size

      
      updates['/games/list/' + matchName + '/size'] = data.size

      firebase.database().ref().update(updates);
      this.props.navigation.navigate('GameController')
      ScreenOrientation.lockAsync
      (ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
    })

  }

  render(){
    return (
        <KeyboardAvoidingView 
          style={styles.container}
        >
          { /* <Logo />*/}
          <View style={styles.balance}>
            <Balance chips={this.props.userData.chips}/>    
          </View>
            <View style={{flex:1, alignSelf:'center', justifyContent:'center', paddingBottom: 10, paddingTop: 40}}>
              <FlatList style={{width:'100%'}}
                data={this.state.gameList}
                keyExtractor={(item)=>item.key}
                renderItem={({item})=>{
                  return(
                    <View style={styles.gameDisplay}>
                      <Text style={[styles.textStyle, {fontSize: 25}]}>{item.key.slice(item.key.indexOf('_')+1, item.key.indexOf('-'))}</Text>
                      <Text style={styles.textStyle}>Size: {item.size}                   Buy In: {item.buyIn}</Text>
                      <TouchableOpacity style={styles.joinButton}
                      onPress={() => this.joinGame(item.key)}>
                        <Text style={styles.textStyle}>Join Game</Text>
                      </TouchableOpacity>
                    </View>)
                }}/>     
            </View>

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
  gameDisplay:{
    backgroundColor: '#27ae60',
    borderRadius: 50,
    width:"100%",
    padding: 20,
    marginBottom: 10,
  },
  joinButton:{
    backgroundColor: '#000000',
    borderRadius: 50,
    width:"95%",
    paddingTop: 5,
    marginLeft: 5
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
  balance: {
    position: 'absolute',
    right: 85,
    top: 30,
  },
})