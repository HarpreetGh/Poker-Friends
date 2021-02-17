import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView } from 'react-native';
import LoginForm from '../Components/LoginForm';
import Logo from '../Components/Logo';

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <KeyboardAvoidingView style={styles.container}>

        <Logo />

        <KeyboardAvoidingView style={styles.Container}>
          <LoginForm navigation = {this.props.navigation} />
        </KeyboardAvoidingView>
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
  }
});
