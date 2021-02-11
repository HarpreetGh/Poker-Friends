import 'react-native-gesture-handler';
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from '../PokerFriends/Components/Login';
import Register from '../PokerFriends/Components/Register';
import{NavigationContainer} from '@react-navigation/native';


export default class App extends Component {
  render(){
    return (
      <Login />
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
