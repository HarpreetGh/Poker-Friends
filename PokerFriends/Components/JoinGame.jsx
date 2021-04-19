import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, FlatList, List, ListItem, Touchable, Alert, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';
import Logo from './Logo';
import firebase from 'firebase'
import * as ScreenOrientation from 'expo-screen-orientation';



// const Item = ({ title }) => (
//   <View style={styles.item}>
//     <Text>{buyIn}</Text>
//     <Text>{size}</Text>
//   </View>
// );

export default class JoinGame extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      gameList: [],
      keyList: []
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
    firebase.database().ref('/games/list/').orderByChild('buyIn').endAt('3').on('value', (snapshot) => {
          const data =  snapshot.val()
          const kList = Object.keys(data)
          //this.checkHost(data)
          this.setState({gameList: data, keyList: kList})
    })
   }


  async joinGame(type){
    var user = firebase.auth().currentUser;
    const username = user.displayName.slice(0, user.displayName.indexOf('#'))

    if(!this.props.userData.in_game === ''){
      Alert.alert('Already in a Game', 'Please leave the game you currently are in, to create a Game')
      return false
    }
    else if(this.state.name === ''){
      Alert.alert('Match must have a Name', 'Please enter a valid name for the Match')
      return false
    } 

    const matchName = this.state.name;
    const matchPath =  '/games/' + type + '/' + matchName;
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
      
      updates['/users/'+ user.uid +'/in_game'] = matchName
      updates['/users/'+ user.uid +'/chips'] = this.props.userData.chips

      updates[matchPath + '/balance'] = data.balance
      updates[matchPath + '/players'] = data.players
      updates[matchPath + '/newPlayer'] = data.newPlayer
      updates[matchPath + '/size'] = data.size

      if(type == 'public'){
        updates['/games/list/' + matchName + '/size'] = data.size
      }

      firebase.database().ref().update(updates);
    })

    return true
  }

  render(){
    return (
        <KeyboardAvoidingView 
          style={styles.container}
        >
            <Logo />
            <SafeAreaView>
              <FlatList
                data= {this.state.gameList}
                renderItem={({ item }) => (
                  <View>
                    <Text style={styles.textStyle}>{item.buyIn}</Text>
                    <Text style={styles.textStyle}>{item.size}</Text>
                  </View>
                )}
              />
            </SafeAreaView>
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