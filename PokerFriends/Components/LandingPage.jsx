import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, Pressable, TouchableOpacity } from 'react-native';
import HelpButton from './HelpButton'
import Logo from './Logo'
import Login from './Login'
import Register from './Register'
import firebase from 'firebase'
import ForgotPassword from './ForgotPassword'
import * as ScreenOrientation from 'expo-screen-orientation';

const LogOut = () => {
  firebase.auth().signOut()
  .then(() => {
    console.log('worked?')
  // Sign-out successful.
  }).catch((error) => {
    console.log(error)
    // An error happened.
  });
}

export default class LandingPage extends Component {
  SignedIn = () =>{
    return(
      <View>
        <TouchableOpacity style={styles.button} 
          onPress = {() => LogOut()}>
              <Text style={styles.textStyle}>Log Out</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress = {() => {
            this.props.navigation.navigate('GameSetting'); 
            ScreenOrientation.lockAsync
            (ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
          }}
        >
          <Text style={styles.textStyle}>Play Game</Text>
        </TouchableOpacity>
      </View>
    )
  }

  SignedOut = () => {
    return(
      <View>

        <TouchableOpacity style={styles.button} 
          onPress = {() => this.props.navigation.navigate('Register')}>
              <Text style={styles.textStyle}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} 
          onPress = {() => this.props.navigation.navigate('Login')}>
              <Text style={styles.textStyle}>Login</Text>
        </TouchableOpacity>

      </View>
    )
  }
    render(){    
        return (
          <View style={styles.container}>
            <Logo/>
            {this.props.LoggedIn? (this.SignedIn()):(this.SignedOut())}
            <HelpButton/>
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
    fontWeight: 'bold'
  },
  button:{
    backgroundColor: '#27ae60',
    paddingVertical: 20,
    padding: 50,
    borderRadius: 50,
    width:"100%",
    marginBottom: 20
  }
});