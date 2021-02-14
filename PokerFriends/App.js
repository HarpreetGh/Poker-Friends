import 'react-native-gesture-handler';
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import{NavigationContainer} from '@react-navigation/native';

import LandingPage from './Components/LandingPage'
import Register from '../PokerFriends/Components/Register';
import Login from './Components/Login'

const App = () => {
  return(
    <Login>

    </Login>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App
