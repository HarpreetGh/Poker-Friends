import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import HelpButton from './HelpButton'
import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import Logo from './Logo';
import * as ScreenOrientation from 'expo-screen-orientation';


export default class LandingPage extends Component {
   render(){    
      return (
      <View 
        style={styles.container}
        behavior = 'padding'
      >
          <TouchableOpacity 
          style={styles.button}
          onPress = {() => {
            this.props.navigation.navigate('GameSetting'); 
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
          }} 

          
          >
            <Text style={styles.textStyle}>Play Game</Text>
          </TouchableOpacity>

          <HelpButton></HelpButton>
      </View>
      );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle:{
    alignItems: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  button:{
    borderRadius: 2,
    marginVertical: 100,
    padding: 15,
    backgroundColor: "#778899",
  }
});