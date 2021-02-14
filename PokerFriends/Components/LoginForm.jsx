import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Touchable, KeyboardAvoidingView } from 'react-native';

export default function LoginForm () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior = 'padding'
    >
      <TextInput
          placeholder="Email"
          placeholderTextColor="rgba(255, 255, 255, 0.75)"
          returnKeyType="next"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={() => this.passwordInput.focus()}
          style={styles.input} 

          onChangeText={text => setEmail(text)}
          value={email}
      />

      <TextInput
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.75)"
          returnKeyType="go"
          secureTextEntry
          style={styles.input} 
          //ref={(input) => this.passwordInput = input}

          onChangeText={text => setPassword(text)}
          value={password}
      />

      <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity>
          <Text style={styles.registerButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
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
