import React, { Component, useState } from 'react'
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, Touchable } from 'react-native';
import Logo from '../Components/Logo';
import firebase from 'firebase'
//import 'firebase/auth'

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const SignUp = () => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
    }

    return (
        <KeyboardAvoidingView 
          style={styles.container} 
          behavior = 'padding'>

            <Logo />

            <TextInput
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.75)"
                returnKeyType="next"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={() => this.passwordInput.focus()}
                style={styles.input}
                //ref={(input) => this.emailInput = input}

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

            <TouchableOpacity style={styles.buttonContainer} onPress={SignUp}>
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    );
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
      height: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      marginBottom: 20,
      color: '#FFF',
      paddingHorizontal: 20,
      paddingEnd: 10,
      borderRadius: 50
    },
})