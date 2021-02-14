import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, Pressable } from 'react-native';
import HelpButton from './HelpButton'


export default class LandingPage extends Component {
    render(){    
        return (
          <View style={styles.container}>
          <Pressable>
                <Text>Sign Out</Text>
          </Pressable>
          <HelpButton/>
          </View>
        );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 50,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center',
  }
});