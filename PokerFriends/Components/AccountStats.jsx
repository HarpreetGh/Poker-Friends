import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native'



export default class AccountStats extends Component {
    state = {  }



    render() { 
        return ( 
        <View style = {styles.container}>
            <View>
                <Text style = {styles.title}>"Players" Stats</Text>
            </View>

            <View>
                <Text style = {styles.StatHolder}>Wins : 0</Text>
            </View>

            <View>
                <Text style = {styles.StatHolder}>Losses : 0</Text>
            </View>

            <View>
                <Text style = {styles.StatHolder}>Win/Loss Ratio : 50%</Text>
            </View>

            <View>
                <Text style = {styles.StatHolder}>Games Played : 0</Text>
            </View>

            <View>
                <Text style = {styles.StatHolder}>Chips : 0</Text>
            </View>

            <View>
                <Text style = {styles.StatHolder}>Life Time Earnings: 0 </Text>
            </View>
        </View> );
    }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2ecc71',
        alignItems: 'center',
        justifyContent: 'center',
      },
      title:{
        bottom: '600%',
        fontSize: 25
      },
      StatHolder: {
        borderRadius: 50,

        padding: 10,
        elevation: 2,
        backgroundColor: "#27ae60"
      }
})
