import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, 
  TextInput, TouchableOpacity, Touchable, Alert } from 'react-native';
import Logo from '../Components/Logo';
import firebase from 'firebase'

export default class Register extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      time: ''
    }
  }

  SignUp(){
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredential) =>{
        var user = firebase.auth().currentUser;
          if (user) {
            this.setState({username: this.state.username+"#"+user.uid})
            user.updateProfile({
              displayName: this.state.username
            })
              .then(() => {
                this.InitializeUserInDB(user)
                this.props.navigation.navigate('LandingPage')
              })
              .catch(function(error) {
                console.log(error)
              })
          }
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      Alert.alert(errorCode, errorMessage);
    });
  }

  InitializeUserInDB(user){
    firebase.database().ref('users/' + user.uid ).set({
      username: this.state.username,
      email: this.state.email,
      chips: 1000,
      friends: '',
      games: 0,
      wins: 0,
      chips_lost: 0,
      chips_won: 0,
    });
  }

  render(){
    return (
        <KeyboardAvoidingView 
          style={styles.container}
          >
            <Logo />

            <TextInput
                placeholder="Username"
                placeholderTextColor="rgba(255, 255, 255, 0.75)"
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType='username'
                style={styles.input}
                onChangeText={text => this.setState({username: text})}
                value={this.state.username}
            />

            <TextInput
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.75)"
                returnKeyType="next"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType='email'
                onSubmitEditing={() => this.passwordInput.focus()}
                style={styles.input}
                onChangeText={text => this.setState({email: text})}
                value={this.state.email}
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.75)"
                returnKeyType="go"
                secureTextEntry
                autoCompleteType='password'
                style={styles.input} 
                onChangeText={text => this.setState({password: text})}
                value={this.state.password}
            />

            <TouchableOpacity style={styles.buttonContainer} onPress={() => this.SignUp()}>
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
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
    registerButtonText: {
      textAlign: 'center',
      color: '#FFF',
      fontWeight: '900'
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