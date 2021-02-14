import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView } from 'react-native';
import HelpButton from './HelpButton'
import Login from './Login'
import Register from './Register'


export default class LandingPage extends Component {
   render(){    
      return (
      <View style={styles.container}>
          <Register/>
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