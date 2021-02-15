import 'react-native-gesture-handler';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import{NavigationContainer} from '@react-navigation/native';

import LandingPage from './Components/LandingPage'
import Register from '../PokerFriends/Components/Register';
import Login from './Components/Login'
//import AsyncStorage from 'react-native-community/async-storage'
import * as firebase from 'firebase';
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBVr4IKgejWBb6uFG_joH5a5tT03j40NRM",
    authDomain: "pokerfriends-843ef.firebaseapp.com",
    projectId: "pokerfriends-843ef",
    storageBucket: "pokerfriends-843ef.appspot.com",
    messagingSenderId: "1077794174230",
    appId: "1:1077794174230:web:f05b745f8fba6d8f798c37"
  };

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      LoggedIn: false,
    }
  
    if(firebase.apps.length === 0){
      console.log('triggered')
      firebase.initializeApp(firebaseConfig);
    }
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({LoggedIn: !!user})
    })
  }

  render(){ 
    // Temporary Code (this.state.LoggedIn)? (<LandingPage data={this.state.LoggedIn} />):(<Register />) 
    // Final code once Navigator works <LandingPage data={this.state.LoggedIn} />
    return (
      (this.state.LoggedIn)? (<LandingPage data={this.state.LoggedIn} />):(<Login />)
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
