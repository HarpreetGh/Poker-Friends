import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Touchable, KeyboardAvoidingView, Alert} from 'react-native';
import firebase from 'firebase'

export default class LoginForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }
  Login() {
    firebase.auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password.trim())
    .then(() =>{
      this.props.navigation.navigate('LandingPage')
    })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        Alert.alert( 'ERROR',errorMessage)
      });
    }

  render(){
    return(
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      behavior = 'padding'
    >
      <TextInput
          placeholder="Email"
          placeholderTextColor="rgba(255, 255, 255, 0.75)"
          returnKeyType="next"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType='email'
          autoCorrect={false}
          //onSubmitEditing={() => this.passwordInput.focus()}
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

      <TouchableOpacity onPress = {() => this.props.navigation.navigate('ForgotPassword')} >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer} onPress = {() => this.Login()}>
          <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress = {() => this.props.navigation.navigate('Register')}>
          <Text style={styles.registerButtonText}>Sign Up</Text>
      </TouchableOpacity>

    </KeyboardAvoidingView>
    )
    }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  forgotPassword:{
    color:'#FFF',
    fontSize: 11,
    marginBottom: 20,
    opacity: 0.8
  },   
  buttonContainer:{
    backgroundColor: '#27ae60',
    paddingVertical: 20,
    padding: 20,
    borderRadius: 50,
    width:"100%",
    marginBottom: 20
  },
  forgotPassword:{
    color:'#FFF',
    marginBottom: 10,
    opacity: 0.7,
  },
  loginButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '900'
  },
  registerButtonText:{
      textAlign: 'center',
      color: '#FFF',
      marginBottom: 10
  }
});
