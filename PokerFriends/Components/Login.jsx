import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView } from 'react-native';
import LoginForm from '../Components/LoginForm';

export default class Login extends Component {
  render(){
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.container}>

        <View style={styles.logoContainer}>
          <Image 
            style={styles.logo} 
            source={require('../Images/placeholderLOGO.png')} />

          <Text style={styles.title}> Play Poker with friends! </Text>
        </View>


        <View style={styles.Container}>
          <LoginForm />
        </View>
      </KeyboardAvoidingView>
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
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center'
  },
  logo: {
    width: 100,
    height: 100
  },
  title: {
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  }
});
