import 'react-native-gesture-handler';
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LandingPage from './Components/LandingPage'
import Register from '../PokerFriends/Components/Register';
import{NavigationContainer} from '@react-navigation/native';
import Login from './Components/Login'


export default class App extends Component {
  render(){
    return (
      <LandingPage />
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
