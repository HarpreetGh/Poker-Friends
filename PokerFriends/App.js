import 'react-native-gesture-handler';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import{NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'
import LandingPage from './Components/LandingPage'
import Register from '../PokerFriends/Components/Register';
import Login from './Components/Login'
import ForgotPassword from './Components/ForgotPassword'
import GameSetting from './Components/GameSetting'
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

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props){
    super(props)
      this.state = {
        LoggedIn: true,
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
    return (
      <NavigationContainer>
        <Stack.Navigator  screenOptions={{headerShown: false}}>
          <Stack.Screen name = "LandingPage">
            {(props) => <LandingPage {...props} LoggedIn={this.state.LoggedIn}/>}
          </Stack.Screen>
          <Stack.Screen name = "Login" component = {Login}/>
          <Stack.Screen name = "Register" component = {Register}/>
          
          <Stack.Screen name = "ForgotPassword" component = {ForgotPassword}/>
          <Stack.Screen name = "GameSetting" component = {GameSetting}/>
        </Stack.Navigator>
      </NavigationContainer>
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