import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, StatusBar, Image, Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';


export default class GameSetting extends Component {
    
    render() { 
        return (  
           

            <View style = {styles.container}>
                <StatusBar hidden/>
                <View>
                <TouchableOpacity 
                    style={styles.exitButton}
                    onPress = {() => {
                        this.props.navigation.navigate('LandingPage'); 
                        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
                    }} 
                >
                <Text style={styles.textStyle}>Exit</Text>
                </TouchableOpacity>
                </View>

                <View>
                <View style={styles.webcam2}>
                    <Text>Webcam 2</Text> 
                </View> 
                </View>

                <View>

                <View style={styles.webcam1}>
                    <Text>Webcam 1</Text> 
                </View>
                </View>
                
                <View>
                <Image style = {styles.playtable}
                
                source = {require('../assets/pokertable.png')}
                />
                </View>

               
                
                <View>
                <View style={styles.webcam3}>
                    <Text>Webcam 3</Text> 
                </View>
                </View>
                
                <View>
                <View style={styles.pot}>
                <Image style = {{   
                    width: 50, 
                    height:50,
                    resizeMode: 'contain',
                    marginTop: -10,
                    marginLeft: -50,
                    }}
                    source={require('../assets/table.png')}
                />
                   
                    <Text style = {{ fontSize: 20 ,fontWeight: 'bold',color: 'white'}}>
                        Pot: $420
                    </Text>
                </View>
                </View>
                
                <View>
                <View style={styles.webcam4}>
                    <Text>Webcam 4</Text> 
                </View>
                </View>
                
                
                <Image style = {styles.dealer}
                
                source = {require('../assets/cards.png')}
                />
                <View>
                <View style = {styles.chipAmount}>
                    <Text style = {{ right: 15, fontSize: 20, fontWeight: 'bold' }}>
                        100
                    </Text>
                    <Image
                    style = {{
                    width: 40, 
                    height:40,
                    resizeMode: 'contain',
                    marginLeft: 25,
                    marginTop: -32,
                    marginRight: -10
                    }}
                     source={require('../assets/chipAmount.png')}
                    />
                   
                </View>
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
    dealer: {
      width: 100, 
      height:100,
      resizeMode: 'contain',
      marginLeft: 320,
      marginTop: -125,
    },
    textStyle:{
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    exitButton:{
        borderRadius: 2,
        alignItems: 'center',
        paddingTop: 10,
        marginTop: 10,
        marginLeft: 10,
        backgroundColor: "#778899",
        width: 40,
        height: 40,
      },
      webcam1:{
        marginTop: 160,
        marginLeft: -285,
        marginRight: 200,
        borderRadius: 2,
        borderColor: 'black',
        paddingVertical: 30,
        paddingHorizontal: 10,
        backgroundColor:"#778899"
    
        
    },
      webcam2:{
        borderRadius: 2,
        borderColor: "black",
        marginTop: 2,
        marginLeft: 150,
        paddingVertical: 30,
        paddingHorizontal: 10,
        backgroundColor: "#778899",
       
    },
    webcam3:{
        borderRadius: 2,
        borderColor: "black",
        marginTop: 2,
        marginLeft: -175,
        marginRight: 100,
        paddingVertical: 30,
        paddingHorizontal: 10,
        backgroundColor: "#778899",
        marginHorizontal: 10,
    },
    webcam4:{
        marginTop: 160,
        marginRight: -25,
        borderRadius: 2,
        borderColor: 'black',
        paddingVertical: 30,
        paddingHorizontal: 10,
        backgroundColor:"#778899"
    },
    pot:{
        borderRadius: 2,
        borderColor: "black",
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 0,
        marginLeft: 0,
        marginRight: -60,
        marginTop: 0    
        
    },
     chipAmount: {
        borderRadius: 2,
        borderColor: 'black',
        paddingVertical: 0,
        paddingHorizontal: 14,
        backgroundColor:"white",
        marginTop: -55,
        marginLeft: 240
     },
     playtable: {
        width: 500, 
        height:500,
        resizeMode: 'contain',
        marginLeft: -165,
        marginTop: -70,
       

         
     }
   
  });
