import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, Touchable } from 'react-native';
import Logo from './Logo';

import firebase from 'firebase'


export default class AccountSettings extends Component {
  

  render(){
    var user = firebase.auth().currentUser;
    return (
        <KeyboardAvoidingView 
          style={styles.container}
          >
            <Image  source ={{ uri: user.photoURL }} style={{ width: 200, height: 200, marginBottom: 20, borderRadius: 100}} />
            <Text style={styles.title}>{user.displayName}'s Account Settings</Text>
          
            <TouchableOpacity style={styles.buttonContainer}
              onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                <Text style={styles.textStyle}>Password Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer}
              onPress={() => this.props.navigation.navigate('ChangeUsername')}>
                <Text style={styles.textStyle}>Change Username</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('ChangeEmail')}>
                <Text style={styles.textStyle}>Change Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer}
              onPress={() => this.props.navigation.navigate('ChangeAvatar')}>
                <Text style={styles.textStyle}>Change Avatar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer}
              onPress={() => this.props.navigation.navigate('DeleteAccount')}>
                <Text style={styles.textStyle}>Delete Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer}
              onPress={() => this.props.navigation.navigate('LandingPage')}>
                  <Text style={styles.textStyle}>Go Back</Text>
              </TouchableOpacity>

        </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    marginBottom: 50
  },
    container: {
      padding: 20,
      flex: 1,
      backgroundColor: '#2ecc71',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonContainer:{
      backgroundColor: '#27ae60',
      paddingVertical: 20,
      padding: 20,
      borderRadius: 50,
      width:"100%",
      marginBottom: 20
    },
    input: {
      height:40,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      marginBottom: 20,
      color: '#FFF',
      paddingHorizontal: 20,
      paddingEnd: 10,
      borderRadius: 50,
      width:'100%'
    },
})