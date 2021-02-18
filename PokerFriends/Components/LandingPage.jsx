import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, Pressable, TouchableOpacity } from 'react-native';
import HelpButton from './HelpButton'
import Logo from './Logo'
import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import * as ScreenOrientation from 'expo-screen-orientation';
import firebase from 'firebase'


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
  /*constructor(props){
    super(props)
      this.state = {
        LoggedIn: true,
      }    
    firebase.auth().onAuthStateChanged((user) => {
      console.log(!!user)
      this.setState({LoggedIn: !!user})
    })
  }*/

  SignedIn = () =>{
    return(
      <View>
        <TouchableOpacity style={styles.button} 
          onPress = {() => LogOut()}>
              <Text style={styles.registerButtonText}>Log Out</Text>
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
              <Text style={styles.registerButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} 
          onPress = {() => this.props.navigation.navigate('Login')}>
              <Text style={styles.registerButtonText}>Login</Text>
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
    fontWeight: 'bold',
  },
  button:{
    borderRadius: 2,
    marginVertical: 25,
    padding: 15,
    backgroundColor: "#778899",
  }
});