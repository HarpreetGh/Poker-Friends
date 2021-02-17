import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export default class GameSetting extends Component {
    render() { 
        return ( 
            <View style = {styles.container} OrientationLock = {this.state}  >
                <Text>Hello there</Text>
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
