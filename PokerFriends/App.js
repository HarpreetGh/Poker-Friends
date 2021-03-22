import 'react-native-gesture-handler';
import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import{NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'
import LandingPage from './Components/LandingPage'
import Register from '../PokerFriends/Components/Register';
import Login from './Components/Login'
import ForgotPassword from './Components/Account-Settings/ForgotPassword'
import GameSetting from './Components/Game/GameAnimation/GameSetting'
import GameController from './Components/Game/GameController'
import AccountSettings from './Components/AccountSettings';
import ChangeUsername from './Components/Account-Settings/ChangeUsername';
import ChangeEmail from './Components/Account-Settings/ChangeEmail';
import DeleteAccount from './Components/Account-Settings/DeleteAccount';
import FriendsList from './Components/FriendsList'
import CreateGame from './Components/CreateGame'
import Firebaseinit from './firebase' //Intializes Firebase
import firebase from 'firebase';

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props){
    super(props)
      this.state = {
        LoggedIn: true,
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
          
          <Stack.Screen name = "FriendsList" component = {FriendsList}/>
          <Stack.Screen name = "GameSetting" component = {GameSetting}/>
          <Stack.Screen name = "GameController" component = {GameController}/>
          <Stack.Screen name = "CreateGame" component = {CreateGame}/>
          
          <Stack.Screen name = "AccountSettings">
            {(props) => <AccountSettings {...props} LoggedIn={this.state.LoggedIn}/>}
          </Stack.Screen>
          <Stack.Screen name = "ChangeUsername" component = {ChangeUsername}/>
          <Stack.Screen name = "ChangeEmail" component = {ChangeEmail}/>
          <Stack.Screen name = "ForgotPassword" component = {ForgotPassword}/>
          <Stack.Screen name = "DeleteAccount" component = {DeleteAccount}/>
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
