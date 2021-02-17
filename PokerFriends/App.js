import 'react-native-gesture-handler';
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import{NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'

import LandingPage from './Components/LandingPage'
import Register from '../PokerFriends/Components/Register';
import Login from './Components/Login'
import ForgotPassword from './Components/ForgotPassword'
import GameSetting from './Components/GameSetting'

const Stack = createStackNavigator();

const App = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{headerShown: false}}>
        <Stack.Screen name = "GameSetting" component = {GameSetting}/>
        <Stack.Screen name = "Login" component = {Login}/>
        <Stack.Screen name = "Register" component = {Register}/>
        <Stack.Screen name = "LandingPage" component = {LandingPage}/>
        <Stack.Screen name = "ForgotPassword" component = {ForgotPassword}/>
        
      </Stack.Navigator>
    </NavigationContainer>
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
