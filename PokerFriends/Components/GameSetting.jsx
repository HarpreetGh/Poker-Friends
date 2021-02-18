import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export default class GameSetting extends Component {
    render() { 
        return ( 
            <View style = {styles.container} OrientationLock = {this.state}  >

                <TouchableOpacity 
                    style={styles.exitButton}
                    onPress = {() => {
                        this.props.navigation.navigate('LandingPage'); 
                        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                    }} 
                >
                    <Text style={styles.textStyle}>Exit</Text>
                </TouchableOpacity>
                <View style={styles.webcam1}>
                    <Text>Webcam 1</Text> 
                </View>
                <View style={styles.webcam2}>
                    <Text>Webcam 2</Text> 
                </View>
                <View style={styles.pot}>
                    <Text>Pot:</Text>
                    <Text>$420</Text> 
                </View>
                <View style={styles.webcam3}>
                    <Text>Webcam 3</Text> 
                </View>
            </View>

         );
    }
}
 

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#2ecc71',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
    },
    textStyle:{
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      exitButton:{
        borderRadius: 2,
        alignItems: 'center',
        paddingTop: 10,
        marginTop: 15,
        marginLeft: 10,
        backgroundColor: "#778899",
        width: 50,
        height: 40,
      },
      webcam1:{
          borderRadius: 2,
          borderColor: "#FFFFFF",
          marginTop: 10,
          paddingVertical: 20,
          paddingHorizontal: 20,
          backgroundColor: "#778899",
          marginHorizontal: 70,
      },
      webcam2:{
        borderRadius: 2,
        borderColor: "black",
        marginTop: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: "#778899",
        marginHorizontal: 10,
    },
    pot:{
        borderRadius: 2,
        borderColor: "black",
        marginTop: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: "#778899",
        marginLeft: 60,
    },
    webcam3:{
        borderRadius: 2,
        borderColor: "black",
        marginTop: 50,
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: "#778899",
        marginHorizontal: 10,
    },
  });
