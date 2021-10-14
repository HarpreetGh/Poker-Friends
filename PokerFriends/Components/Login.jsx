import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Touchable, Keyboard, KeyboardAvoidingView, Alert} from 'react-native';
import firebase from 'firebase'
import Logo from '../Components/Logo';

export default class Login extends Component {
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
    return (
      <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS === "ios" ? "position" : "height"}
        contentContainerStyle={[styles.container, {marginBottom: -30}]}
      >

        <Logo />

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

        <TouchableOpacity onPress = {() => {
          Keyboard.dismiss()
          setTimeout(() => {  this.props.navigation.navigate('ForgotPassword'); }, 10);
          
          }} >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress = {() => this.Login()}>
          <Text style={styles.registerButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.buttonContainer, {marginBottom: 30}]}
          onPress = {() => this.props.navigation.navigate('LandingPage')}>
          <Text style={styles.registerButtonText}>Go Back</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    width: '100%',
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center'
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
    color: '#FFF'
  }
});
