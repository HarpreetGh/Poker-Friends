import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, Pressable, TouchableOpacity } from 'react-native';
import HelpButton from './HelpButton'
import Logo from './Logo'
import Login from './Login'
import Register from './Register'
import firebase from 'firebase'
import ForgotPassword from './ForgotPassword'

const LogOut = () => {
  firebase.auth().signOut()
  .then(() => {
    console.log('worked?')
  // Sign-out successful.
  }).catch((error) => {
    consol.log(error)
    // An error happened.
  });
}

export default class LandingPage extends Component {
  SignedIn = () =>{
    return(
      <Pressable
        onPress={() => LogOut()}
      >
        <Text style={styles.textStyle}>Log Out</Text>
      </Pressable>
    )
  }

  SignedOut = () => {
    return(
      <Text>Fix Navigator then use this.</Text>
    )
  }
    render(){    
        return (
          <View style={styles.container}>
            <Logo/>
            {this.props.data? (this.SignedIn()):(this.SignedOut())}
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
  }
});